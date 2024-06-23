require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');

const PORT = process.env.PORT || 8081;
const connectDB = require('./utils/connectDB.js')
const routes = require('./routes/routes.js')

app.use(express.json({ limit: '50mb' }));
app.use(cors());

app.use('/', routes);

app.get("/", (req, res) => {
    res.send("<h1>Server is running...</h1>")
})

// Define the /ping route
app.get('/ping', (req, res) => {
    res.send('pong');
});

// Function to ping the server periodically
const startSelfPing = () => {
    console.log('Starting self-ping function...');
    const interval = 14 * 60 * 1000; // 14 minutes in milliseconds

    const pingServer = async () => {
        try {
            const fetch = (await import('node-fetch')).default;
            console.log('Pinging to ', process.env.SELF);
            const response = await fetch(`${process.env.SELF}/ping`);
            if (response.ok) {
                console.log('Ping successful');
            } else {
                console.error('Ping failed', response.statusText);
            }
        } catch (error) {
            console.error('Error pinging server:', error);
        }
    };

    setInterval(pingServer, interval);
};



// calling the connectDB function and listening server in then block
connectDB(process.env.MONGO_URI).then(() => {
    // listening server
    app.listen(PORT, () => {
        console.log('Server is running on port:', PORT);
        startSelfPing(); // Start the self-ping function
    });
});



