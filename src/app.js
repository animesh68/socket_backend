const express = require('express');
const cors = require('cors');
const config = require('./config/server');

const app = express();

// Middleware
app.use(cors({ origin: '*' }));
app.use(express.json());

// Basic health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Backend is running' });
});

module.exports = app;
