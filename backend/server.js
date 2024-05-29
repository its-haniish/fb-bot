require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const PORT = process.env.PORT || 8080;
app.use(cors());
app.use(express.json());

const getPostUrl = require('./getPostUrl');
const likePost = require('./likePost');

app.get('/', (req, res) => res.status(200).json({ message: 'Server started successfully.' }));

app.post('/run-script', async (req, res) => {
    const { email, password } = req.body;
    let count = 0;
    try {
        while (count < 100) {
            let postUrl = await getPostUrl(email, password);
            if (postUrl) {
                await likePost(postUrl);
            }
            count++;
        }
    } catch (error) {
        return res.status(500).status.json({ message: 'An error occurred while trying to run the script.' });
    }
    return res.status(200).json({ message: 'Script executed successfully.' });
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
