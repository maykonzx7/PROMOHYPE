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

    await page.waitForSelector(".ui-search-layout__item", { timeout: 60000 });

    const products = await page.evaluate(() => {
      return Array.from(document.querySelectorAll(".ui-search-layout__item")).map((item) => {
        const title =
          item.querySelector("h2")?.innerText.trim() ||
          item.querySelector(".poly-component__title")?.innerText.trim() ||
          "Sem título";

        const priceContainer = item.querySelector(".poly-price__current");
        let price;
        if (priceContainer) {
          const inteiro = priceContainer.querySelector(".andes-money-amount__fraction")?.innerText.replace(/\D/g, "") || "0";
          let centavos = priceContainer.querySelector(".andes-money-amount__cents")?.innerText.replace(/\D/g, "") || "00";
          if (centavos.length === 1) centavos += "0";
          price = `R$ ${inteiro},${centavos}`;
        } else {
          price = item.querySelector(".price-tag-fraction")?.innerText || "Sem preço";
        }

        const link = item.querySelector("a")?.href || "";

        const imgEl = item.querySelector("img");
        const image =
          imgEl?.getAttribute("data-src") ||
          imgEl?.src ||
          "Sem imagem";

        return {
          title,
          price,
          link,
          image,
          store: "Mercado Livre",
        };
      });
    });

    await browser.close();
    return products;
  } catch (error) {
    console.error("Erro no scraping do Mercado Livre:", error);
    await browser.close();
    return [];
  }
}
