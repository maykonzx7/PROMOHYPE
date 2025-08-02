import scrapeMercadoLivre from "./mercadoLivre.js";

export default async function searchHype() {
  const ml = await scrapeMercadoLivre();
  return ml;
}
