import scrapeMercadoLivre from "./mercadoLivre.js";
import scrapeMagalu from "./magalu.js";
import scrapeCasasBahia from "./casasBahia.js";

/**
 * Serviço centralizado de scraping
 * Executa todos os scrapers e retorna todas as promoções encontradas
 */
export default async function searchHype(searchTerms = ['smartphone', 'notebook', 'tv', 'headphone', 'tablet']) {
  console.log("🚀 Iniciando scraping de todas as lojas...");
  console.log(`📦 Termos de busca: ${searchTerms.join(", ")}`);
  
  const allPromotions = [];
  const errors = [];

  // Executar scrapers em paralelo para melhor performance
  const scrapers = [
    {
      name: "Mercado Livre",
      scraper: scrapeMercadoLivre,
      searchTerms
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
    scrapers.map(async ({ name, scraper, searchTerms }) => {
      try {
        console.log(`\n🛒 Iniciando scraping: ${name}`);
        const promotions = await scraper(searchTerms);
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
