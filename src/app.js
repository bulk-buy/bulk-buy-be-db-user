#!/usr/bin/env node

// ===============
// DEPENDENCIES
// ===============

/**
 * Node dependencies.
 */

const console = require('node:console');
const process = require('node:process');

/**
 * Module dependencies.
 */

const debug = require('debug')('bulk-buy-be:server');
const express = require('express');
const logger = require('morgan');

/**
 * Internal dependencies.
 */

const config = require('./config');
const router = require('./router');

// ===============
// EXPRESS CONFIG
// ===============

const app = express();

app.use(logger('dev'));
app.use(express.json());

app.get("/favicon.ico", (req, res) => res.sendStatus(204));
app.use(router);

// ===============
// HTTP SERVER
// ===============

/**
 * Normalize a port into a number, string, or false.
 * @param {string} val
 */

const normalizePort = (val) => {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
};

/**
 * Get port from environment and store in Express.
 */

var port = normalizePort(config.port);
app.set('port', port);

/**
 * Listen on provided port, on all network interfaces.
 */

const server = app.listen(port);

/**
 * Event listener for HTTP server "error" event.
 * @param {Error} error
 */

server.on('error', (error) => {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
});

/**
 * Event listener for HTTP server "listening" event.
 */

server.on('listening', () => {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
});

// ===============
// EXPORTS
// ===============

module.exports = server;
