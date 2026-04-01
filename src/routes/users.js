const express = require('express');
const User = require('../models/User');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

// GET /users/search?q=<query>
// Returns up to 10 users matching name or email, excluding the caller
router.get('/search', requireAuth, async (req, res) => {
  try {
    const q = (req.query.q || '').trim();
    if (!q) {
      return res.json({ users: [] });
    }

    const regex = new RegExp(q, 'i');
    const users = await User.find({
      _id: { $ne: req.user._id },      // exclude self
      $or: [{ name: regex }, { email: regex }],
    })
      .select('_id name email')
      .limit(10)
      .lean();

    res.json({ users });
  } catch (error) {
    console.error('User search error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
