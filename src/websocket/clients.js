// Store connected clients as a Map
// Key: WebSocket instance, Value: { username, userId }
const clients = new Map();

const addClient = (ws, username, userId) => {
  clients.set(ws, { username, userId });
  console.log(`User connected: ${username} (${userId}). Total clients: ${clients.size}`);
};

const removeClient = (ws) => {
  const clientInfo = clients.get(ws);
  if (clientInfo) {
    clients.delete(ws);
    console.log(`User disconnected: ${clientInfo.username}. Total clients: ${clients.size}`);
    return clientInfo.username;
  }
  return null;
};

const getClientInfo = (ws) => clients.get(ws);

const getClients = () => clients;

/**
 * Find a connected WebSocket by userId
 */
const getSocketByUserId = (userId) => {
  for (const [ws, info] of clients.entries()) {
    if (info.userId === userId) return ws;
  }
  return null;
};

/**
 * Broadcasts a string payload to all connected clients
 * @param {string} messagePayload
 */
const broadcastMessage = (messagePayload) => {
  clients.forEach((clientInfo, clientWs) => {
    if (clientWs.readyState === 1) {
      clientWs.send(messagePayload);
    }
  });
};

/**
 * Send a message to a specific client by userId
 * @param {string} userId
 * @param {string} messagePayload
 */
const sendToUser = (userId, messagePayload) => {
  const ws = getSocketByUserId(userId);
  if (ws && ws.readyState === 1) {
    ws.send(messagePayload);
  }
};

module.exports = {
  addClient,
  removeClient,
  getClientInfo,
  getClients,
  getSocketByUserId,
  broadcastMessage,
  sendToUser,
};
