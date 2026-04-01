require('dotenv').config();
const http = require('http');
const app = require('./app');
const { initializeWebSocket } = require('./websocket/socketHandler');
const config = require('./config/server');
const connectDB = require('./config/db');

// Create standard HTTP server wrapping the Express app
const server = http.createServer(app);

// Attach WebSocket server to HTTP server
initializeWebSocket(server);

// Connect to MongoDB, then start listening
connectDB().then(() => {
  server.listen(config.port, () => {
    console.log(`Server is listening on http://localhost:${config.port}`);
  });
});
