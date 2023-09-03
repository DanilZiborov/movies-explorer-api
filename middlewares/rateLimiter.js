const limiter = require('express-rate-limit');

const rateLimiter = limiter({
  windowMs: 10 * 60 * 1000,
  max: 50,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
});

module.exports = { rateLimiter };
