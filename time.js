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
 * Provides access to all {@link https://github.com/js-joda/js-joda/tree/master/packages/locale JS-Joda Locales}.
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
 * @property {*} SPANISH spanish (sp)
 * @property {*} SPAIN spanish Spain (sp-SP)
 * @property {*} KOREAN korean (ko)
 * @property {*} JAPANESE japanese (ja)
 * @property {*} JAPAN japanese Japan (ja-JA)
 * @property {*} ITALIAN italian (it)
 * @property {*} ITALY italian Italy (it-IT)
 * @property {*} CHINESE chinese (zh)
 * @property {*} ROMANIAN romanian (ro)
 * @property {*} SWEDISH swedish (sv)
 * @property {*} SWEDEN swedish Sveden (sv-SV)
 * @property {*} HINDI hindi (hi)
 * @property {*} RUSSIAN russian (ru)
 */
const Locale = {
  ENGLISH: require('@js-joda/locale_en').Locale.ENGLISH,
  US: require('@js-joda/locale_en').Locale.US,
  UK: require('@js-joda/locale_en').Locale.GB,
  CANADA: require('@js-joda/locale_en').Locale.CANADA,
  FRENCH: require('@js-joda/locale_fr').Locale.FRENCH,
  FRANCE: require('@js-joda/locale_fr').Locale.FRANCE,
  GERMAN: require('@js-joda/locale_de').Locale.GERMAN,
  GERMANY: require('@js-joda/locale_de').Locale.GERMANY,
  SPANISH: require('@js-joda/locale_es').Locale.SPANISH,
  SPAIN: require('@js-joda/locale_es').Locale.SPAIN,
  KOREAN: require('@js-joda/locale_ko').Locale.KOREAN,
  JAPANESE: require('@js-joda/locale_ja').Locale.JAPANESE,
  JAPAN: require('@js-joda/locale_ja').Locale.JAPAN,
  ITALIAN: require('@js-joda/locale_it').Locale.ITALIAN,
  ITALY: require('@js-joda/locale_it').Locale.ITALY,
  CHINESE: require('@js-joda/locale_zh').Locale.CHINESE,
  ROMANIAN: require('@js-joda/locale_ro').Locale.ROMANIAN,
  SWEDISH: require('@js-joda/locale_sv').Locale.SWEDISH,
  SWEDEN: require('@js-joda/locale_sv').Locale.SWEDEN,
  HINDI: require('@js-joda/locale_hi').Locale.HINDI,
  RUSSIAN: require('@js-joda/locale_ru').Locale.RUSSIAN
};

module.exports = {
  ...time,
  Locale: Locale
};
