// ===============
// DEPENDENCIES
// ===============

/**
 * Module dependencies.
 */

const express = require("express");

// ===============
// ROUTES
// ===============

const router = express.Router();

router.get("/", (req, res) => {
  res.send("respond with a resource");
});

// ===============
// EXPORTS
// ===============

module.exports = router;
