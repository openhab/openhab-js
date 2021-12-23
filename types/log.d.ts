declare function _exports(_name: any): Logger;
declare namespace _exports {
    export { Logger };
}
export = _exports;
/**
 * Logger class. A named logger providing the ability to log formatted messages.
 *
 * @memberof log
 * @hideconstructor
 */
declare class Logger {
    /**
     * Creates a new logger. Don't use directly, use {@link log} on module.
     *
     * @param {String} _name the name of the logger. Will be prefixed by {@link LOGGER_PREFIX}
     * @param {*} _listener a callback to receive logging calls. Can be used to send calls elsewhere, such as escalate errors.
     */
    constructor(_name: string, appenderProvider: any);
    _name: any;
    appenderProvider: any;
    _logger: any;
    /**
     * Method to determine caller. Don't use directly.
     *
     * @private
     * @param {Object} msg the message to get caller details for
     * @param {Number} ignoreStackDepth the number of stack frames which to ignore in calculating caller
     * @returns {Error} message as an error object, with fileName, caller and optional lineNumber properties
     */
    private _getCallerDetails;
    /**
     * Method to format a log message. Don't use directly.
     *
     * @private
     * @param {Object} msg the message to get caller details for
     * @param {String} levelString the level being logged at
     * @param {Number} ignoreStackDepth the number of stack frames which to ignore in calculating caller
     * @param {String} [prefix=log] the prefix type, such as none, level, short or log.
     * @returns {Error} message with 'message' String property
     */
    private _formatLogMessage;
    /**
     * Logs at ERROR level.
     * @see atLevel
     */
    error(...args: any[]): void;
    /**
     * Logs at ERROR level.
     * @see atLevel
     */
    warn(...args: any[]): void;
    /**
     * Logs at INFO level.
     * @see atLevel
     */
    info(...args: any[]): void;
    /**
     * Logs at DEBUG level.
     * @see atLevel
     */
    debug(...args: any[]): void;
    /**
     * Logs at TRACE level.
     * @see atLevel
     */
    trace(...args: any[]): void;
    /**
     * Logs a message at the supplied level. The message may include placeholders {} which
     * will be substituted into the message string only if the message is actually logged.
     *
     * @example
     * log.atLevel('INFO', 'The widget was created as {}', widget);
     *
     *
     * @param {String} level The level at which to log, such as 'INFO', or 'DEBUG'
     * @param {String|Error} msg the message to log, possibly with object placeholders
     * @param {Object[]} [objects] the objects to substitute into the log message
     */
    atLevel(level: string, msg: string | Error, ...objects?: any[]): void;
    maybeLogWithThrowable(level: any, msg: any, objects: any): boolean;
    writeLogLine(level: any, message: any, objects?: any[]): void;
    /**
     * The listener function attached to this logger.
     * @return {*} the listener function
     */
    get listener(): any;
    /**
     * The name of this logger
     * @return {String} the logger name
     */
    get name(): string;
}
