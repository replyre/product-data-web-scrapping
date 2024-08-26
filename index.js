const puppeteer = require("puppeteer");
const xlsx = require("xlsx");

(async () => {
  // Launch Puppeteer
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  // Navigate to the target website
  await page.goto("https://eshop-replyr.web.app/", {
    waitUntil: "networkidle2",
  });

  // Wait for the product cards to load
  await page.waitForSelector(".card");

  // Select the product elements
  const products = await page.$$eval(".card", (cards) => {
    return cards.map((card) => {
      const name = card.querySelector(".info h4").innerText;
      const price = card.querySelector(".info h4:nth-child(2)").innerText;
      const availability = "In Stock"; // Assuming all items shown are in stock
      const rating = card.querySelector(".rating")
        ? card.querySelector(".rating").innerText
        : "No Rating";
      return { name, price, availability, rating };
    });
  });

  // Print the scraped data
  console.log(products);

  // Create a new Excel workbook and worksheet
  const workbook = xlsx.utils.book_new();
  const worksheet = xlsx.utils.json_to_sheet(products);

  // Add the worksheet to the workbook
  xlsx.utils.book_append_sheet(workbook, worksheet, "Products");

  // Write the workbook to an Excel file
  xlsx.writeFile(workbook, "products.xlsx");

  // Close Puppeteer
  await browser.close();
})();
