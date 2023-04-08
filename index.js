const express = require('express');
const puppeteer = require('puppeteer');

const app = express();
const port = process.env.PORT || 3000; // Use the port specified by Railway or default to 3000

app.get('/', async (req, res) => {
  try {
    // Initialize the browser
    const browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-dev-shm-usage'] // Add '--disable-dev-shm-usage' option for running in Render
    });

    const page = await browser.newPage();

    // Navigate to the desired URL
    await page.goto('https://tecnoblog.net/noticias/');

    // Wait for the page to fully load
    await page.waitForSelector('.cont');

    // Extract the desired data
    const data = await page.evaluate(() => {
      const articleElements = document.querySelectorAll('.grid4 article'); // Select all article elements
      const articles = [];
      articleElements.forEach(articleElement => {
        const titleElement = articleElement.querySelector('h2'); // Select the h2 element within the article
        const linkElement = articleElement.querySelector('a'); // Select the anchor element within the article
        const title = titleElement ? titleElement.innerText : ''; // Extract the title text, or set to empty string if not found
        const link = linkElement ? linkElement.href : ''; // Extract the link URL, or set to empty string if not found
        articles.push({ title, link });
      });
      return articles;
    });


    // Send the data as response
    res.send(data);

    // Close the browser
    await browser.close();
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error.');
  }
});

app.listen(port, () => {
  console.log(`Express server is running on port ${port}`);
});
