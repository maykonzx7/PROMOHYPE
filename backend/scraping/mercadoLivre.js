import puppeteer from "puppeteer";

export default async function scrapeMercadoLivre() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();

  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36"
  );

  try {
    await page.goto("https://www.mercadolivre.com.br/", {
      waitUntil: "networkidle2",
      timeout: 60000,
    });

    await page.type('input[name="as_word"]', "celular");
    await Promise.all([
      page.keyboard.press("Enter"),
      page.waitForNavigation({ waitUntil: "networkidle2" }),
    ]);

    // Nova classe mais confiável: ".ui-search-layout__item"
    await page.waitForSelector(".ui-search-layout__item", { timeout: 60000 });

    const products = await page.evaluate(() => {
      return Array.from(document.querySelectorAll(".ui-search-layout__item")).map((item) => ({
        title: item.querySelector("h2")?.innerText || "Sem título",
        price: item.querySelector(".price-tag-fraction")?.innerText || "Sem preço",
        link: item.querySelector("a")?.href || "",
        store: "Mercado Livre",
      }));
    });

    await browser.close();
    return products;
  } catch (error) {
    console.error("Erro no scraping do Mercado Livre:", error);
    await browser.close();
    return [];
  }
}
