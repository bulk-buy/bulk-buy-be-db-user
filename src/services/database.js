// ===============
// DEPENDENCIES
// ===============

/**
 * Module dependencies.
 */

const mongoose = require("mongoose");

/**
 * Internal dependencies.
 */

const config = require("../config");
const fileLogger = require("./fileLogger");

// ===============
// VARIABLES
// ===============

const logger = fileLogger.getLogger("database");

// ===============
// MONGOOSE CONFIG
// ===============

const getConnectionState = () => mongoose.connection.readyState;

const isConnected = () => getConnectionState() === mongoose.STATES.connected;

let connecting = false;
const connectWithRetry = () =>
  new Promise((resolve, reject) => {
    if (connecting || isConnected()) {
      resolve();
      return;
    }

    connecting = true;
    let count = 0;

    const options = {
      autoIndex: false, // do not auto create indexes
      autoCreate: false, // do not auto create table
    };

    const retry = () => {
      logger.info(`Starting Connection (Attempt ${(count += 1)})`);
      mongoose
        .connect(config.dbEndpoint, options)
        .then(() => {
          logger.info("Connection Established");
          connecting = false;
          resolve();
        })
        .catch(
          /* istanbul ignore next */ (err) => {
            logger.warn(
              `Connection Unsuccessful: Retrying after 5 seconds\n `,
              err
            );
            if (connecting) setTimeout(retry, 5000);
            else reject();
          }
        );
    };
    retry();
  });
connectWithRetry();

const disconnect = () => {
  connecting = false;
  return mongoose.disconnect();
};

const shutdown = () => disconnect();

// ===============
// MONGOOSE EVENTS
// ===============
// https://mongoosejs.com/docs/connections.html#connection-events

let manualConnect = false;
mongoose.connection.on("connecting", () => {
  logger.info("Connecting");
  manualConnect = true;
});

mongoose.connection.on("connected", () => {
  if (manualConnect) {
    logger.info("Connected");
    manualConnect = false;
  }
});

let manualDisconnect = false;
mongoose.connection.on("disconnecting", () => {
  logger.info("Disconnecting");
  manualDisconnect = true;
});

mongoose.connection.on("disconnected", () => {
  if (manualDisconnect) {
    logger.info("Disconnected");
    manualDisconnect = false;
  } else logger.error("Disconnected");
});

mongoose.connection.on("reconnected", () => {
  logger.info("Reconnected");
});

/* istanbul ignore next */
mongoose.connection.on("error", (err) => {
  logger.error(err);
});

// ===============
// EXPORTS
// ===============

exports.framework = mongoose;
exports.logger = logger;

exports.STATES = mongoose.STATES;
exports.connection = mongoose.connection;
exports.getConnectionState = getConnectionState;
exports.isConnected = isConnected;

exports.connectWithRetry = connectWithRetry;
exports.disconnect = disconnect;
exports.shutdown = shutdown;
