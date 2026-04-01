const { broadcastMessage, getClientInfo, sendToUser } = require('./clients');
const Message = require('../models/Message');

const handleMessage = async (ws, message) => {
  try {
    const payload = JSON.parse(message.toString());
    const clientInfo = getClientInfo(ws);
    if (!clientInfo) return;

    const { username, userId } = clientInfo;
    const text = payload.text?.trim();
    if (!text) return;

    const msgType = payload.type === 'dm' ? 'dm' : 'general';

    if (msgType === 'general') {
      // ── General broadcast ──────────────────────────────────────────────
      const outgoing = JSON.stringify({
        type: 'general',
        user: username,
        text,
        timestamp: new Date().toISOString(),
      });

      broadcastMessage(outgoing);

      // Persist to DB (fire-and-forget, don't await to keep WS fast)
      if (userId) {
        Message.create({
          sender: userId,
          senderName: username,
          receiver: null,
          text,
          type: 'general',
        }).catch((err) => console.error('Failed to save general message:', err));
      }
    } else {
      // ── Direct message ─────────────────────────────────────────────────
      const toUserId = payload.to; // target user _id string
      if (!toUserId || !userId) return;

      const outgoing = JSON.stringify({
        type: 'dm',
        from: userId,
        fromName: username,
        to: toUserId,
        text,
        timestamp: new Date().toISOString(),
      });

      // Send to recipient (if online)
      sendToUser(toUserId, outgoing);

      // Echo back to sender as well (so their own chat window updates)
      sendToUser(userId, outgoing);

      // Persist to DB
      Message.create({
        sender: userId,
        senderName: username,
        receiver: toUserId,
        text,
        type: 'dm',
      }).catch((err) => console.error('Failed to save DM:', err));
    }
  } catch (error) {
    console.error('Error handling message:', error);
  }
};

module.exports = { handleMessage };
