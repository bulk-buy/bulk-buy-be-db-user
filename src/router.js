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

const { name, version } = require("../package.json");

// ===============
// ROUTES
// ===============

const router = express.Router();

// endpoint: /
router.get("/", (req, res) => {
  res.send({ name, version });
});

// ===============
// EXPORTS
// ===============

module.exports = router;
