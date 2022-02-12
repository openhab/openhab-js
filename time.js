/**
 * Time namespace.
 * This namespace exports the {@link https://js-joda.github.io/js-joda/ JS-Joda library}, but also provides additional functionality.
 *
 * @namespace time
 */

require('@js-joda/timezone');
const time = require('@js-joda/core');

// openHAB uses a RFC DateTime string, js-joda defaults to the ISO version, this defaults RFC instead
const rfcFormatter = time.DateTimeFormatter.ofPattern("uuuu-MM-dd'T'HH:mm:ss.SSS[xxxx][xxxxx]");
const targetParse = time.ZonedDateTime.prototype.parse;
time.ZonedDateTime.prototype.parse = function (text, formatter = rfcFormatter) {
  return targetParse(text, formatter);
};

/**
 * Reschedule a timeout.
 * This can also be called after a timer has terminated, which will result in another execution of the code.
 *
 * @memberOf time
 * @param {*} timer the timer returned by {@link https://github.com/openhab/openhab-js#settimeout setTimeout}
 * @param {number} delay the time in milliseconds that the timer should wait before it expires and executes the function
 */
const updateTimeout = function (timer, delay) {
  if (timer !== undefined) {
    timer.reschedule(time.ZonedDateTime.now().plusNanos(delay * 1000000));
  }
};

/**
 * Parses a ZonedDateTime to milliseconds from now until the ZonedDateTime.
 * This is a monkey-patched function on JS-Joda's ZonedDateTime.
 *
 * @returns {number} duration from now to the ZonedDateTime in milliseconds
 */
time.ZonedDateTime.prototype.millisFromNow = function () {
  const duration = time.Duration.between(time.ZonedDateTime.now(), this);
  return duration.toMillis();
};

module.exports = {
  ...time,
  updateTimeout: updateTimeout
};
