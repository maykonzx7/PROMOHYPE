import puppeteer from "puppeteer";

/**
 * Scraper para Mercado Livre com Crawling
 * Busca produtos em promoção nas principais categorias
 * Navega por múltiplas páginas e coleta dados detalhados
 *
 * @param {Array} searchTerms - Termos de busca
 * @param {Object} options - Opções de crawling
 * @param {number} options.maxPages - Número máximo de páginas para navegar (padrão: 3)
 * @param {boolean} options.visitProductPages - Se deve visitar páginas individuais de produtos (padrão: false)
 * @param {number} options.maxProductsPerPage - Máximo de produtos por página (padrão: 20)
 */
export default async function scrapeMercadoLivre(
  searchTerms = ["smartphone", "notebook", "tv", "headphone", "tablet"],
  options = {}
) {
  const {
    maxPages = 3,
    visitProductPages = false,
    maxProductsPerPage = 20,
  } = options;
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-blink-features=AutomationControlled",
      "--disable-dev-shm-usage",
    ],
  });

  const page = await browser.newPage();

  // User agent realista
  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
  );

  // Configurar viewport
  await page.setViewport({ width: 1920, height: 1080 });

  // Permitir carregamento de imagens pequenas (thumbnails) mas bloquear imagens grandes
  await page.setRequestInterception(true);
  page.on("request", (req) => {
    if (req.resourceType() === "image") {
      const url = req.url();
      // Permitir imagens pequenas/thumbnails que geralmente contêm o produto
      // Bloquear apenas imagens muito grandes ou de banner
      if (
        url.includes("thumbnail") ||
        url.includes("thumb") ||
        url.includes("small") ||
        url.includes("product") ||
        url.includes("item") ||
        url.length < 200
      ) {
        req.continue();
      } else {
        req.abort();
      }
    } else {
      req.continue();
    }
  });

  const allPromotions = [];

  try {
    for (const searchTerm of searchTerms) {
      console.log(`Buscando "${searchTerm}" no Mercado Livre...`);

      try {
        await page.goto(`https://www.mercadolivre.com.br/`, {
          waitUntil: "domcontentloaded",
          timeout: 30000,
        });

        // Aguardar campo de busca
        await page.waitForSelector(
          'input[name="as_word"], input[placeholder*="buscar"], input[class*="search"]',
          {
            timeout: 10000,
          }
        );

        // Buscar campo de busca (tentar diferentes seletores)
        const searchInput =
          (await page.$('input[name="as_word"]')) ||
          (await page.$('input[placeholder*="buscar"]')) ||
          (await page.$('input[class*="search"]'));

        if (searchInput) {
          await searchInput.click({ clickCount: 3 });
          await searchInput.type(searchTerm, { delay: 100 });
          await page.keyboard.press("Enter");
        } else {
          // Tentar navegar direto para a URL de busca
          await page.goto(
            `https://www.mercadolivre.com.br/lista/${encodeURIComponent(
              searchTerm
            )}`,
            {
              waitUntil: "domcontentloaded",
              timeout: 30000,
            }
          );
        }

        // CRAWLING: Navegar por múltiplas páginas de resultados
        for (let pageNum = 1; pageNum <= maxPages; pageNum++) {
          console.log(`  📄 Processando página ${pageNum} de ${maxPages}...`);

          // Se não é a primeira página, navegar para a próxima
          if (pageNum > 1) {
            try {
              // Tentar encontrar e clicar no botão "Próxima" ou navegar pela URL
              const nextButton = await page.$(
                ".andes-pagination__button--next, [aria-label='Próxima'], .ui-search-pagination__link"
              );
              if (nextButton) {
                await nextButton.click();
                await new Promise((resolve) => setTimeout(resolve, 2000));
              } else {
                // Tentar navegar pela URL diretamente
                const currentUrl = page.url();
                const nextPageUrl = currentUrl.includes("_Desde_")
                  ? currentUrl.replace(
                      /_Desde_\d+/,
                      `_Desde_${(pageNum - 1) * 50}`
                    )
                  : `${currentUrl}${
                      currentUrl.includes("?") ? "&" : "?"
                    }_Desde_${(pageNum - 1) * 50}`;

                await page.goto(nextPageUrl, {
                  waitUntil: "domcontentloaded",
                  timeout: 30000,
                });
              }
            } catch (error) {
              console.log(
                `  ⚠️  Não foi possível navegar para página ${pageNum}, parando crawling`
              );
              break;
            }
          }

          // Aguardar resultados carregarem
          try {
            await page.waitForSelector(
              ".ui-search-layout__item, .ui-search-result",
              {
                timeout: 20000,
              }
            );
          } catch (error) {
            console.log(
              `  ⚠️  Página ${pageNum} não carregou resultados, parando crawling`
            );
            break;
          }

          // Scroll para carregar mais produtos e imagens lazy
          await page.evaluate(() => {
            window.scrollBy(0, 500);
          });
          await new Promise((resolve) => setTimeout(resolve, 1000));

          // Scroll adicional para garantir que imagens lazy sejam carregadas
          await page.evaluate(() => {
            window.scrollBy(0, 500);
          });
          await new Promise((resolve) => setTimeout(resolve, 1000));

          // Forçar carregamento de imagens lazy executando scroll em cada item
          await page.evaluate(() => {
            const items = document.querySelectorAll(
              ".ui-search-layout__item, .ui-search-result"
            );
            items.forEach((item, index) => {
              if (index < 20) {
                item.scrollIntoView({ behavior: "smooth", block: "center" });
              }
            });
          });
          await new Promise((resolve) => setTimeout(resolve, 1500));

          const products = await page.evaluate((maxProducts) => {
            const items = Array.from(
              document.querySelectorAll(
                ".ui-search-layout__item, .ui-search-result"
              )
            ).slice(0, maxProducts);

            return items
              .map((item) => {
                try {
                  // Título
                  const titleEl = item.querySelector(
                    "h2, .ui-search-item__title, .poly-component__title"
                  );
                  const title = titleEl?.innerText?.trim() || "Sem título";

                  // Preço atual (preço promocional ou preço normal)
                  let currentPrice = "Sem preço";
                  let originalPrice = null;
                  let hasPromotion = false;
                  let discount = null;
                  let discountAmount = null;

                  // Preço atual - PRIORIDADE: .andes-money-amount__fraction (preço real do produto)
                  // Esta é a classe que contém o preço real conforme confirmado pelo usuário
                  let priceFound = false;

                  // Método 1: Buscar diretamente por .andes-money-amount__fraction (FONTE PRINCIPAL)
                  // Priorizar o fraction que está no preço principal, não no parcelamento
                  const allFractionEls = item.querySelectorAll(
                    ".andes-money-amount__fraction"
                  );

                  if (allFractionEls.length > 0) {
                    let fractionEl = null;
                    let centsEl = null;

                    // Estratégia: encontrar o fraction do preço principal (não do parcelamento)
                    // O preço principal geralmente está antes do texto de parcelamento

                    // 1. Priorizar fraction dentro de .ui-search-price__second-line (preço principal)
                    const priceSecondLine = item.querySelector(
                      ".ui-search-price__second-line"
                    );
                    if (priceSecondLine) {
                      const moneyAmount = priceSecondLine.querySelector(
                        ".andes-money-amount"
                      );
                      if (moneyAmount) {
                        fractionEl = moneyAmount.querySelector(
                          ".andes-money-amount__fraction"
                        );
                        centsEl = moneyAmount.querySelector(
                          ".andes-money-amount__cents"
                        );
                      }
                    }

                    // 2. Se não encontrou, buscar no primeiro .andes-money-amount (preço atual)
                    if (!fractionEl) {
                      const firstMoneyAmount = item.querySelector(
                        ".andes-money-amount"
                      );
                      if (firstMoneyAmount) {
                        // Verificar se não é do parcelamento (geralmente tem texto "em" ou "x" próximo)
                        const parentText =
                          firstMoneyAmount.parentElement?.innerText || "";
                        if (
                          !parentText.includes(" em ") &&
                          !parentText.includes("x de")
                        ) {
                          fractionEl = firstMoneyAmount.querySelector(
                            ".andes-money-amount__fraction"
                          );
                          centsEl = firstMoneyAmount.querySelector(
                            ".andes-money-amount__cents"
                          );
                        }
                      }
                    }

                    // 3. Se ainda não encontrou, usar o primeiro fraction que não está em contexto de parcelamento
                    if (!fractionEl) {
                      for (const frac of allFractionEls) {
                        const parent = frac.closest(".andes-money-amount");
                        if (parent) {
                          const parentText =
                            parent.parentElement?.innerText || "";
                          // Ignorar se está em contexto de parcelamento
                          if (
                            !parentText.includes(" em ") &&
                            !parentText.includes("x de") &&
                            !parentText.includes("sem juros")
                          ) {
                            fractionEl = frac;
                            centsEl = parent.querySelector(
                              ".andes-money-amount__cents"
                            );
                            break;
                          }
                        }
                      }
                    }

                    // 4. Última opção: usar o primeiro fraction encontrado (pode ser do parcelamento, mas é melhor que nada)
                    if (!fractionEl && allFractionEls.length > 0) {
                      fractionEl = allFractionEls[0];
                      const fractionParent = fractionEl.closest(
                        ".andes-money-amount"
                      );
                      if (fractionParent) {
                        centsEl = fractionParent.querySelector(
                          ".andes-money-amount__cents"
                        );
                      }
                    }

                    if (fractionEl) {
                      const fraction =
                        fractionEl.innerText?.replace(/\D/g, "") || "0";
                      let cents = "00";

                      if (centsEl) {
                        cents = centsEl.innerText?.replace(/\D/g, "") || "00";
                      } else {
                        // Tentar encontrar cents no mesmo container
                        const fractionParent = fractionEl.closest(
                          ".andes-money-amount"
                        );
                        if (fractionParent) {
                          const nearbyCents = fractionParent.querySelector(
                            ".andes-money-amount__cents"
                          );
                          if (nearbyCents) {
                            cents =
                              nearbyCents.innerText?.replace(/\D/g, "") || "00";
                          }
                        }
                      }

                      if (fraction && fraction !== "0") {
                        // Formatar preço: adicionar pontos de milhar se necessário
                        const fractionNum = parseInt(fraction);
                        // Formatar manualmente para evitar problemas com toLocaleString
                        let formattedFraction = fraction;
                        if (fractionNum >= 1000) {
                          formattedFraction = fraction.replace(
                            /\B(?=(\d{3})+(?!\d))/g,
                            "."
                          );
                        }
                        const formattedCents =
                          cents && cents !== "00"
                            ? "," + cents.padStart(2, "0").slice(0, 2)
                            : "";
                        currentPrice = `R$ ${formattedFraction}${formattedCents}`;
                        priceFound = true;
                      }
                    }
                  }

                  // Método 2: Se não encontrou, buscar pelo container de preço principal
                  if (!priceFound) {
                    const priceSelectors = [
                      ".ui-search-price__second-line .andes-money-amount",
                      ".ui-search-price .andes-money-amount",
                      ".poly-price__current",
                      ".price-tag",
                      ".andes-money-amount",
                    ];

                    for (const selector of priceSelectors) {
                      const priceContainer = item.querySelector(selector);
                      if (priceContainer) {
                        const fractionEl = priceContainer.querySelector(
                          ".andes-money-amount__fraction"
                        );
                        const centsEl = priceContainer.querySelector(
                          ".andes-money-amount__cents"
                        );

                        if (fractionEl) {
                          const fraction =
                            fractionEl.innerText?.replace(/\D/g, "") || "0";
                          const cents =
                            centsEl?.innerText?.replace(/\D/g, "") || "00";

                          if (fraction && fraction !== "0") {
                            const fractionNum = parseInt(fraction);
                            // Formatar manualmente
                            let formattedFraction = fraction;
                            if (fractionNum >= 1000) {
                              formattedFraction = fraction.replace(
                                /\B(?=(\d{3})+(?!\d))/g,
                                "."
                              );
                            }
                            const formattedCents =
                              cents && cents !== "00"
                                ? "," + cents.padStart(2, "0").slice(0, 2)
                                : "";
                            currentPrice = `R$ ${formattedFraction}${formattedCents}`;
                            priceFound = true;
                            break;
                          }
                        }

                        // Tentar pelo texto completo
                        const priceText =
                          priceContainer.innerText?.trim() || "";
                        const priceMatch = priceText.match(
                          /R\$\s*([\d]{1,3}(?:\.\d{3})*(?:,\d{2})?)/
                        );
                        if (priceMatch) {
                          currentPrice = priceMatch[0].trim();
                          priceFound = true;
                          break;
                        }
                      }
                    }
                  }

                  // Método 3: Buscar por atributo aria-label (Mercado Livre usa para acessibilidade)
                  if (!priceFound) {
                    const ariaPriceEls = item.querySelectorAll(
                      "[aria-label*='reais'], [aria-label*='Real'], [aria-roledescription='Valor']"
                    );
                    for (const ariaEl of ariaPriceEls) {
                      const ariaLabel = ariaEl.getAttribute("aria-label") || "";
                      // Extrair número completo do aria-label (ex: "899 reais")
                      const priceMatch = ariaLabel.match(
                        /(\d+(?:\s+\d+)*)\s*(?:reais|Real)/i
                      );
                      if (priceMatch) {
                        const priceValue = priceMatch[1].replace(/\s/g, "");
                        const priceNum = parseInt(priceValue);
                        // Formatar manualmente
                        let formattedPrice = priceValue;
                        if (priceNum >= 1000) {
                          formattedPrice = priceValue.replace(
                            /\B(?=(\d{3})+(?!\d))/g,
                            "."
                          );
                        }
                        currentPrice = `R$ ${formattedPrice}`;
                        priceFound = true;
                        break;
                      }
                    }
                  }

                  // Método 4: Última tentativa - buscar qualquer texto que pareça preço no item
                  if (!priceFound) {
                    const allText = item.innerText || "";
                    // Melhorar regex para capturar diferentes formatos de preço
                    const priceMatches = allText.match(
                      /R\$\s*(\d{1,3}(?:\.\d{3})*(?:,\d{2})?)/g
                    );
                    if (priceMatches && priceMatches.length > 0) {
                      // Pegar o primeiro preço encontrado (geralmente é o preço atual)
                      currentPrice = priceMatches[0].trim();
                      priceFound = true;
                    }
                  }

                  // Preço original (se houver desconto) - melhorar captura
                  const originalPriceSelectors = [
                    ".ui-search-price__original",
                    ".andes-money-amount--previous",
                    ".price-tag-original",
                    "[class*='original-price']",
                    "[class*='old-price']",
                    "[class*='was-price']",
                    ".ui-search-price__second-line",
                  ];

                  for (const selector of originalPriceSelectors) {
                    const originalPriceEl = item.querySelector(selector);
                    if (originalPriceEl) {
                      // Tentar extrair do texto
                      let originalText =
                        originalPriceEl.innerText?.trim() || "";
                      let originalMatch = originalText.match(/R\$\s*([\d.,]+)/);

                      // Se não encontrou no texto, tentar extrair dos elementos internos
                      if (!originalMatch) {
                        const fractionEl = originalPriceEl.querySelector(
                          ".andes-money-amount__fraction"
                        );
                        const centsEl = originalPriceEl.querySelector(
                          ".andes-money-amount__cents"
                        );
                        if (fractionEl) {
                          const fraction =
                            fractionEl.innerText?.replace(/\D/g, "") || "";
                          const cents =
                            centsEl?.innerText?.replace(/\D/g, "") || "00";
                          if (fraction && fraction !== "0") {
                            originalPrice = `R$ ${fraction}${
                              cents
                                ? "," + cents.padStart(2, "0").slice(0, 2)
                                : ""
                            }`;
                            hasPromotion = true;
                            break;
                          }
                        }
                      } else {
                        originalPrice = `R$ ${originalMatch[1]}`;
                        hasPromotion = true;
                        break;
                      }
                    }
                  }

                  // Calcular desconto se encontrou preço original
                  if (originalPrice && currentPrice !== "Sem preço") {
                    const currentValue = parseFloat(
                      currentPrice.replace(/[^\d,.-]/g, "").replace(",", ".")
                    );
                    const originalValue = parseFloat(
                      originalPrice.replace(/[^\d,.-]/g, "").replace(",", ".")
                    );
                    if (
                      originalValue > currentValue &&
                      !isNaN(currentValue) &&
                      !isNaN(originalValue)
                    ) {
                      const discountPercent = Math.round(
                        ((originalValue - currentValue) / originalValue) * 100
                      );
                      discount = `${discountPercent}%`;
                      discountAmount = `R$ ${(originalValue - currentValue)
                        .toFixed(2)
                        .replace(".", ",")}`;
                    }
                  }

                  // Parcelamento - melhorar captura com múltiplos seletores
                  let installments = null;
                  let installmentValue = null;

                  // Tentar diferentes seletores de parcelamento
                  const installmentSelectors = [
                    ".ui-search-installments",
                    ".ui-search-item__installments",
                    ".installments",
                    "[class*='installment']",
                    "[class*='parcela']",
                    "[data-testid='price-part']",
                    ".ui-pdp-price__part__container",
                  ];

                  for (const selector of installmentSelectors) {
                    const installmentEl = item.querySelector(selector);
                    if (installmentEl) {
                      const installmentText =
                        installmentEl.innerText?.trim() || "";

                      // Extrair número de parcelas (ex: "18x", "em até 10x", "10x de R$ 299,90")
                      const installmentMatch =
                        installmentText.match(/(\d+)\s*x/);
                      if (installmentMatch) {
                        installments = parseInt(installmentMatch[1]);

                        // Extrair valor da parcela - procurar por padrões como "R$ 49,94"
                        const valueMatch =
                          installmentText.match(/R\$\s*([\d.,]+)/);
                        if (valueMatch) {
                          const parcelPrice = valueMatch[1];
                          // Verificar se menciona "sem juros"
                          const semJuros =
                            installmentText
                              .toLowerCase()
                              .includes("sem juros") ||
                            installmentText.toLowerCase().includes("sem juro");
                          installmentValue = `R$ ${parcelPrice} em ${installments}x${
                            semJuros ? " sem juros" : ""
                          }`;
                        } else {
                          // Tentar extrair do HTML diretamente
                          const pricePart = installmentEl.querySelector(
                            "[data-testid='price-part']"
                          );
                          if (pricePart) {
                            const fractionEl = pricePart.querySelector(
                              ".andes-money-amount__fraction"
                            );
                            const centsEl = pricePart.querySelector(
                              ".andes-money-amount__cents"
                            );
                            if (fractionEl) {
                              const fraction =
                                fractionEl.innerText?.replace(/\D/g, "") || "";
                              const cents =
                                centsEl?.innerText?.replace(/\D/g, "") || "00";
                              const parcelPrice = `${fraction},${cents
                                .padStart(2, "0")
                                .slice(0, 2)}`;
                              const semJuros = installmentText
                                .toLowerCase()
                                .includes("sem juros");
                              installmentValue = `R$ ${parcelPrice} em ${installments}x${
                                semJuros ? " sem juros" : ""
                              }`;
                            }
                          } else {
                            installmentValue = `em até ${installments}x`;
                          }
                        }
                        break;
                      }
                    }
                  }

                  // Link
                  const linkEl = item.querySelector(
                    "a[href*='produto'], a[href*='item']"
                  );
                  const link =
                    linkEl?.href || item.querySelector("a")?.href || "";

                  // Imagem - melhorar captura com múltiplos métodos
                  let image = "";
                  const imgSelectors = [
                    "img[data-src]",
                    "img[src]",
                    "img",
                    ".ui-search-result-image__element",
                    "[class*='image'] img",
                    "[class*='Image'] img",
                  ];

                  // Tentar encontrar imagem com múltiplos seletores
                  for (const selector of imgSelectors) {
                    const imgEl = item.querySelector(selector);
                    if (imgEl) {
                      // Tentar múltiplos atributos em ordem de prioridade
                      const imageAttributes = [
                        "data-src", // Lazy loading
                        "src", // Atributo padrão
                        "data-lazy-src", // Lazy loading alternativo
                        "data-original", // Imagem original
                        "data-srcset", // Responsive images
                        "data-lazy", // Outro formato lazy
                        "srcset", // Responsive images padrão
                      ];

                      for (const attr of imageAttributes) {
                        const imgUrl = imgEl.getAttribute(attr);
                        if (imgUrl) {
                          // Processar srcset (pode ter múltiplas URLs)
                          if (attr === "data-srcset" || attr === "srcset") {
                            const firstUrl = imgUrl.split(" ")[0];
                            if (
                              firstUrl &&
                              !firstUrl.includes("data:image") &&
                              !firstUrl.includes("placeholder")
                            ) {
                              image = firstUrl.trim();
                              break;
                            }
                          } else {
                            // Verificar se não é placeholder ou data URI
                            if (
                              !imgUrl.includes("data:image") &&
                              !imgUrl.includes("placeholder") &&
                              !imgUrl.includes("loading") &&
                              imgUrl.startsWith("http")
                            ) {
                              image = imgUrl.trim();
                              break;
                            }
                          }
                        }
                      }

                      // Se encontrou uma imagem válida, parar de procurar
                      if (image) break;
                    }
                  }

                  // Se ainda não encontrou, tentar buscar todas as imagens e pegar a maior/melhor
                  if (!image) {
                    const allImgs = item.querySelectorAll("img");
                    for (const img of allImgs) {
                      const src =
                        img.getAttribute("src") || img.getAttribute("data-src");
                      if (
                        src &&
                        src.startsWith("http") &&
                        !src.includes("placeholder") &&
                        !src.includes("loading") &&
                        !src.includes("data:image")
                      ) {
                        // Verificar se parece ser uma imagem de produto (geralmente tem dimensões maiores)
                        const width =
                          img.getAttribute("width") ||
                          img.getAttribute("data-width");
                        const height =
                          img.getAttribute("height") ||
                          img.getAttribute("data-height");
                        if (
                          (!width || parseInt(width) > 100) &&
                          (!height || parseInt(height) > 100)
                        ) {
                          image = src.trim();
                          break;
                        }
                      }
                    }
                  }

                  if (title && currentPrice !== "Sem preço" && link) {
                    return {
                      title: title.substring(0, 200),
                      price: currentPrice, // Mantido para compatibilidade
                      currentPrice: currentPrice,
                      originalPrice: originalPrice,
                      hasPromotion: hasPromotion,
                      discount: discount,
                      discountAmount: discountAmount,
                      installments: installments,
                      installmentValue: installmentValue,
                      link,
                      image,
                      store: "Mercado Livre",
                      category: "Eletrônicos",
                      description: title,
                      availability: true,
                    };
                  }
                  return null;
                } catch (err) {
                  console.error("Erro ao processar item:", err);
                  return null;
                }
              })
              .filter((item) => item !== null);
          }, maxProductsPerPage);

          if (products && products.length > 0) {
            // Se visitProductPages está habilitado, visitar cada página de produto para obter mais detalhes
            if (visitProductPages) {
              console.log(
                `  🔍 Visitando páginas individuais de ${Math.min(
                  products.length,
                  5
                )} produtos...`
              );
              for (let i = 0; i < products.length && i < 5; i++) {
                // Limitar a 5 produtos por página
                const product = products[i];
                if (product.link) {
                  try {
                    const productPage = await browser.newPage();
                    await productPage.goto(product.link, {
                      waitUntil: "domcontentloaded",
                      timeout: 15000,
                    });

                    // Coletar informações adicionais da página do produto
                    const additionalData = await productPage.evaluate(() => {
                      return {
                        fullDescription:
                          document
                            .querySelector(".ui-pdp-description__content")
                            ?.innerText?.trim() || "",
                        specifications: Array.from(
                          document.querySelectorAll(".ui-pdp-specs__table tr")
                        ).map((row) => {
                          const key =
                            row.querySelector("th")?.innerText?.trim() || "";
                          const value =
                            row.querySelector("td")?.innerText?.trim() || "";
                          return { key, value };
                        }),
                        rating:
                          document
                            .querySelector(".ui-review-capability__rating")
                            ?.getAttribute("aria-label") || "",
                        reviewsCount:
                          document
                            .querySelector(".ui-review-capability__reviews")
                            ?.innerText?.trim() || "",
                        condition:
                          document
                            .querySelector(".ui-pdp-header__subtitle")
                            ?.innerText?.trim() || "",
                        seller:
                          document
                            .querySelector(".ui-pdp-seller__header__title")
                            ?.innerText?.trim() || "",
                      };
                    });

                    // Atualizar produto com informações adicionais
                    product.description =
                      additionalData.fullDescription || product.description;
                    product.specifications = additionalData.specifications;
                    product.rating = additionalData.rating;
                    product.reviewsCount = additionalData.reviewsCount;
                    product.condition = additionalData.condition;
                    product.seller = additionalData.seller;

                    await productPage.close();
                    await new Promise((resolve) => setTimeout(resolve, 1000));
                  } catch (error) {
                    console.log(
                      `  ⚠️  Erro ao visitar página do produto: ${error.message}`
                    );
                  }
                }
              }
            }

            allPromotions.push(...products);
            console.log(
              `  ✓ Página ${pageNum}: ${products.length} produtos encontrados`
            );
          } else {
            console.log(`  ⚠️  Página ${pageNum}: Nenhum produto encontrado`);
            break; // Se não encontrou produtos, parar de navegar páginas
          }
        } // Fim do loop de páginas

        // Delay entre termos de busca
        await new Promise((resolve) => setTimeout(resolve, 2000));
      } catch (error) {
        console.error(`Erro ao buscar "${searchTerm}":`, error.message);
        continue;
      }
    }

    await browser.close();

    // Remover duplicatas baseado no link
    const uniquePromotions = Array.from(
      new Map(allPromotions.map((p) => [p.link, p])).values()
    );

    console.log(
      `✓ Total de promoções únicas do Mercado Livre: ${uniquePromotions.length}`
    );
    return uniquePromotions;
  } catch (error) {
    console.error("Erro no scraping do Mercado Livre:", error);
    await browser.close();
    return [];
  }
}
