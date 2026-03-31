/**
 * Formats a chat message for broadcasting 
 * @param {string} user 
 * @param {string} text 
 * @param {string} type - e.g. 'chat' or 'system'
 * @returns {string} Stringified JSON payload
 */
const formatMessage = (user, text, type = 'chat') => {
  return JSON.stringify({
    user,
    text,
    type,
    timestamp: new Date().toISOString()
  });
};

module.exports = {
  formatMessage
};
