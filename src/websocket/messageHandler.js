const { broadcastMessage, getClientInfo } = require('./clients');

const handleMessage = (ws, message) => {
  try {
    // Parse incoming message (expected to be stringified JSON)
    const payload = JSON.parse(message.toString());
    
    // Retrieve the sender's info using the socket reference
    const clientInfo = getClientInfo(ws);
    const username = clientInfo ? clientInfo.username : 'Unknown';

    // Broadcast the exact payload plus a timestamp, and ensure we map the user.
    // If frontend already provided 'user', this overrides/supplements it cleanly.
    const outgoingMessage = JSON.stringify({
      ...payload,
      user: username,
      timestamp: new Date().toISOString()
    });
    
    // Broadcast message to everyone
    broadcastMessage(outgoingMessage);
  } catch (error) {
    console.error('Error parsing incoming message:', error);
  }
};

module.exports = { handleMessage };
