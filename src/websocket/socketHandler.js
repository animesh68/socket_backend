const { WebSocketServer } = require('ws');
const url = require('url');
const { addClient, removeClient, broadcastMessage } = require('./clients');
const { handleMessage } = require('./messageHandler');
const { formatMessage } = require('../utils/helpers');

const initializeWebSocket = (server) => {
  const wss = new WebSocketServer({ server });

  wss.on('connection', (ws, req) => {
    // Parse URL and extract username: ws://localhost:3000?username=Alice
    const reqUrl = url.parse(req.url, true);
    const username = reqUrl.query.username || `Guest_${Math.floor(Math.random() * 1000)}`;

    // Register connected client
    addClient(ws, username);

    // Broadcast system join message
    broadcastMessage(formatMessage('System', `${username} joined the chat.`, 'system'));

    // Listen for incoming messages
    ws.on('message', (message) => {
      handleMessage(ws, message);
    });

    // Handle client disconnect
    ws.on('close', () => {
      const disconnectedUser = removeClient(ws);
      if (disconnectedUser) {
        broadcastMessage(formatMessage('System', `${disconnectedUser} left the chat.`, 'system'));
      }
    });

    // Handle WebSocket errors locally for this client
    ws.on('error', (error) => {
      console.error(`WebSocket error from ${username}:`, error);
    });
  });

  console.log('WebSocket server attached.');
  return wss;
};

module.exports = { initializeWebSocket };
