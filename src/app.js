const express = require('express');
const cors = require('cors');
const config = require('./config/server');
const authRouter = require('./routes/auth');
const usersRouter = require('./routes/users');
const messagesRouter = require('./routes/messages');

const app = express();

// Middleware
app.use(cors({ origin: '*' }));
app.use(express.json());

// Auth routes
app.use('/auth', authRouter);

// Protected routes
app.use('/users', usersRouter);
app.use('/messages', messagesRouter);

// Basic health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Backend is running' });
});

module.exports = app;
