const mongoose = require('mongoose');


// function to connect to Oolkar database
const connectDB = async (database) => {
    try {
        console.log("Connecting to Sartha...");
        await mongoose.connect(database)
        console.log("Connected to Sartha")
    } catch (error) {
        console.log("Connection failed to Sartha")
        process.exit(0);
    }
}


module.exports = connectDB;