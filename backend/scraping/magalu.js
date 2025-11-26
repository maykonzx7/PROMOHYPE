import puppeteer from "puppeteer";

/**
 * Scraper para Magazine Luiza (Magalu)
 * Busca produtos em promoção
 */
export default async function scrapeMagalu(searchTerms = ['smartphone', 'notebook', 'tv', 'fone', 'tablet']) {
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

  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
  );

  await page.setViewport({ width: 1920, height: 1080 });

  // Permitir carregamento de imagens de produtos
  await page.setRequestInterception(true);
  page.on('request', (req) => {
    if (req.resourceType() === 'image') {
      const url = req.url();
      // Permitir imagens de produtos
      if (url.includes('product') || 
          url.includes('produto') ||
          url.includes('thumbnail') || 
          url.includes('thumb') || 
          url.includes('small') ||
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
      console.log(`Buscando "${searchTerm}" no Magalu...`);
      
      try {
        // Ir direto para a página de busca
        await page.goto(`https://www.magazineluiza.com.br/busca/${encodeURIComponent(searchTerm)}/`, {
          waitUntil: "domcontentloaded",
          timeout: 30000,
        });

        // Aguardar produtos carregarem
        await page.waitForSelector(
          "[data-testid='product-card'], .productShowCase, .neemu-product-container, li[class*='product']",
          { timeout: 20000 }
        );

        // Scroll para carregar produtos e imagens lazy
        await page.evaluate(() => {
          window.scrollBy(0, 500);
        });
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        await page.evaluate(() => {
          window.scrollBy(0, 500);
        });
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Forçar carregamento de imagens lazy
        await page.evaluate(() => {
          const items = document.querySelectorAll("[data-testid='product-card'], .productShowCase, .neemu-product-container");
          items.forEach((item, index) => {
            if (index < 20) {
              item.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
          });
        });
        await new Promise(resolve => setTimeout(resolve, 1500));

        const products = await page.evaluate(() => {
          // Tentar diferentes seletores de produtos
          const productSelectors = [
            "[data-testid='product-card']",
            ".productShowCase",
            ".neemu-product-container",
            "li[class*='product']",
            "[class*='ProductCard']"
          ];

          let items = [];
          for (const selector of productSelectors) {
            items = Array.from(document.querySelectorAll(selector)).slice(0, 20);
            if (items.length > 0) break;
          }

          return items.map((item) => {
            try {
              // Título
              const titleEl = item.querySelector(
                "h2, [data-testid='product-title'], .product-title, h3, [class*='title']"
              );
              const title = titleEl?.innerText?.trim() || "Sem título";

              // Preço atual
              let currentPrice = "Sem preço";
              let originalPrice = null;
              let hasPromotion = false;
              let discount = null;
              let discountAmount = null;

              // Buscar preço atual
              const priceSelectors = [
                "[data-testid='price-value'], .price, [class*='price'], .product-price, [class*='Price']"
              ];

              for (const selector of priceSelectors) {
                const priceEl = item.querySelector(selector);
                if (priceEl) {
                  const priceText = priceEl.innerText?.trim() || "";
                  const priceMatch = priceText.match(/R\$\s*([\d.,]+)/);
                  if (priceMatch) {
                    currentPrice = `R$ ${priceMatch[1]}`;
                    break;
                  }
                }
              }

              // Buscar preço original (de, por, antes)
              const originalPriceSelectors = [
                "[class*='original'], [class*='before'], [class*='de'], [class*='old-price'], [data-testid='original-price'], [class*='was-price']"
              ];
              
              for (const selector of originalPriceSelectors) {
                const originalEl = item.querySelector(selector);
                if (originalEl) {
                  const originalText = originalEl.innerText?.trim() || "";
                  const originalMatch = originalText.match(/R\$\s*([\d.,]+)/);
                  if (originalMatch) {
                    originalPrice = `R$ ${originalMatch[1]}`;
                    hasPromotion = true;
                    
                    // Calcular desconto
                    const currentValue = parseFloat(currentPrice.replace(/[^\d,.-]/g, '').replace(',', '.'));
                    const originalValue = parseFloat(originalPrice.replace(/[^\d,.-]/g, '').replace(',', '.'));
                    if (originalValue > currentValue) {
                      const discountPercent = Math.round(((originalValue - currentValue) / originalValue) * 100);
                      discount = `${discountPercent}%`;
                      discountAmount = `R$ ${(originalValue - currentValue).toFixed(2).replace('.', ',')}`;
                    }
                    break;
                  }
                }
              }

              // Parcelamento
              let installments = null;
              let installmentValue = null;
              const installmentSelectors = [
                "[class*='installment'], [class*='parcela'], [data-testid='installment'], [class*='payment'], [class*='parcel']"
              ];
              
              for (const selector of installmentSelectors) {
                const installmentEl = item.querySelector(selector);
                if (installmentEl) {
                  const installmentText = installmentEl.innerText?.trim() || "";
                  // Extrair número de parcelas (ex: "10x de R$ 299,90", "em até 12x sem juros")
                  const installmentMatch = installmentText.match(/(\d+)\s*x/);
                  if (installmentMatch) {
                    installments = parseInt(installmentMatch[1]);
                    // Extrair valor da parcela
                    const valueMatch = installmentText.match(/R\$\s*([\d.,]+)/);
                    if (valueMatch) {
                      installmentValue = `R$ ${valueMatch[1]} em até ${installments}x`;
                    } else {
                      installmentValue = `em até ${installments}x`;
                    }
                    break;
                  }
                }
              }

              // Link
              const linkEl = item.querySelector("a[href*='produto'], a[href*='/p/']");
              let link = linkEl?.href || "";
              if (link && !link.startsWith('http')) {
                link = `https://www.magazineluiza.com.br${link}`;
              }

              // Imagem - melhorar captura com múltiplos métodos
              let image = "";
              const imgSelectors = [
                "img[data-src]",
                "img[src]",
                "img",
                "[class*='image'] img",
                "[class*='Image'] img",
                "[data-testid*='image'] img"
              ];
              
              // Tentar encontrar imagem com múltiplos seletores
              for (const selector of imgSelectors) {
                const imgEl = item.querySelector(selector);
                if (imgEl) {
                  // Tentar múltiplos atributos em ordem de prioridade
                  const imageAttributes = [
                    "data-src",
                    "src",
                    "data-lazy-src",
                    "data-original",
                    "data-srcset",
                    "data-lazy",
                    "srcset"
                  ];
                  
                  for (const attr of imageAttributes) {
                    const imgUrl = imgEl.getAttribute(attr);
                    if (imgUrl) {
                      // Processar srcset
                      if (attr === "data-srcset" || attr === "srcset") {
                        const firstUrl = imgUrl.split(' ')[0];
                        if (firstUrl && !firstUrl.includes('data:image') && !firstUrl.includes('placeholder')) {
                          image = firstUrl.trim();
                          break;
                        }
                      } else {
                        // Verificar se não é placeholder
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
                  
                  if (image) break;
                }
              }
              
              // Se ainda não encontrou, buscar todas as imagens
              if (!image) {
                const allImgs = item.querySelectorAll("img");
                for (const img of allImgs) {
                  const src = img.getAttribute("src") || img.getAttribute("data-src");
                  if (src && 
                      src.startsWith('http') && 
                      !src.includes('placeholder') &&
                      !src.includes('loading') &&
                      !src.includes('data:image')) {
                    image = src.trim();
                    break;
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
                  store: "Magazine Luiza",
                  category: "Eletrônicos",
                  description: title,
                  availability: true,
                };
              }
              return null;
            } catch (err) {
              return null;
            }
          }).filter(item => item !== null);
        });

        if (products && products.length > 0) {
          allPromotions.push(...products);
          console.log(`✓ Encontrados ${products.length} produtos para "${searchTerm}"`);
        }

        await new Promise(resolve => setTimeout(resolve, 2000));

      } catch (error) {
        console.error(`Erro ao buscar "${searchTerm}" no Magalu:`, error.message);
        continue;
      }
    }

    await browser.close();

    // Remover duplicatas
    const uniquePromotions = Array.from(
      new Map(allPromotions.map(p => [p.link, p])).values()
    );

    console.log(`✓ Total de promoções únicas do Magalu: ${uniquePromotions.length}`);
    return uniquePromotions;

  } catch (error) {
    console.error("Erro no scraping do Magalu:", error);
    await browser.close();
    return [];
  }
}

