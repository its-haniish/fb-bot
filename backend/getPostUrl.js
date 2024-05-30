const puppeteer = require('puppeteer');

const getPostUrl = async (email, password) => {
    let postUrl = null;
    let browser;
    try {
        console.log('Launching browser...');
        browser = await puppeteer.launch({
            headless: true,
            args: ['--disable-notifications', '--no-sandbox', '--disable-setuid-sandbox'],
            executablePath: '/opt/render/.cache/puppeteer/chrome/linux-124.0.6367.91/chrome-linux64/chrome'
        });
        const page = await browser.newPage();

        console.log('Navigating to Facebook login page...');
        await page.goto('https://www.facebook.com/login/', { waitUntil: 'networkidle2', timeout: 60000 });

        console.log('Waiting for email and password fields...');
        await page.waitForSelector('#email');
        await page.waitForSelector('#pass');

        console.log('Typing email and password...');
        await page.type('#email', email);
        await page.type('#pass', password);

        console.log('Clicking login button...');
        await page.click('button[type="submit"]');

        console.log('Waiting for navigation after login...');
        await page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 60000 });

        console.log('Login successful, navigating to notifications page...');
        await page.goto('https://www.facebook.com/notifications');

        console.log('Finding the span with "tagged" text...');

        const taggedSpan = await page.evaluate(() => {
            const spans = document.getElementsByTagName('span');
            console.log(spans.length);
            for (let i = 0; i < spans.length; i++) {
                if (spans[i].innerText.includes('tagged')) {
                    spans[i].click();
                    return spans[i].innerText;
                }
            }
            return null;
        });

        if (taggedSpan) {
            console.log('Tagged span found:', taggedSpan);
            await page.waitForSelector("[aria-label='Like']");
            postUrl = page.url();
            console.log('Clicking like button...');
            await page.evaluate(async () => {
                const likeBtn = document.querySelector("[aria-label='Like']");
                if (likeBtn !== null) {
                    likeBtn.click();
                    console.log('Element with aria-label="like" clicked.');
                    return
                }
                console.log('No element found with aria-label="like".');
                return await browser.close();

            });


        } else {
            console.log('No span found with the text "tagged".');
            await browser.close();
            getPostUrl(email, password);

        }


    } catch (error) {
        console.log('Error:', error);
    }
    if (browser) {
        await browser.close();
    }

    return postUrl;
}

module.exports = getPostUrl;
