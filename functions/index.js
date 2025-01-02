const functions = require('firebase-functions');
const puppeteer = require('puppeteer');

// Funkcja do scrapowania danych
exports.scrapeWebsite = functions
  .runWith({
    timeoutSeconds: 120,
    memory: '2GB'
  })
  .https.onRequest(async (request, response) => {
    try {
      // Uruchom przeglądarkę
      const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox']
      });

      // Otwórz nową stronę
      const page = await browser.newPage();
      
      // URL strony do scrapowania (możesz przekazać jako parametr w request)
      const url = request.query.url || 'https://example.com';
      await page.goto(url);

      // Przykład pobierania danych - dostosuj selektory do swojej strony
      const data = await page.evaluate(() => {
        // Tutaj dodaj logikę wybierania elementów ze strony
        // Przykład:
        const titles = Array.from(document.querySelectorAll('h1, h2')).map(h => h.innerText);
        const paragraphs = Array.from(document.querySelectorAll('p')).map(p => p.innerText);
        
        return {
          titles,
          paragraphs,
          url: window.location.href
        };
      });

      // Zamknij przeglądarkę
      await browser.close();

      // Zwróć zebrane dane
      response.json(data);

    } catch (error) {
      console.error(error);
      response.status(500).send(error.message);
    }
  });
