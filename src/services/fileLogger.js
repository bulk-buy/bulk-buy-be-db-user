// ===============
// DEPENDENCIES
// ===============

/**
 * Node dependencies.
 */

const path = require("node:path");

/**
 * Module dependencies.
 */

const log4js = require("log4js");

/**
 * Internal dependencies.
 */

const config = require("../config");

// ===============
// CONSTANTS
// ===============

const DEFAULT_PATH_DEPTH = 4;
const PATTERN_PREFIX = `[%d] [%-5p] [%f{${DEFAULT_PATH_DEPTH}}:%l:%o] %c - `;
const BASIC_PATTERN = `${PATTERN_PREFIX}%m`;
const COLOR_PATTERN = `%[${PATTERN_PREFIX}%]%m`;

const DEFAULT_BACKUPS = 14;
const DEFAULT_MAX_LOG_SIZE = 20 * 1024 * 1024;

// ===============
// LOG4JS CONFIG
// ===============

const configure = () => {
  if (log4js.isConfigured()) return;

  log4js.configure({
    appenders: {
      console: {
        type: "console",
        layout: { type: "pattern", pattern: COLOR_PATTERN },
      },
      main: {
        type: "dateFile",
        filename: path.resolve(config.logPath, "main.log"),
        pattern: "-yyyy-MM-dd",
        maxLogSize: DEFAULT_MAX_LOG_SIZE,
        numBackups: DEFAULT_BACKUPS,
        layout: { type: "pattern", pattern: BASIC_PATTERN },
        keepFileExt: true,
        compress: true,
      },
      access: {
        type: "dateFile",
        filename: path.resolve(config.logPath, "access.log"),
        pattern: "-yyyy-MM-dd",
        maxLogSize: DEFAULT_MAX_LOG_SIZE,
        numBackups: DEFAULT_BACKUPS,
        layout: { type: "pattern", pattern: BASIC_PATTERN },
        keepFileExt: true,
        compress: true,
      },
      accessConsole: {
        type: "logLevelFilter",
        appender: "console",
        level: "warn",
      },
      errors: {
        type: "dateFile",
        filename: path.resolve(config.logPath, "error.log"),
        pattern: "-yyyy-MM-dd",
        maxLogSize: DEFAULT_MAX_LOG_SIZE,
        numBackups: DEFAULT_BACKUPS,
        layout: { type: "pattern", pattern: BASIC_PATTERN },
        keepFileExt: true,
        compress: true,
      },
      errorFilter: {
        type: "logLevelFilter",
        appender: "errors",
        level: "error",
      },
    },
    categories: {
      default: {
        appenders:
          /* istanbul ignore next: do not log to console for npm test */
          config.env === "test"
            ? ["main", "errorFilter"]
            : ["console", "main", "errorFilter"],
        level: "info",
        enableCallStack: true,
      },
      access: {
        appenders:
          /* istanbul ignore next: do not log to console for npm test */
          config.env === "test"
            ? ["access", "errorFilter"]
            : ["accessConsole", "access", "errorFilter"],
        level: "debug",
        enableCallStack: true,
      },
    },
  });
};
configure();

// ===============
// EXPORTS
// ===============

exports.framework = log4js;
exports.configure = configure;
exports.getLogger = log4js.getLogger;
exports.shutdown = log4js.shutdown;
