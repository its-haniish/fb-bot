const puppeteer = require('puppeteer');
const dummy_accounts = [
    {
        email: 'hello01jj@gmail.com',
        password: '@@india@@'
    },
    {
        email: 'villagemurkhari07@gmail.com',
        password: '@@india@@'
    }
];

const likePost = async (postUrl) => {
    if (!postUrl) {
        console.log('No post URL provided.');
        return;
    }

    for (const { email, password } of dummy_accounts) {
        let browser;
        try {
            console.log(`Launching browser for account: ${email}`);
            browser = await puppeteer.launch({
                headless: true,
                args: ['--disable-notifications', '--no-sandbox', '--disable-setuid-sandbox'],
                executablePath: '/opt/render/.cache/puppeteer/chrome/linux-124.0.6367.91/chrome-linux64/chrome'
            });
            const page = await browser.newPage();

            console.log('Navigating to Facebook login page...');
            await page.goto('https://www.facebook.com/login/');

            console.log('Waiting for email and password fields...');
            await page.waitForSelector('#email');
            await page.waitForSelector('#pass');

            console.log('Typing email and password...');
            await page.type('#email', email);
            await page.type('#pass', password);

            console.log('Submitting login form...');
            await page.click('button[type="submit"]');
            await page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 60000 });

            console.log(`Navigating to the post URL: ${postUrl}`);
            await page.goto(postUrl, { waitUntil: 'networkidle0', timeout: 60000 });

            console.log('Waiting for Like button...');
            await page.waitForSelector("[aria-label='Like']");
            console.log('Attempting to like the post...');
            await page.evaluate(() => {
                const likeBtn = document.querySelector("[aria-label='Like']");
                if (likeBtn) {
                    likeBtn.click();
                    console.log('Post liked successfully.');
                } else {
                    console.log('Like button not found.');
                }
            });

        } catch (error) {
            console.error('Error occurred while liking post:', error);
        } finally {
            if (browser) {
                console.log('Closing browser...');
                await browser.close();
            }
        }
    }
};

module.exports = likePost;
