// Wrapper for the route handlers
// if there is an error, it will catch it and pass it to next()

module.exports = function (handler) {
  return async (req, res, next) => {
    try {
      await handler(req, res);
    }
    catch(err) {
      next(err);
    }
  };
}
