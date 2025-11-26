import puppeteer from "puppeteer";

/**
 * Scraper para Mercado Livre
 * Busca produtos em promoção nas principais categorias
 */
export default async function scrapeMercadoLivre(searchTerms = ['smartphone', 'notebook', 'tv', 'headphone', 'tablet']) {
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-blink-features=AutomationControlled",
      "--disable-dev-shm-usage"
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
  page.on('request', (req) => {
    if (req.resourceType() === 'image') {
      const url = req.url();
      // Permitir imagens pequenas/thumbnails que geralmente contêm o produto
      // Bloquear apenas imagens muito grandes ou de banner
      if (url.includes('thumbnail') || 
          url.includes('thumb') || 
          url.includes('small') ||
          url.includes('product') ||
          url.includes('item') ||
          url.length < 200) {
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
        await page.waitForSelector('input[name="as_word"], input[placeholder*="buscar"], input[class*="search"]', { 
          timeout: 10000 
        });

        // Buscar campo de busca (tentar diferentes seletores)
        const searchInput = await page.$('input[name="as_word"]') || 
                           await page.$('input[placeholder*="buscar"]') ||
                           await page.$('input[class*="search"]');

        if (searchInput) {
          await searchInput.click({ clickCount: 3 });
          await searchInput.type(searchTerm, { delay: 100 });
          await page.keyboard.press("Enter");
        } else {
          // Tentar navegar direto para a URL de busca
          await page.goto(`https://www.mercadolivre.com.br/lista/${encodeURIComponent(searchTerm)}`, {
            waitUntil: "domcontentloaded",
            timeout: 30000,
          });
        }

        // Aguardar resultados carregarem
        await page.waitForSelector(".ui-search-layout__item, .ui-search-result", { 
          timeout: 20000 
        });

        // Scroll para carregar mais produtos e imagens lazy
        await page.evaluate(() => {
          window.scrollBy(0, 500);
        });
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Scroll adicional para garantir que imagens lazy sejam carregadas
        await page.evaluate(() => {
          window.scrollBy(0, 500);
        });
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Forçar carregamento de imagens lazy executando scroll em cada item
        await page.evaluate(() => {
          const items = document.querySelectorAll(".ui-search-layout__item, .ui-search-result");
          items.forEach((item, index) => {
            if (index < 20) {
              item.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
          });
        });
        await new Promise(resolve => setTimeout(resolve, 1500));

        const products = await page.evaluate(() => {
          const items = Array.from(document.querySelectorAll(".ui-search-layout__item, .ui-search-result")).slice(0, 20);
          
          return items.map((item) => {
            try {
              // Título
              const titleEl = item.querySelector("h2, .ui-search-item__title, .poly-component__title");
              const title = titleEl?.innerText?.trim() || "Sem título";

              // Preço atual (preço promocional ou preço normal)
              let currentPrice = "Sem preço";
              let originalPrice = null;
              let hasPromotion = false;
              let discount = null;
              let discountAmount = null;

              // Preço atual - melhorar captura com múltiplos métodos
              // Prioridade: buscar primeiro pelo preço principal (segunda linha de preço)
              let priceFound = false;
              
              // Método 1: Buscar diretamente pelos elementos fraction e cents (mais confiável)
              const allFractionEls = item.querySelectorAll(".andes-money-amount__fraction");
              const allCentsEls = item.querySelectorAll(".andes-money-amount__cents");
              
              if (allFractionEls.length > 0) {
                // Pegar o primeiro fraction encontrado (geralmente é o preço atual)
                const fractionEl = allFractionEls[0];
                const fraction = fractionEl.innerText?.replace(/\D/g, "") || "0";
                
                // Tentar encontrar cents correspondente
                let cents = "00";
                if (allCentsEls.length > 0) {
                  // Procurar o cents que está mais próximo do fraction
                  const fractionParent = fractionEl.closest(".andes-money-amount");
                  if (fractionParent) {
                    const centsEl = fractionParent.querySelector(".andes-money-amount__cents");
                    if (centsEl) {
                      cents = centsEl.innerText?.replace(/\D/g, "") || "00";
                    }
                  } else {
                    // Se não encontrou parent, usar o primeiro cents
                    cents = allCentsEls[0].innerText?.replace(/\D/g, "") || "00";
                  }
                }
                
                if (fraction && fraction !== "0") {
                  // Formatar preço: adicionar pontos de milhar se necessário
                  const fractionNum = parseInt(fraction);
                  // Formatar manualmente para evitar problemas com toLocaleString
                  let formattedFraction = fraction;
                  if (fractionNum >= 1000) {
                    formattedFraction = fraction.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
                  }
                  const formattedCents = cents && cents !== "00" ? ',' + cents.padStart(2, '0').slice(0, 2) : '';
                  currentPrice = `R$ ${formattedFraction}${formattedCents}`;
                  priceFound = true;
                }
              }
              
              // Método 2: Se não encontrou, buscar pelo container de preço principal
              if (!priceFound) {
                const priceSelectors = [
                  ".ui-search-price__second-line .andes-money-amount",
                  ".ui-search-price .andes-money-amount",
                  ".poly-price__current",
                  ".price-tag",
                  ".andes-money-amount"
                ];
                
                for (const selector of priceSelectors) {
                  const priceContainer = item.querySelector(selector);
                  if (priceContainer) {
                    const fractionEl = priceContainer.querySelector(".andes-money-amount__fraction");
                    const centsEl = priceContainer.querySelector(".andes-money-amount__cents");
                    
                    if (fractionEl) {
                      const fraction = fractionEl.innerText?.replace(/\D/g, "") || "0";
                      const cents = centsEl?.innerText?.replace(/\D/g, "") || "00";
                      
                      if (fraction && fraction !== "0") {
                        const fractionNum = parseInt(fraction);
                        // Formatar manualmente
                        let formattedFraction = fraction;
                        if (fractionNum >= 1000) {
                          formattedFraction = fraction.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
                        }
                        const formattedCents = cents && cents !== "00" ? ',' + cents.padStart(2, '0').slice(0, 2) : '';
                        currentPrice = `R$ ${formattedFraction}${formattedCents}`;
                        priceFound = true;
                        break;
                      }
                    }
                    
                    // Tentar pelo texto completo
                    const priceText = priceContainer.innerText?.trim() || "";
                    const priceMatch = priceText.match(/R\$\s*([\d]{1,3}(?:\.\d{3})*(?:,\d{2})?)/);
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
                const ariaPriceEls = item.querySelectorAll("[aria-label*='reais'], [aria-label*='Real'], [aria-roledescription='Valor']");
                for (const ariaEl of ariaPriceEls) {
                  const ariaLabel = ariaEl.getAttribute("aria-label") || "";
                  // Extrair número completo do aria-label (ex: "899 reais")
                  const priceMatch = ariaLabel.match(/(\d+(?:\s+\d+)*)\s*(?:reais|Real)/i);
                  if (priceMatch) {
                    const priceValue = priceMatch[1].replace(/\s/g, "");
                    const priceNum = parseInt(priceValue);
                    // Formatar manualmente
                    let formattedPrice = priceValue;
                    if (priceNum >= 1000) {
                      formattedPrice = priceValue.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
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
                const priceMatches = allText.match(/R\$\s*(\d{1,3}(?:\.\d{3})*(?:,\d{2})?)/g);
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
                ".ui-search-price__second-line"
              ];
              
              for (const selector of originalPriceSelectors) {
                const originalPriceEl = item.querySelector(selector);
                if (originalPriceEl) {
                  // Tentar extrair do texto
                  let originalText = originalPriceEl.innerText?.trim() || "";
                  let originalMatch = originalText.match(/R\$\s*([\d.,]+)/);
                  
                  // Se não encontrou no texto, tentar extrair dos elementos internos
                  if (!originalMatch) {
                    const fractionEl = originalPriceEl.querySelector(".andes-money-amount__fraction");
                    const centsEl = originalPriceEl.querySelector(".andes-money-amount__cents");
                    if (fractionEl) {
                      const fraction = fractionEl.innerText?.replace(/\D/g, "") || "";
                      const cents = centsEl?.innerText?.replace(/\D/g, "") || "00";
                      if (fraction && fraction !== "0") {
                        originalPrice = `R$ ${fraction}${cents ? ',' + cents.padStart(2, '0').slice(0, 2) : ''}`;
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
                const currentValue = parseFloat(currentPrice.replace(/[^\d,.-]/g, '').replace(',', '.'));
                const originalValue = parseFloat(originalPrice.replace(/[^\d,.-]/g, '').replace(',', '.'));
                if (originalValue > currentValue && !isNaN(currentValue) && !isNaN(originalValue)) {
                  const discountPercent = Math.round(((originalValue - currentValue) / originalValue) * 100);
                  discount = `${discountPercent}%`;
                  discountAmount = `R$ ${(originalValue - currentValue).toFixed(2).replace('.', ',')}`;
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
                ".ui-pdp-price__part__container"
              ];
              
              for (const selector of installmentSelectors) {
                const installmentEl = item.querySelector(selector);
                if (installmentEl) {
                  const installmentText = installmentEl.innerText?.trim() || "";
                  
                  // Extrair número de parcelas (ex: "18x", "em até 10x", "10x de R$ 299,90")
                  const installmentMatch = installmentText.match(/(\d+)\s*x/);
                  if (installmentMatch) {
                    installments = parseInt(installmentMatch[1]);
                    
                    // Extrair valor da parcela - procurar por padrões como "R$ 49,94"
                    const valueMatch = installmentText.match(/R\$\s*([\d.,]+)/);
                    if (valueMatch) {
                      const parcelPrice = valueMatch[1];
                      // Verificar se menciona "sem juros"
                      const semJuros = installmentText.toLowerCase().includes('sem juros') || 
                                      installmentText.toLowerCase().includes('sem juro');
                      installmentValue = `R$ ${parcelPrice} em ${installments}x${semJuros ? ' sem juros' : ''}`;
                    } else {
                      // Tentar extrair do HTML diretamente
                      const pricePart = installmentEl.querySelector("[data-testid='price-part']");
                      if (pricePart) {
                        const fractionEl = pricePart.querySelector(".andes-money-amount__fraction");
                        const centsEl = pricePart.querySelector(".andes-money-amount__cents");
                        if (fractionEl) {
                          const fraction = fractionEl.innerText?.replace(/\D/g, "") || "";
                          const cents = centsEl?.innerText?.replace(/\D/g, "") || "00";
                          const parcelPrice = `${fraction},${cents.padStart(2, '0').slice(0, 2)}`;
                          const semJuros = installmentText.toLowerCase().includes('sem juros');
                          installmentValue = `R$ ${parcelPrice} em ${installments}x${semJuros ? ' sem juros' : ''}`;
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
              const linkEl = item.querySelector("a[href*='produto'], a[href*='item']");
              const link = linkEl?.href || item.querySelector("a")?.href || "";

              // Imagem - melhorar captura com múltiplos métodos
              let image = "";
              const imgSelectors = [
                "img[data-src]",
                "img[src]",
                "img",
                ".ui-search-result-image__element",
                "[class*='image'] img",
                "[class*='Image'] img"
              ];
              
              // Tentar encontrar imagem com múltiplos seletores
              for (const selector of imgSelectors) {
                const imgEl = item.querySelector(selector);
                if (imgEl) {
                  // Tentar múltiplos atributos em ordem de prioridade
                  const imageAttributes = [
                    "data-src",           // Lazy loading
                    "src",                // Atributo padrão
                    "data-lazy-src",      // Lazy loading alternativo
                    "data-original",      // Imagem original
                    "data-srcset",        // Responsive images
                    "data-lazy",          // Outro formato lazy
                    "srcset"              // Responsive images padrão
                  ];
                  
                  for (const attr of imageAttributes) {
                    const imgUrl = imgEl.getAttribute(attr);
                    if (imgUrl) {
                      // Processar srcset (pode ter múltiplas URLs)
                      if (attr === "data-srcset" || attr === "srcset") {
                        const firstUrl = imgUrl.split(' ')[0];
                        if (firstUrl && !firstUrl.includes('data:image') && !firstUrl.includes('placeholder')) {
                          image = firstUrl.trim();
                          break;
                        }
                      } else {
                        // Verificar se não é placeholder ou data URI
                        if (!imgUrl.includes('data:image') && 
                            !imgUrl.includes('placeholder') && 
                            !imgUrl.includes('loading') &&
                            imgUrl.startsWith('http')) {
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
                  const src = img.getAttribute("src") || img.getAttribute("data-src");
                  if (src && 
                      src.startsWith('http') && 
                      !src.includes('placeholder') &&
                      !src.includes('loading') &&
                      !src.includes('data:image')) {
                    // Verificar se parece ser uma imagem de produto (geralmente tem dimensões maiores)
                    const width = img.getAttribute("width") || img.getAttribute("data-width");
                    const height = img.getAttribute("height") || img.getAttribute("data-height");
                    if ((!width || parseInt(width) > 100) && (!height || parseInt(height) > 100)) {
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
          }).filter(item => item !== null);
        });

        if (products && products.length > 0) {
          allPromotions.push(...products);
          console.log(`✓ Encontrados ${products.length} produtos para "${searchTerm}"`);
        }

        // Delay entre buscas
        await new Promise(resolve => setTimeout(resolve, 2000));

      } catch (error) {
        console.error(`Erro ao buscar "${searchTerm}":`, error.message);
        continue;
      }
    }

    await browser.close();
    
    // Remover duplicatas baseado no link
    const uniquePromotions = Array.from(
      new Map(allPromotions.map(p => [p.link, p])).values()
    );

    console.log(`✓ Total de promoções únicas do Mercado Livre: ${uniquePromotions.length}`);
    return uniquePromotions;

  } catch (error) {
    console.error("Erro no scraping do Mercado Livre:", error);
    await browser.close();
    return [];
  }
}
