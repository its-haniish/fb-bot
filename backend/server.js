const { Worker } = require('worker_threads');

// Fake ID scripts
const fakeIds = [
    './fake_ids/id_1.js',
    // Add more fake ID paths here if needed
];

// Main ID script (for the main account)
const mainIdScript = './main_id/main_id.js';

// Create and store workers
let workers = [];
let mainWorker = new Worker(mainIdScript); // Main account worker

console.log('Main account worker started.');

// // Spawn workers for each fake ID
// fakeIds.forEach((idScript, index) => {
//     console.log(`Starting worker for fake ID ${index + 1}...`);
//     const worker = new Worker(idScript);
//     workers.push(worker);

//     // Listen for messages from each fake ID worker
//     worker.on('message', (message) => {
//         console.log(`Message from worker ${index + 1}:`, message);
//     });

//     // Log errors from fake ID workers
//     worker.on('error', (err) => {
//         console.error(`Error in worker ${index + 1}:`, err);
//     });

//     // Log when fake ID workers exit
//     worker.on('exit', (code) => {
//         console.log(`Worker ${index + 1} exited with code ${code}`);
//     });
// });

// // Listen for messages from the main account worker
// mainWorker.on('message', (message) => {
//     console.log('Message from main worker:', message);

//     if (message.action === 'newTag' && message.postUrl) {
//         console.log(`Main account detected new tag on post: ${message.postUrl}`);

//         // Trigger fake accounts to like the post
//         workers.forEach((worker, index) => {
//             console.log(`Sending like command to worker ${index + 1} for post: ${message.postUrl}`);
//             worker.postMessage({ action: 'like', postUrl: message.postUrl });
//         });
//     }
// });

// Log errors from the main account worker
mainWorker.on('error', (err) => {
    console.error('Error in main worker:', err);
});

// Log when the main account worker exits
mainWorker.on('exit', (code) => {
    console.log(`Main worker exited with code ${code}`);
});

