const xss = require('xss');

const sanitizeData = (obj) => {
  if (Array.isArray(obj)) {
    return obj.map(v => sanitizeData(v));
  }

  if (typeof obj === 'object' && obj !== null) {
    return Object.keys(obj).reduce((result, key) => ({
      ...result,
      [key]: sanitizeData(obj[key])
    }), {});
  }

  if (typeof obj === 'string') {
    return xss(obj);
  }

  return obj;
};

const sanitizeMiddleware = (req, res, next) => {
  req.body = sanitizeData(req.body);
  req.query = sanitizeData(req.query);
  req.params = sanitizeData(req.params);
  next();
};

module.exports = sanitizeMiddleware; 