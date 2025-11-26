import scrapeMercadoLivre from "./mercadoLivre.js";
import scrapeMagalu from "./magalu.js";
import scrapeCasasBahia from "./casasBahia.js";

/**
 * Serviço centralizado de scraping
 * Executa todos os scrapers e retorna todas as promoções encontradas
 * 
 * @param {Array} searchTerms - Termos de busca
 * @param {Object} crawlingOptions - Opções de crawling para Mercado Livre
 * @param {number} crawlingOptions.maxPages - Número máximo de páginas (padrão: 3)
 * @param {boolean} crawlingOptions.visitProductPages - Visitar páginas individuais (padrão: false)
 * @param {number} crawlingOptions.maxProductsPerPage - Máximo de produtos por página (padrão: 20)
 */
export default async function searchHype(
  searchTerms = ['smartphone', 'notebook', 'tv', 'headphone', 'tablet'],
  crawlingOptions = {}
) {
  console.log("🚀 Iniciando scraping de todas as lojas...");
  console.log(`📦 Termos de busca: ${searchTerms.join(", ")}`);
  
  const allPromotions = [];
  const errors = [];

  // Executar scrapers em paralelo para melhor performance
  const scrapers = [
    {
      name: "Mercado Livre",
      scraper: scrapeMercadoLivre,
      searchTerms,
      options: crawlingOptions // Passar opções de crawling
    },
    {
      name: "Magazine Luiza",
      scraper: scrapeMagalu,
      searchTerms
    },
    {
      name: "Casas Bahia",
      scraper: scrapeCasasBahia,
      searchTerms
    }
  ];

  // Executar todos os scrapers
  const results = await Promise.allSettled(
    scrapers.map(async ({ name, scraper, searchTerms, options }) => {
      try {
        console.log(`\n🛒 Iniciando scraping: ${name}`);
        // Passar opções apenas para Mercado Livre (que suporta crawling)
        const promotions = options 
          ? await scraper(searchTerms, options)
          : await scraper(searchTerms);
        console.log(`✓ ${name}: ${promotions.length} promoções encontradas`);
        return { name, promotions };
      } catch (error) {
        console.error(`✗ Erro em ${name}:`, error.message);
        errors.push({ store: name, error: error.message });
        return { name, promotions: [] };
      }
    })
  );

  // Processar resultados
  results.forEach((result) => {
    if (result.status === 'fulfilled' && result.value.promotions) {
      allPromotions.push(...result.value.promotions);
    }
  });

  // Remover duplicatas globais (baseado no link)
  const uniquePromotions = Array.from(
    new Map(allPromotions.map(p => [p.link || `${p.store}-${p.title}`, p])).values()
  );

  console.log(`\n✅ Scraping concluído!`);
  console.log(`📊 Total de promoções únicas: ${uniquePromotions.length}`);
  console.log(`⚠️  Erros encontrados: ${errors.length}`);

  if (errors.length > 0) {
    console.log("\n❌ Erros detalhados:");
    errors.forEach(({ store, error }) => {
      console.log(`  - ${store}: ${error}`);
    });
  }

  return uniquePromotions;
}
