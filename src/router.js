// ===============
// DEPENDENCIES
// ===============

/**
 * Module dependencies.
 */

const express = require("express");

/**
 * Internal dependencies.
 */

const { version } = require("../package.json");

// ===============
// ROUTES
// ===============

const router = express.Router();

// endpoint: /
router.get("/", (req, res) => {
  res.send({ version });
});

// ===============
// EXPORTS
// ===============

module.exports = router;
