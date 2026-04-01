const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    senderName: {
      type: String,
      required: true,
    },
    // null = general chat; set = DM recipient
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    text: {
      type: String,
      required: true,
      trim: true,
    },
    // 'general' | 'dm'
    type: {
      type: String,
      enum: ['general', 'dm'],
      default: 'general',
    },
  },
  { timestamps: true }
);

// Fast lookup for DM history between two users
messageSchema.index({ sender: 1, receiver: 1 });
// Fast lookup for general messages
messageSchema.index({ type: 1, createdAt: -1 });

module.exports = mongoose.model('Message', messageSchema);
