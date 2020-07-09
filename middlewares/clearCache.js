const { clearCache } = require('../services/cache'); // clearCache is the name of function to be called in cache.js
module.exports = async (req, res, next) => {
    await next();
    clearCache(req.user.id);
}