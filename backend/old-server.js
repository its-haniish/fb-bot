require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());

// Replace these with your Facebook account access tokens
const accessTokens = [
    process.env.ACCESS_TOKEN_1,
    process.env.ACCESS_TOKEN_2,
];

// Function to like a post
const likePost = async (postId) => {
    for (let token of accessTokens) {
        try {
            const response = await axios.post(
                `https://graph.facebook.com/${postId}/likes`,
                {},
                {
                    params: {
                        access_token: token,
                    },
                }
            );
            console.log(`Post ${postId} liked with token ${token}`);
        } catch (error) {
            console.error(`Failed to like post ${postId} with token ${token}`, error.response.data);
        }
    }
};

// Webhook to receive Facebook notifications
app.post('/webhook', (req, res) => {
    const data = req.body;

    // Check if the update is about a mention
    if (data.entry) {
        data.entry.forEach(entry => {
            if (entry.changes) {
                entry.changes.forEach(change => {
                    if (change.value && change.value.item === 'mention' && change.value.verb === 'add') {
                        const postId = change.value.post_id;
                        likePost(postId);
                    }
                });
            }
        });
    }

    res.sendStatus(200);
});

// Webhook verification
app.get('/webhook', (req, res) => {
    const VERIFY_TOKEN = 'EAAVZA1iTi5k0BO7jwwXMX2AudsyLRID8Mgo3cZCt54bDnTTfZB8RWRIoGlr6ldiYeF7yqtigJFKCVZCITJPtFsHcaEk1LslFZAVt0ZAtVuruvlozkXqciCKFyqM0atepKegLQgSwVLPP2MT0rq9Knv0OMfAmRSPfmp927268ygHgFCXyfvIZBPG5PgZAdYQdSZA6AR1BBupwu3klO7WmSqQZDZD';

    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    if (mode && token) {
        if (mode === 'subscribe' && token === VERIFY_TOKEN) {
            console.log('WEBHOOK_VERIFIED');
            res.status(200).send(challenge);
        } else {
            res.sendStatus(403);
        }
    }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
















// // .require('dotenv').config();
// const puppeteer = require('puppeteer');
// const express = require('express');
// const app = express();
// const cors = require('cors');
// const PORT = process.env.PORT || 8080;

// app.use(express.json());
// app.use(cors());

// async function runPuppeteer(email, password, numIterations) {
//     let taggedNotification;
//     let postUrl;
//     const dummy_accounts = [
//         {
//             email: '9832110353',
//             pass: '@@india@@'
//         },
//         {
//             email: 'villagemurkhari07@gmail.com',
//             pass: '@@india@@'
//         }
//     ];

//     while (!taggedNotification && numIterations > 0) {
//         const browser = await puppeteer.launch({
//             headless: false, // Change to false if you want to see the browser
//             // executablePath: '/usr/bin/google-chrome',
//             args: ['--disable-notifications']
//         });
//         const page = await browser.newPage();

//         try {
//             await page.goto('https://www.facebook.com');

//             try {
//                 await page.type('#email', email);
//                 await page.type('#pass', password);
//                 await page.click('[data-testid="royal_login_button"]');
//                 await page.waitForNavigation();
//             } catch (error) {
//                 console.error("Initial login button click failed. Trying alternative login button.");
//                 // If the initial click fails, attempt to click the alternative login button

//                 await page.type('#email', email);
//                 await page.type('#pass', password);
//                 await page.click('[name="login"]');
//                 await page.waitForNavigation();
//             }

//             await page.goto('https://www.facebook.com/notifications');

//             taggedNotification = await checkForTaggedNotification(page);

//             if (!taggedNotification) {
//                 console.log('Tagged notification not found. Refreshing the page and trying again...');
//                 await browser.close();
//             } else {
//                 console.log(`Found tagged notification: "${taggedNotification}". Clicking on it.`);
//                 await clickElement(page, taggedNotification);
//                 await page.waitForNavigation();
//                 postUrl = await clickElementByAriaLabel(page, 'Like');
//                 return await browser.close();
//             }

//             // Function to start login with dummy accounts
//             for (const account of dummy_accounts) {
//                 const newBrowser = await puppeteer.launch({
//                     headless: false,
//                     // executablePath: '/usr/bin/google-chrome',
//                     args: ['--disable-notifications']
//                 });
//                 const newPage = await newBrowser.newPage();
//                 console.log(`Logging in with account: ${account.email}`);

//                 try {
//                     await newPage.goto('https://www.facebook.com');

//                     await newPage.type('#email', account.email);
//                     await newPage.type('#pass', account.pass);

//                     try {
//                         await Promise.all([
//                             newPage.click('[data-testid="royal_login_button"]'),
//                             newPage.waitForNavigation()
//                         ]);
//                     } catch (error) {
//                         console.error("Initial login button click failed. Trying alternative login button.");
//                         // If the initial click fails, attempt to click the alternative login button
//                         await newPage.click('[name="login"]');
//                         await newPage.waitForNavigation();
//                     }

//                     // Check if postUrl is defined (you may need to adjust this condition based on your specific scenario)
//                     if (postUrl) {
//                         await newPage.goto(postUrl);
//                         await clickElementByAriaLabel(newPage, 'Like', postUrl);
//                     } else {
//                         console.log('Post URL not found. Skipping like operation.');
//                     }

//                 } catch (error) {
//                     console.error('An error occurred:', error);
//                 } finally {
//                     numIterations--;
//                 }
//             }
//         } catch (error) {
//             console.error('An error occurred:', error);
//         }
//     }
// }

// async function checkForTaggedNotification(page) {
//     const taggedNotification = await page.evaluate(() => {
//         const spanElements = Array.from(document.querySelectorAll('span'));
//         const taggedSpan = spanElements.find(span => span.innerText.includes('tagged'));
//         return taggedSpan ? taggedSpan.innerText : null;
//     });
//     return taggedNotification;
// }

// async function clickElement(page, text) {
//     const element = await page.evaluateHandle((text) => {
//         const elements = Array.from(document.querySelectorAll('span'));
//         const targetElement = elements.find(span => span.innerText.includes(text));
//         if (targetElement) {
//             const { x, y } = targetElement.getBoundingClientRect();
//             return { x, y };
//         }
//         return null;
//     }, text);

//     if (element) {
//         const { x, y } = await element.jsonValue();
//         await page.mouse.click(x, y);
//         console.log(`Clicked on element containing "${text}"`);
//     } else {
//         console.log(`Element containing "${text}" not found.`);
//     }
// }

// async function clickElementByAriaLabel(page, labelValue, postUrl) {
//     try {
//         await page.waitForSelector(`[aria-label="${labelValue}"]`);
//         await page.click(`[aria-label="${labelValue}"]`);
//         console.log(`Clicked on element with aria-label "${labelValue}"`);
//         postUrl = page.url(); ``
//         return postUrl;
//     } catch (error) {
//         console.log(`Element with aria-label "${labelValue}" not found.`);
//         return null;
//     }
// }

// // Define a route for running the Puppeteer script
// app.post('/run-script', async (req, res) => {
//     const { email, pass, numIterations } = req.body;
//     console.log('Email: ', email);
//     console.log('Password: ', pass);
//     console.log('Iterations: ', numIterations);
//     try {
//         await runPuppeteer(email, pass, numIterations);
//         res.status(200).json({
//             message: 'Script executed successfully.'
//         });
//     } catch (error) {
//         console.log('Error running the script.');
//         console.log(error);
//         res.status(500).json({
//             message: 'Error running the script.'
//         });
//     }

// });

// app.get('/', (req, res) => {
//     res.status(200).json({ message: "Server started successfully." })
// })

// // Start the server
// app.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
// });
