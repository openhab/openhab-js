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
 * Parses a ZonedDateTime to milliseconds from now until the ZonedDateTime.
 *
 * @memberof time
 * @returns {number} duration from now to the ZonedDateTime in milliseconds
 */
time.ZonedDateTime.prototype.millisFromNow = function () {
  return time.Duration.between(time.ZonedDateTime.now(), this).toMillis();
};

module.exports = time;
