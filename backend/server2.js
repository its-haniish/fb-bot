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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
