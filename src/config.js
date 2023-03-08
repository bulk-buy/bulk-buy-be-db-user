// ===============
// DEPENDENCIES
// ===============

/**
 * Node dependencies.
 */

const process = require("node:process");

// ===============
// EXPORTS
// ===============

module.exports = {
  get port() {
    return process.env.PORT || "3000";
  },
};
