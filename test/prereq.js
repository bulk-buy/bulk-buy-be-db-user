/* eslint-disable global-require */

// ===============
// DEPENDENCIES
// ===============

/**
 * Node dependencies.
 */

const process = require("node:process");

// ===============
// VARIABLES
// ===============

process.env.NODE_ENV = "test";

const clearRequireCache = function () {
  Object.keys(require.cache).forEach((key) => {
    delete require.cache[key];
  });
};

// ===============
// TESTS
// ===============

// using defaults from config
delete process.env.PORT;
clearRequireCache();
require("./core");
