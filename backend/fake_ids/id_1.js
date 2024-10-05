const { parentPort } = require('worker_threads');
const puppeteer = require('puppeteer');

// Persistent browser and page variables
let browser;
let page;

// Function to log in once and keep the session alive
async function loginOnce() {
    browser = await puppeteer.launch({ headless: false }); // Launch the browser
    page = await browser.newPage();

    console.log('Logging in fake account 1...');
    await page.goto('https://www.facebook.com/login'); // Go to the login page
    await page.type('#email', 'hello01jj@gmail.com'); // Replace with actual credentials
    await page.type('#pass', '@@india@@');            // Replace with actual credentials
    await page.click('button[name="login"]');         // Replace with actual login button selector
    await page.waitForNavigation();                   // Wait for login to complete

    console.log('Fake account 1 logged in and ready.');
}

// Function to like a post (after the bot is logged in)
async function likePost(postUrl) {
    if (postUrl) {
        console.log(`Navigating to post: ${postUrl}`);
        await page.goto(postUrl); // Navigate to the post URL
        await page.waitForSelector('.like-button'); // Wait for the like button to appear
        await page.click('.like-button');           // Replace with actual selector for the like button
        console.log(`Liked post: ${postUrl}`);
    }
}

// Listen for messages from the main thread (to like posts)
parentPort.on('message', async (message) => {
    if (message.action === 'like' && message.postUrl) {
        console.log(`Received command to like post: ${message.postUrl}`);
        await likePost(message.postUrl); // Like the post when a new URL is provided
    }
});

// Initial login on worker startup
(async () => {
    await loginOnce(); // Log in once when the worker starts
})();
