import puppeteer from 'puppeteer';

(async () => {
    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.setViewport({ width: 1280, height: 800 });
        await page.goto('http://localhost:5000', { waitUntil: 'networkidle0' });
        await page.screenshot({ path: 'preview.png' });
        await browser.close();
        console.log('Screenshot saved to preview.png');
    } catch (error) {
        console.error('Error taking screenshot:', error);
        process.exit(1);
    }
})();
