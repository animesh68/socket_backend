// Store connected clients as a Map
// Key: WebSocket instance, Value: user details (e.g. username)
const clients = new Map();

const addClient = (ws, username) => {
  clients.set(ws, { username });
  console.log(`User connected: ${username}. Total clients: ${clients.size}`);
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

const getClientInfo = (ws) => {
  return clients.get(ws);
};

const getClients = () => clients;

/**
 * Broadcasts a string payload to all connected clients
 * @param {string} messagePayload 
 */
const broadcastMessage = (messagePayload) => {
  clients.forEach((clientInfo, clientWs) => {
    // Check if the connection is completely open (readyState === 1)
    if (clientWs.readyState === 1) { 
      clientWs.send(messagePayload);
    }
  });
};

module.exports = {
  addClient,
  removeClient,
  getClientInfo,
  getClients,
  broadcastMessage
};
