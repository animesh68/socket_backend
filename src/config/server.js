// dotenv is loaded in index.js before this file is required

module.exports = {
  port: process.env.PORT || 3000,
  frontendUrl: process.env.FRONTEND_URL || '*',
};
