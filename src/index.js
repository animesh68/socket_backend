const http = require('http');
const app = require('./app');
const { initializeWebSocket } = require('./websocket/socketHandler');
const config = require('./config/server');

// Create standard HTTP server wrapping the Express app
const server = http.createServer(app);

// Attach WebSocket server to HTTP server
initializeWebSocket(server);

// Start listening on port
server.listen(config.port, () => {
  console.log(`Server is listening on http://localhost:${config.port}`);
});
