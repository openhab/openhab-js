/**
 * Time namespace.
 * This namespace exports the {@link https://js-joda.github.io/js-joda/ JS-Joda library}, but also provides additional functionality.
 *
 * @namespace time
 */

/**
 * @typedef { import("./items/items").Item } items.Item
 * @private
 */

// reduce timezone file size, see https://github.com/js-joda/js-joda/blob/main/packages/timezone/README.md#reducing-js-joda-timezone-file-size
require('@js-joda/timezone/dist/js-joda-timezone-10-year-range');
const time = require('@js-joda/core');

const log = require('./log')('time');
const osgi = require('./osgi');
const { _isItem, _isZonedDateTime, _isInstant, _isDuration, _isQuantity } = require('./helpers');

const javaZDT = Java.type('java.time.ZonedDateTime');
const javaInstant = Java.type('java.time.Instant');
const javaDuration = Java.type('java.time.Duration');
const javaString = Java.type('java.lang.String');
const javaNumber = Java.type('java.lang.Number');
const ohItem = Java.type('org.openhab.core.items.Item');
const { DateTimeType, DecimalType, StringType, QuantityType } = require('@runtime');

const timeZoneProvider = osgi.getService('org.openhab.core.i18n.TimeZoneProvider');

// Set the system default timezone to the user-configured timezone
// Fixes issues such as https://github.com/openhab/openhab-js/issues/326
time.ZoneId.systemDefault = function () {
  return time.ZoneId.of(timeZoneProvider.getTimeZone().getId().toString());
};

// openHAB uses an RFC DateTime string, js-joda defaults to the ISO version, this defaults to RFC instead
const rfcFormatter = time.DateTimeFormatter.ofPattern("uuuu-MM-dd'T'HH:mm:ss.SSS[xxxx][xxxxx]");
const targetParse = time.ZonedDateTime.prototype.parse;
time.ZonedDateTime.prototype.parse = function (text, formatter = rfcFormatter) {
  return targetParse(text, formatter);
};

/**
 * Adds millis to the passed in Temporal as milliseconds. The millis are rounded first.
 * If millis is negative they will be subtracted.
 * @private
 * @param {time.Temporal} temporal temporal to add milleseconds to
 * @param {number|bigint} millis number of milliseconds to add
 */
function _addMillis (temporal, millis) {
  return temporal.plus(Math.round(millis), time.ChronoUnit.MILLIS);
}

/**
 * Adds the passed in QuantityType<Time> to the passed Temporal.
 * @private
 * @param {time.Temporal} temporal temporal to add seconds to
 * @param {QuantityType} quantityType an Item's QuantityType
 * @returns now plus the time length in the quantityType
 * @throws error when the units for the quantity type are not one of the Time units
 */
function _addQuantityType (temporal, quantityType) {
  const secs = quantityType.toUnit('s');
  if (secs) {
    return temporal.plus(secs.doubleValue(), time.ChronoUnit.SECONDS);
  } else {
    throw Error('Only Time units are supported to add QuantityTypes to a Temporal: ' + quantityType.toString());
  }
}

/**
 * Tests the string to see if it matches a 24-hour clock time like `hh:mm`, `hh:mm:ss`, `h:mm`, `h:mm:ss`
 * @private
 * @param {string} dtStr potential 24-hour time String
 * @returns {boolean} true if it matches HH:MM
 */
function _is24Hr (dtStr) {
  const regex = /^(0?[0-9]|1[0-9]|2[0-3])(:[0-5][0-9]){1,2}$/;
  return regex.test(dtStr);
}

/**
 * Tests the string to see if it matches a 12 hour clock time
 * @private
 * @param {string} dtStr potential hh:MM aa string
 * @returns {boolean} true if it matches hh:mm aa
 */
function _is12Hr (dtStr) {
  const regex = /^(0?[0-9]|1[0-2])(:[0-5][0-9]){1,2} ?[a|p|A|P]\.?[m|M]\.?$/;
  return regex.test(dtStr);
}

/**
 * Parses a string that conforms the ISO8601 standard to a {@link time.ZonedDateTime}.
 * The following ISO strings are supported:
 *  - for date: `YYYY-MM-DD`
 *  - for time: `hh:mm`, `hh:mm:ss`, `hh:mm:ss.f`
 *  - a combination of these date and time formats
 *  - full ISO8601: date format + `T` + any time format + offset (e.g. `Z` for UTC or `+01:00` and some other notations)
 *
 * @private
 * @param isoStr
 * @returns {time.ZonedDateTime|null} {@link time.ZonedDateTime} if parsing was successful, else `null`
 * @throws `JsJodaException` thrown by the {@link https://js-joda.github.io/js-joda/ JS-Joda library} that signals that string could not be parsed
 */
function _parseISO8601 (isoStr) {
  // Compatibility with Zone offsets without the ":" -> +HHmm or -HHmm
  function replacer (match, p1, p2, p3) {
    return p1 + p2 + ':' + p3;
  }
  isoStr = isoStr.replace(/([+|-])(\d{2})(\d{2})/, replacer);
  const REGEX = {
    LOCAL_DATE: /^(-?(?:[1-9][0-9]*)?[0-9]{4})-(1[0-2]|0[1-9])-(3[01]|0[1-9]|[12][0-9])$/, // YYYY-MM-DD
    LOCAL_TIME: /^\d{2}:\d{2}(:\d{2})?(\.\d+)?$/, // hh:mm or hh:mm:ss or hh:mm:ss.f
    LOCAL_DATE_TIME: /^(-?(?:[1-9][0-9]*)?[0-9]{4})-(1[0-2]|0[1-9])-(3[01]|0[1-9]|[12][0-9])T\d{2}:\d{2}(:\d{2})?(\.\d+)?$/, // LOCAL_DATE and LOCAL_TIME connected with "T"
    ISO_8601_FULL: /^(-?(?:[1-9][0-9]*)?[0-9]{4})-(1[0-2]|0[1-9])-(3[01]|0[1-9]|[12][0-9])T(2[0-3]|[01][0-9]):([0-5][0-9])(:[0-5][0-9])?(\.\d+)?(Z|[+-]\d{2}(:\d{2})?\[.*\])/, // with Zone ID
    ISO_8601_OFFSET: /^(-?(?:[1-9][0-9]*)?[0-9]{4})-(1[0-2]|0[1-9])-(3[01]|0[1-9]|[12][0-9])T(2[0-3]|[01][0-9]):([0-5][0-9])(:[0-5][0-9])?(\.\d+)?(Z|[+-]\d{2}(:\d{2})$)/ // offset only
  };
  switch (true) {
    case REGEX.LOCAL_DATE.test(isoStr): return time.ZonedDateTime.of(time.LocalDate.parse(isoStr), time.LocalTime.MIDNIGHT, time.ZoneId.systemDefault());
    case REGEX.LOCAL_TIME.test(isoStr): return time.ZonedDateTime.of(time.LocalDate.now(), time.LocalTime.parse(isoStr), time.ZoneId.systemDefault());
    case REGEX.LOCAL_DATE_TIME.test(isoStr): return time.ZonedDateTime.of(time.LocalDateTime.parse(isoStr), time.ZoneId.systemDefault());
    case REGEX.ISO_8601_FULL.test(isoStr): return time.ZonedDateTime.parse(isoStr);
    case REGEX.ISO_8601_OFFSET.test(isoStr): return time.ZonedDateTime.parse(isoStr).withZoneSameLocal(time.ZoneId.systemDefault());
  }
  return null;
}

/**
 * Parses the passed in string based on it's format and converts it to a ZonedDateTime.
 * If no timezone is specified, the configured timezone is used.
 * @private
 * @param {string} str string to parse and convert
 * @returns {time.ZonedDateTime}
 * @throws Error when the string cannot be parsed
 */
function _parseString (str) {
  // 12 hour time string
  if (_is12Hr(str)) {
    const parts = str.split(':');
    let hr = parseInt(parts[0]);
    hr = (str.contains('p') || str.contains('P')) ? hr + 12 : hr;
    return time.ZonedDateTime.now().withHour(hr)
      .withMinute(parseInt(parts[1])) // parseInt will ignore the am/pm
      .withSecond(parseInt(parts[2]) || 0)
      .withNano(0);
  }

  // 24-hour time string
  // This could also be handled by ISO8601, but h:mm string like 0:30 require this code here!
  if (_is24Hr(str)) {
    const parts = str.split(':');
    return time.ZonedDateTime.now().withHour(parts[0])
      .withMinute(parts[1])
      .withSecond(parts[2] || 0)
      .withNano(0);
  }

  // ISO8601 Time, Date, or DateTime string
  try {
    // Blockly compatibility with user input without the "T"
    const newStr = /^(-?(?:[1-9][0-9]*)?[0-9]{4})-(1[0-2]|0[1-9])-(3[01]|0[1-9]|[12][0-9]) \d{2}:\d{2}/.test(str) ? str.replace(' ', 'T') : str;
    const zdt = _parseISO8601(newStr);
    if (zdt !== null) return zdt;
  } catch (e) {
    throw Error(`Failed to parse ISO8601 string ${str}: ${e}`);
  }

  // Possibly ISO8601 Duration string
  // TODO: Further improvements here
  try {
    return time.ZonedDateTime.now().plus(time.Duration.parse(str));
  } catch (e) { // Unsupported
    throw Error(`Failed to parse string ${str}: ${e}`);
  }
}

/**
 * Converts the state of the passed in Item to a time.ZonedDateTime
 * @private
 * @param {HostState} rawState
 * @returns {time.ZonedDateTime}
 * @throws error if the Item's state is not supported or the Item itself is not supported
 */
function _convertItemRawStateToZonedDateTime (rawState) {
  if (rawState instanceof DecimalType) { // Number type Items
    return _addMillis(time.ZonedDateTime.now(), rawState.floatValue());
  } else if (rawState instanceof StringType) { // String type Items
    return _parseString(rawState.toString());
  } else if (rawState instanceof DateTimeType) { // DateTime Items
    return javaInstantToJsInstant(rawState.getInstant()).atZone(time.ZoneId.systemDefault());
  } else if (rawState instanceof QuantityType) { // Number:Time type Items
    return _addQuantityType(time.ZonedDateTime.now(), rawState);
  } else {
    throw Error(rawState.toString() + ' is not supported for conversion to time.ZonedDateTime');
  }
}

/**
 * Converts the state of the passed in Item to a time.Instant
 * @private
 * @param {HostState} rawState
 * @returns {time.Instant}
 * @throws error if the Item's state is not supported or the Item itself is not supported
 */
function _convertItemRawStateToInstant (rawState) {
  if (rawState instanceof StringType) { // String type Items
    return time.Instant.parse(rawState.toString());
  } else if (rawState instanceof DateTimeType) { // DateTime Items
    return javaInstantToJsInstant(rawState.getInstant());
  } else {
    throw Error(rawState.toString() + ' is not supported for conversion to time.Instant');
  }
}

/**
 * Convert Java Instant to JS-Joda Instant.
 *
 * @memberOf time
 * @param {JavaInstant} instant {@link https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/time/Instant.html java.time.Instant}
 * @returns {time.Instant} {@link https://js-joda.github.io/js-joda/class/packages/core/src/Instant.js~Instant.html JS-Joda Instant}
 */
function javaInstantToJsInstant (instant) {
  return time.Instant.ofEpochMilli(instant.toEpochMilli());
}

/**
 * Convert Java ZonedDateTime to JS-Joda ZonedDateTime.
 *
 * @memberOf time
 * @param {JavaZonedDateTime} zdt {@link https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/time/ZonedDateTime.html java.time.ZonedDateTime}
 * @returns {time.ZonedDateTime} {@link https://js-joda.github.io/js-joda/class/packages/core/src/ZonedDateTime.js~ZonedDateTime.html JS-Joda ZonedDateTime}
 */
function javaZDTToJsZDT (zdt) {
  const epoch = zdt.toInstant().toEpochMilli();
  const instant = time.Instant.ofEpochMilli(epoch);
  const zone = time.ZoneId.of(zdt.getZone().toString());
  return time.ZonedDateTime.ofInstant(instant, zone);
}

/**
 * Converts the passed in when to a time.ZonedDateTime based on the following
 * set of rules.
 *
 * - null, undefined: time.ZonedDateTime.now()
 * - time.ZonedDateTime: unmodified
 * - Java ZonedDateTime, DateTimeType: converted to time.ZonedDateTime equivalent
 * - JavaScript native {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date Date}: converted to a `time.ZonedDateTime` using configured timezone
 * - number, bigint, Java Number, DecimalType: rounded and added to `time.ZonedDateTime.now()` as milliseconds
 * - {@link Quantity} & QuantityType: if the unit is time-compatible, added to `time.ZonedDateTime.now()`
 * - Item: converts the state of the Item based on the *Type rules described here
 * - String, Java String, StringType: parsed based on the following rules; if no timezone is specified the configured timezone is used
 *     - ISO 8601 DateTime: any Date, Time or DateTime with optional time offset and/or time zone in the {@link https://en.wikipedia.org/wiki/ISO_8601 ISO8601 calendar system}
 *     - ISO 8601 Duration: any Duration in the {@link https://en.wikipedia.org/wiki/ISO_8601#Durations ISO8601 calendar system} (e.g. 'PT5H4M3.210S'), also see {@link https://js-joda.github.io/js-joda/class/packages/core/src/Duration.js~Duration.html#static-method-parse JS-Joda : Duration}
 *     - RFC (output from a Java ZonedDateTime.toString()): parsed to time.ZonedDateTime
 *     - HH:mm[:ss] (i.e. 24 hour time): that time with today's date (seconds are optional)
 *     - KK:mm[:ss][ ][aa] (i.e. 12 hour time): that time with today's date (seconds and space between time and am/pm are optional)
 * @memberof time
 * @param {*} [when] any of the types discussed above
 * @returns {time.ZonedDateTime}
 * @throws error if the type, format, or contents of when are not supported
 */
function toZDT (when) {
  // If when is not supplied or null, return now
  if (when === undefined || when === null) {
    log.debug('toZDT: Returning ZonedDateTime.now()');
    return time.ZonedDateTime.now();
  }

  // Pass through if already a time.ZonedDateTime
  if (_isZonedDateTime(when)) {
    log.debug('toZDT: Passing trough ' + when);
    return when;
  }
  // Convert Java ZonedDateTime
  if (when instanceof javaZDT) {
    log.debug('toZDT: Converting Java ZonedDateTime ' + when.toString());
    return javaZDTToJsZDT(when);
  }

  // String or StringType
  if (typeof when === 'string' || when instanceof javaString || when instanceof StringType) {
    log.debug('toZDT: Parsing string ' + when);
    return _parseString(when.toString());
  }

  // JavaScript Native Date, use the configured timezone
  if (when instanceof Date) {
    log.debug('toZDT: Converting JS native Date ' + when);
    const native = time.nativeJs(when);
    const instant = time.Instant.from(native);
    return time.ZonedDateTime.ofInstant(instant, time.ZoneId.systemDefault());
  }

  // Duration, add to now
  if (_isDuration(when) || when instanceof javaDuration) {
    log.debug('toZDT: Adding duration ' + when + ' to now');
    return time.ZonedDateTime.now().plus(time.Duration.parse(when.toString()));
  }

  // Add JavaScript's number or JavaScript BigInt or Java Number or Java DecimalType as milliseconds to now
  if (typeof when === 'number' || typeof when === 'bigint') {
    log.debug('toZDT: Adding milliseconds ' + when + ' to now');
    return _addMillis(time.ZonedDateTime.now(), when);
  } else if (when instanceof javaNumber || when instanceof DecimalType) {
    log.debug('toZDT: Adding Java number or DecimalType ' + when.floatValue() + ' to now');
    return _addMillis(time.ZonedDateTime.now(), when.floatValue());
  }

  // DateTimeType, extract the javaInstant and convert to time.ZDT, use the configured timezone
  if (when instanceof DateTimeType) {
    log.debug('toZDT: Converting DateTimeType ' + when);
    return javaInstantToJsInstant(when.getInstant()).atZone(time.ZoneId.systemDefault());
  }

  // Add Quantity or QuantityType<Time> to now
  if (_isQuantity(when)) {
    log.debug('toZDT: Adding Quantity ' + when + ' to now');
    return _addQuantityType(time.ZonedDateTime.now(), when.rawQtyType);
  } else if (when instanceof QuantityType) {
    log.debug('toZDT: Adding QuantityType ' + when + ' to now');
    return _addQuantityType(time.ZonedDateTime.now(), when);
  }

  // Convert items.Item or raw Item
  if (_isItem(when)) {
    log.debug('toZDT: Converting Item ' + when);
    if (when.isUninitialized) {
      throw Error('Item ' + when.name + ' is NULL or UNDEF, cannot convert to a time.ZonedDateTime');
    }
    return _convertItemRawStateToZonedDateTime(when.rawState);
  } else if (when instanceof ohItem) {
    log.debug('toZDT: Converting raw Item ' + when);
    return _convertItemRawStateToZonedDateTime(when.getState());
  }

  // Unsupported
  throw Error('"' + when + '" is an unsupported type for conversion to time.ZonedDateTime');
}

/**
 * Moves the date portion of the date time to today, accounting for DST
 *
 * @returns {time.ZonedDateTime} a new {@link time.ZonedDateTime} with today's date
 */
time.ZonedDateTime.prototype.toToday = function () {
  const now = time.ZonedDateTime.now();
  return this.withYear(now.year())
    .withMonth(now.month())
    .withDayOfMonth(now.dayOfMonth());
};

/**
 * Converts the passed in when to a time.Instant based on the following
 * set of rules.
 *
 * - null, undefined: time.Instant.now()
 * - time.Instant: unmodified
 * - time.ZonedDateTime: converted to the time.Instant equivalent
 * - Java Instant, DateTimeType: converted to time.Instant equivalent
 * - JavaScript native {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date Date}: converted to a `time.Instant`
 * - Item: converts the state of the Item based on the *Type rules described here
 * - String, Java String, StringType: parsed
 * @memberof time
 * @param {*} [when] any of the types discussed above
 * @returns {time.Instant}
 * @throws error if the type, format, or contents of when are not supported
 */
function toInstant (when) {
  // If when is not supplied or null, return now
  if (when === undefined || when === null) {
    log.debug('toInstant: Returning Instant.now()');
    return time.Instant.now();
  }

  // Pass through if already a time.Instant
  if (_isInstant(when)) {
    log.debug('toInstant: Passing trough ' + when);
    return when;
  }

  // Convert time.ZonedDateTime
  if (_isZonedDateTime(when)) {
    log.debug('toInstant: Converting time.ZonedDateTime ' + when.toString());
    return when.toInstant();
  }

  // Convert Java Instant
  if (when instanceof javaInstant) {
    log.debug('toInstant: Converting Java Instant ' + when.toString());
    return javaInstantToJsInstant(when);
  }

  // String or StringType
  if (typeof when === 'string' || when instanceof javaString || when instanceof StringType) {
    log.debug('toInstant: Parsing string ' + when);
    return time.Instant.parse(when.toString());
  }

  // JavaScript Native Date
  if (when instanceof Date) {
    log.debug('toInstant: Converting JS native Date ' + when);
    const native = time.nativeJs(when);
    return time.Instant.from(native);
  }

  // DateTimeType, extract the javaInstant and convert to time.Instant
  if (when instanceof DateTimeType) {
    log.debug('toInstant: Converting DateTimeType ' + when);
    return javaInstantToJsInstant(when.getInstant());
  }

  // Convert items.Item or raw Item
  if (_isItem(when)) {
    log.debug('toInstant: Converting Item ' + when);
    if (when.isUninitialized) {
      throw Error('Item ' + when.name + ' is NULL or UNDEF, cannot convert to a time.Instant');
    }
    return _convertItemRawStateToInstant(when.rawState);
  } else if (when instanceof ohItem) {
    log.debug('toInstant: Converting raw Item ' + when);
    return _convertItemRawStateToInstant(when.getState());
  }

  // Unsupported
  throw Error('"' + when + '" is an unsupported type for conversion to time.Instant');
}

/**
 * Tests whether `this` time.ZonedDateTime is before the passed in timestamp.
 * However, the function only compares the time portion of both, ignoring the date portion.
 *
 * @param {*} timestamp Time for comparison, anything supported by {@link time.toZDT}
 * @returns {boolean} true if `this` is before timestamp
 */
time.ZonedDateTime.prototype.isBeforeTime = function (timestamp) {
  const comparisonTime = toZDT(timestamp).toLocalTime();
  const currTime = this.toLocalTime();
  return currTime.isBefore(comparisonTime);
};

/**
 * Tests whether `this` time.ZonedDateTime is after the passed in timestamp.
 * However, the function only compares the time portion of both, ignoring the date portion.
 *
 * @param {*} timestamp Time for comparison, anything supported by {@link time.toZDT}
 * @returns {boolean} true if `this` is after timestamp
 */
time.ZonedDateTime.prototype.isAfterTime = function (timestamp) {
  const comparisonTime = toZDT(timestamp).toLocalTime();
  const currTime = this.toLocalTime();
  return currTime.isAfter(comparisonTime);
};

/**
 * Tests whether `this` time.ZonedDateTime is between the passed in start and end.
 * However, the function only compares the time portion of the three, ignoring the date portion.
 * The function takes into account times that span midnight.
 *
 * @param {*} start starting time, anything supported by {@link time.toZDT}
 * @param {*} end ending time, anything supported by {@link time.toZDT}
 * @returns {boolean} true if `this` is between start and end
 */
time.ZonedDateTime.prototype.isBetweenTimes = function (start, end) {
  const startTime = toZDT(start).toLocalTime();
  const endTime = toZDT(end).toLocalTime();
  const currTime = this.toLocalTime();

  if (endTime.isBefore(startTime)) { // Time range spans midnight
    return currTime.isAfter(startTime) || currTime.isBefore(endTime);
  } else {
    return currTime.isAfter(startTime) && currTime.isBefore(endTime);
  }
};

/**
 * Tests whether `this` time.ZonedDateTime is before the passed in timestamp.
 * However, the function only compares the date portion of both, ignoring the time portion.
 *
 * @param {*} timestamp Time for comparison, anything supported by {@link time.toZDT}
 * @returns {boolean} true if `this` is before timestamp
 */
time.ZonedDateTime.prototype.isBeforeDate = function (timestamp) {
  const comparisonDate = toZDT(timestamp).toLocalDate();
  const currDate = this.toLocalDate();
  return currDate.isBefore(comparisonDate);
};

/**
 * Tests whether `this` time.ZonedDateTime is after the passed in timestamp.
 * However, the function only compares the date portion of both, ignoring the time portion.
 *
 * @param {*} timestamp Time for comparison, anything supported by {@link time.toZDT}
 * @returns {boolean} true if `this` is after timestamp
 */
time.ZonedDateTime.prototype.isAfterDate = function (timestamp) {
  const comparisonDate = toZDT(timestamp).toLocalDate();
  const currDate = this.toLocalDate();
  return currDate.isAfter(comparisonDate);
};

/**
 * Tests whether `this` time.ZonedDateTime is between the passed in start and end.
 * However, the function only compares the date portion of the three, ignoring the time portion.
 *
 * @param {*} start starting date, anything supported by {@link time.toZDT}
 * @param {*} end ending date, anything supported by {@link time.toZDT}
 * @returns {boolean} true if `this` is between start and end
 */
time.ZonedDateTime.prototype.isBetweenDates = function (start, end) {
  const startDate = toZDT(start).toLocalDate();
  const endDate = toZDT(end).toLocalDate();
  const currDate = this.toLocalDate();

  return currDate.isAfter(startDate) && currDate.isBefore(endDate);
};

/**
 * Tests whether `this` time.ZonedDateTime is before the passed in timestamp.
 *
 * @param {*} timestamp Time for comparison, anything supported by {@link time.toZDT}
 * @returns {boolean} true if `this` is before timestamp
 */
time.ZonedDateTime.prototype.isBeforeDateTime = function (timestamp) {
  const comparisonDateTime = toZDT(timestamp).toLocalDateTime();
  const currDateTime = this.toLocalDateTime();
  return currDateTime.isBefore(comparisonDateTime);
};

/**
 * Tests whether `this` time.ZonedDateTime is after the passed in timestamp.
 *
 * @param {*} timestamp Time for comparison, anything supported by {@link time.toZDT}
 * @returns {boolean} true if `this` is after timestamp
 */
time.ZonedDateTime.prototype.isAfterDateTime = function (timestamp) {
  const comparisonDateTime = toZDT(timestamp).toLocalDateTime();
  const currDateTime = this.toLocalDateTime();
  return currDateTime.isAfter(comparisonDateTime);
};

/**
 * Tests whether `this` time.ZonedDateTime is between the passed in start and end.
 *
 * @param {*} start starting DateTime, anything supported by {@link time.toZDT}
 * @param {*} end ending DateTime, anything supported by {@link time.toZDT}
 * @returns {boolean} true if `this` is between start and end
 */
time.ZonedDateTime.prototype.isBetweenDateTimes = function (start, end) {
  const startDateTime = toZDT(start).toLocalDateTime();
  const endDateTime = toZDT(end).toLocalDateTime();
  const currDateTime = this.toLocalDateTime();

  return currDateTime.isAfter(startDateTime) && currDateTime.isBefore(endDateTime);
};

/**
 * Tests to see if the difference between this and the passed in ZoneDateTime is
 * within the passed in maxDur.
 *
 * @param {time.ZonedDateTime} zdt the date time to compare to this
 * @param {time.Duration} maxDur the duration to test that the difference between this and zdt is within
 * @returns {boolean} true if the delta between this and zdt is within maxDur
 */
time.ZonedDateTime.prototype.isClose = function (zdt, maxDur) {
  const delta = time.Duration.between(this, zdt).abs();
  return delta.compareTo(maxDur) <= 0;
};

/**
 * Parses a ZonedDateTime to milliseconds from now until the ZonedDateTime.
 *
 * @returns {number} duration from now to the ZonedDateTime in milliseconds
 */
time.ZonedDateTime.prototype.getMillisFromNow = function () {
  return time.Duration.between(time.ZonedDateTime.now(), this).toMillis();
};

/**
 * Stringifies this ZonedDateTime to a format that openHAB accepts for commands and state updates.
 * openHAB doesn't accept the zone name that is in square brackets, e.g. `[Europe/Berlin]`, so remove it here.
 * The zone information is also present in the offset, e.g. `+01:00`, so we don't need the time zone string.
 *
 * @returns {string}
 */
time.ZonedDateTime.prototype.toOpenHabString = function () {
  return this.toString().replace(/\[[^\]]*]$/, '');
};

module.exports = {
  ...time,
  javaInstantToJsInstant,
  javaZDTToJsZDT,
  toZDT,
  toInstant,
  _parseString,
  _parseISO8601
};
