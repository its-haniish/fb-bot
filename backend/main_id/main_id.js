const { parentPort } = require('worker_threads');
const puppeteer = require('puppeteer');

// Function to simulate monitoring for new tags on the main account
async function monitorTags() {
    const browser = await puppeteer.launch({
        headless: false,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-notifications',
            '--disable-popup-blocking'
        ]
    });
    const page = await browser.newPage();

    // Log into the main account using the correct selectors for Facebook login
    await page.goto('https://www.facebook.com/login'); // Go to the Facebook login page

    await page.type('#email', 'gouravsinghbokaro07@gmail.com');  // Replace with your actual email
    await page.type('#pass', 'water123');  // Replace with your actual password
    await page.click('button[name="login"]');  // Correct selector for the login button
    await page.waitForNavigation();  // Wait for login to complete

    console.log('Main account logged in. Monitoring for new tags...');

    // Monitor for tags in notifications
    while (true) {
        await page.goto('https://www.facebook.com/notifications');  // Go to the notifications page

        // Evaluate the page to find span tags containing "tagged you in a post" and click it
        const clicked = await page.evaluate(() => {
            let notifications = document.querySelectorAll('span'); // Get all span tags
            let success = false;

            // Loop through span tags to find the one with the text "tagged you in a post"
            notifications.forEach(span => {
                if (span.innerText.includes('tagged you in a post')) {
                    // If found, click the parent link (assuming it's in an anchor tag)
                    let parentLink = span.closest('a');
                    if (parentLink) {
                        parentLink.click();  // Click to go to the tagged post
                        success = true;
                    }
                }
            });
            return success;  // Return true if clicked, false otherwise
        });

        // If a tag was found and clicked, wait for the page navigation to the post
        if (clicked) {
            console.log('Clicked on the notification to view the tagged post.');
            await page.waitForNavigation();  // Wait for the navigation to complete after the click
            const postUrl = page.url();  // Get the URL of the tagged post after navigation
            console.log(`Navigated to post: ${postUrl}`);

            // Wait for the "Like" button to appear and click on it
            try {
                await page.waitForSelector('[aria-label="Like"]', { timeout: 5000 });  // Wait for the "Like" button to be available
                await page.click('[aria-label="Like"]');  // Click the "Like" button
                console.log('Liked the post.');
            } catch (error) {
                console.log('Like button not found after navigation.');
            }

            // Wait on the page without closing the browser
        } else {
            console.log('No new tag found. Checking again...');
        }

        // Wait for 1 second before checking again
        await new Promise(resolve => setTimeout(resolve, 1000));
    }

    // Note: We are not closing the browser since it's continuously monitoring
}

// Start monitoring for new tags
monitorTags();
