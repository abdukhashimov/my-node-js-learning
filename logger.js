function logger(req, res, next) {
  console.log("logging...");
  next();
}

function authenticating(req, res, next) {
  console.log("authenticating...");
  next();
}

module.exports = { logger, authenticating };
