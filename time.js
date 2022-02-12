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
 * Provides access to some {@link https://github.com/js-joda/js-joda/tree/master/packages/locale JS-Joda Locales}.
 *
 * @memberOf time
 * @property {*} ENGLISH english (en)
 * @property {*} US english United States (en-US)
 * @property {*} UK english Great Britan (en-GB)
 * @property {*} CANADA english Canada (en-CA)
 * @property {*} FRENCH french (fr)
 * @property {*} FRANCE french France (fr-FR)
 * @property {*} GERMAN german (de)
 * @property {*} GERMANY german Germany (de-DE)
 */
const Locale = {
  ENGLISH: require('@js-joda/locale_en').Locale.ENGLISH,
  US: require('@js-joda/locale_en').Locale.US,
  UK: require('@js-joda/locale_en').Locale.GB,
  CANADA: require('@js-joda/locale_en').Locale.CANADA,
  FRENCH: require('@js-joda/locale_fr-fr').Locale.FRENCH,
  FRANCE: require('@js-joda/locale_fr-fr').Locale.FRANCE,
  GERMAN: require('@js-joda/locale_de-de').Locale.GERMAN,
  GERMANY: require('@js-joda/locale_de-de').Locale.GERMANY
};

module.exports = {
  ...time,
  Locale: Locale
};
