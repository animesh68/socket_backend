const express = require('express');
const Message = require('../models/Message');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

// GET /messages/general?limit=50
// Fetch last N general chat messages (oldest first for display)
router.get('/general', requireAuth, async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit) || 50, 100);

    const messages = await Message.find({ type: 'general' })
      .sort({ createdAt: -1 })
      .limit(limit)
      .select('senderName text type createdAt')
      .lean();

    // Reverse so oldest is first (chronological order for the chat window)
    res.json({ messages: messages.reverse() });
  } catch (error) {
    console.error('General history error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /messages/dm/:userId?limit=50
// Fetch DM history between caller and another user
router.get('/dm/:userId', requireAuth, async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit) || 50, 100);
    const myId = req.user._id;
    const otherId = req.params.userId;

    const messages = await Message.find({
      type: 'dm',
      $or: [
        { sender: myId, receiver: otherId },
        { sender: otherId, receiver: myId },
      ],
    })
      .sort({ createdAt: -1 })
      .limit(limit)
      .select('sender senderName text type createdAt')
      .lean();

    res.json({ messages: messages.reverse() });
  } catch (error) {
    console.error('DM history error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
