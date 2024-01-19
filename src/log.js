/**
 * Log namespace.
 * This namespace provides loggers to log messages to the openHAB Log.
 *
 * @example <caption>Basic logging</caption>
 * let log = require('openhab').log('my_logger');
 * log.info("Hello World!")
 *
 * @namespace log
 */

/**
 * Logger prefix
 *
 * @memberof log
 */
const LOGGER_PREFIX = 'org.openhab.automation.openhab-js';

const MessageFormatter = Java.type('org.slf4j.helpers.MessageFormatter');

/**
 * Logger class. A named logger providing the ability to log formatted messages.
 *
 * @memberof log
 * @hideconstructor
 */
class Logger {
  /**
   * Creates a new logger. Don't use directly, use {@link log} on module.
   *
   * @param {string} _name the name of the logger. Will be prefixed by {@link LOGGER_PREFIX}
   * @param {*} _listener a callback to receive logging calls. Can be used to send calls elsewhere, such as escalate errors.
   */
  constructor (_name, appenderProvider) {
    /** @private */
    this._name = _name || this._getCallerDetails('', 3).fileName.replace(/\.[^/.]+$/, '');
    /** @private */
    this.appenderProvider = appenderProvider;
    /** @private */
    this._logger = Java.type('org.slf4j.LoggerFactory').getLogger(LOGGER_PREFIX + '.' + this.name.toString().toLowerCase());
  }

  /**
   * Method to determine caller. Don't use directly.
   *
   * @private
   * @param {object} msg the message to get caller details for
   * @param {number} ignoreStackDepth the number of stack frames which to ignore in calculating caller
   * @returns {Error} message as an error object, with fileName, caller and optional lineNumber properties
   */
  _getCallerDetails (msg, ignoreStackDepth) {
    let stackLine = null;

    if (!(msg instanceof Error)) {
      msg = Error(msg);
      stackLine = msg.stack.split('\n')[ignoreStackDepth];
    } else {
      stackLine = msg.stack.split('\n')[1];
    }

    // pick out the call, fileName & lineNumber from the specific frame
    let match = stackLine.match(/^\s+at\s*(?<caller>[^ ]*) \(?(?<fileName>[^:]+):(?<lineNumber>[0-9]+):[0-9]+\)?/);

    if (match) {
      Object.assign(msg, match.groups);
    } else { // won't match an 'eval'd string, so retry
      match = stackLine.match(/\s+at\s+<eval>:(?<lineNumber>[0-9]+):[0-9]+/);
      if (match) {
        Object.assign(msg, {
          fileName: '<unknown>',
          caller: '<root script>'
        }, match.groups);
      } else {
        Object.assign(msg, {
          fileName: '<unknown>',
          caller: '<root script>'
        });
      } // throw Error(`Failed to parse stack line: ${stackLine}`);
    }

    return msg;
  }

  /**
   * Method to format a log message. Don't use directly.
   *
   * @private
   * @param {object} msg the message to get caller details for
   * @param {string} levelString the level being logged at
   * @param {number} ignoreStackDepth the number of stack frames which to ignore in calculating caller
   * @param {string} [prefix=log] the prefix type, such as none, level, short or log.
   * @returns {string} message with 'message' String property
   */
  _formatLogMessage (msg, levelString, ignoreStackDepth, prefix = 'none') {
    const clazz = this;
    const msgData = {
      message: msg.toString(),
      get caller () { // don't run this unless we need to, then cache it
        this.cached = this.cached || clazz._getCallerDetails(msg, ignoreStackDepth);
        return this.cached;
      }
    };

    levelString = levelString.toUpperCase();

    switch (prefix) {
      case 'none': return msgData.message;
      case 'level': return `[${levelString}] ${msgData.message}`;
      case 'short': return `${msgData.message}\t\t[${this.name}, ${msgData.caller.fileName}:${msgData.caller.lineNumber}]`;
      case 'log': return `${msgData.message}\t\t[${this.name} at source ${msgData.caller.fileName}, line ${msgData.caller.lineNumber}]`;
      default: throw Error(`Unknown prefix type ${prefix}`);
    }
  }

  /**
   * Logs at ERROR level.
   * @see atLevel
   */
  error () { this.atLevel('error', ...arguments); }
  /**
     * Logs at ERROR level.
     * @see atLevel
     */
  warn () { this.atLevel('warn', ...arguments); }
  /**
   * Logs at INFO level.
   * @see atLevel
   */
  info () { this.atLevel('info', ...arguments); }
  /**
   * Logs at DEBUG level.
   * @see atLevel
   */
  debug () { this.atLevel('debug', ...arguments); }
  /**
   * Logs at TRACE level.
   * @see atLevel
   */
  trace () { this.atLevel('trace', ...arguments); }

  /**
   * Logs a message at the supplied level. The message may include placeholders {} which
   * will be substituted into the message string only if the message is actually logged.
   *
   * @example
   * log.atLevel('INFO', 'The widget was created as {}', widget);
   *
   *
   * @param {string} level The level at which to log, such as 'INFO', or 'DEBUG'
   * @param {string|Error} msg the message to log, possibly with object placeholders
   * @param {object[]} objects=[] the objects to substitute into the log message
   */
  atLevel (level, msg, ...objects) {
    const titleCase = level[0].toUpperCase() + level.slice(1);
    try {
      if (this._logger[`is${titleCase}Enabled`]()) {
        this.maybeLogWithThrowable(level, msg, objects) ||
                    this.writeLogLine(level, this._formatLogMessage(msg, level, 6), objects);
      }
    } catch (err) {
      this._logger.error(this._formatLogMessage(err, 'error', 0));
    }
  }

  maybeLogWithThrowable (level, msg, objects) {
    if (objects.length === 1) {
      const obj = objects[0];
      if ((obj instanceof Error || (obj.message && obj.name && obj.stack)) && !msg.includes('{}')) { // todo: better substitution detected
        // log the basic message
        this.writeLogLine(level, msg, objects);

        // and log the exception
        this.writeLogLine(level, `${obj.name} : ${obj.message}\n${obj.stack}`);
        return true;
      }
    }
    return false;
  }

  writeLogLine (level, message, objects = []) {
    const formatted = MessageFormatter.arrayFormat(message, objects).getMessage();

    this._logger[level](formatted);
  }

  /**
   * The listener function attached to this logger.
   * @return {*} the listener function
   */
  get listener () { return this._listener; }

  /**
   * The name of this logger
   * @return {string} the logger name
   */
  get name () { return this._name; }
}

/**
 * Creates a logger.
 * @see Logger
 * @param {string} name the name of the logger
 * @memberof log
 */
function newLogger (_name) {
  return new Logger(_name);
}

module.exports = newLogger;
module.exports.Logger = Logger;
