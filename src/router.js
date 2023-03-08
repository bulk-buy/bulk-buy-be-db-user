// ===============
// DEPENDENCIES
// ===============

/**
 * Module dependencies.
 */

var express = require('express');

// ===============
// ROUTES
// ===============

var router = express.Router();

router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

// ===============
// EXPORTS
// ===============

module.exports = router;
