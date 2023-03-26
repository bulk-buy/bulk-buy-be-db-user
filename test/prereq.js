/* eslint-disable global-require */

// ===============
// DEPENDENCIES
// ===============

/**
 * Node dependencies.
 */

const { exec } = require("child_process");
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
exec("mongo namespace --eval 'db.entities.drop()'");
delete process.env.PORT;
clearRequireCache();
require("./core");
exec("mongo namespace --eval 'db.entities.drop()'");
