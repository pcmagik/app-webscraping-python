const express = require('express');
const puppeteer = require('puppeteer');
const app = express();
const port = 3000;

// Obsługa plików statycznych (interfejs użytkownika)
app.use(express.static('public'));
app.use(express.json());

// Endpoint do scrapowania
app.post('/scrape', async (req, res) => {
    try {
        const url = req.body.url;
        if (!url) {
            return res.status(400).json({ error: 'URL jest wymagany' });
        }

        console.log(`Rozpoczynam scrapowanie strony: ${url}`);

        console.log('Konfiguracja przeglądarki...');
        const browser = await puppeteer.launch({
            headless: 'new',
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-gpu',
                '--headless=new',
                '--disable-notifications',
                '--no-first-run'
            ],
            ignoreHTTPSErrors: true,
            executablePath: '/usr/bin/google-chrome-stable'
        });

        console.log('Przeglądarka uruchomiona');

        const page = await browser.newPage();
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
        
        page.on('console', msg => console.log('Konsola strony:', msg.text()));
        page.on('pageerror', err => console.error('Błąd strony:', err));

        console.log('Przechodzę do URL...');
        try {
            await page.goto(url, {
                waitUntil: 'networkidle0',
                timeout: 30000
            });
        } catch (error) {
            console.error('Błąd podczas ładowania strony:', error);
            await browser.close();
            throw error;
        }
        console.log('Strona załadowana');

        console.log('Rozpoczynam ekstrakcję danych');
        const data = await page.evaluate(() => {
            const titles = Array.from(document.querySelectorAll('h1, h2')).map(h => h.innerText);
            const links = Array.from(document.querySelectorAll('a[href]')).map(a => a.href);
            const images = Array.from(document.querySelectorAll('img')).map(img => img.src);
            const paragraphs = Array.from(document.querySelectorAll('p')).map(p => p.innerText);
            
            console.log(`Znaleziono ${titles.length} nagłówków, ${links.length} linków i ${images.length} obrazów`);
            
            return {
                titles,
                links,
                images,
                paragraphs,
                url: window.location.href
            };
        });

        console.log('Dane wyekstrahowane:', data);

        await browser.close();
        console.log('Przeglądarka zamknięta');

        res.json(data);

    } catch (error) {
        console.error('Wystąpił błąd:', error);
        res.status(500).json({ 
            error: error.message,
            stack: error.stack
        });
    }
});

app.listen(port, () => {
    console.log(`Serwer działa na http://localhost:${port}`);
}); 