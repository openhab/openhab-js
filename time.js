/**
 * Time namespace.
 * This namespace exports the {@link https://js-joda.github.io/js-joda/ JS-Joda library}, but also provides additional functionality.
 *
 * @namespace time
 */

require('@js-joda/timezone');
const time = require('@js-joda/core');
const items = require('./items');
const utils = require('./utils');
const { _isItem } = require('./helpers');

const javaZDT = Java.type('java.time.ZonedDateTime');
const javaDuration = Java.type('java.time.Duration');
const javaString = Java.type('java.lang.String');
const javaNumber = Java.type('java.lang.Number');
const { DateTimeType, DecimalType, StringType, QuantityType } = require('@runtime');
const { Quantity } = require('./quantity');
const ohItem = Java.type('org.openhab.core.items.Item');

/**
 * Adds millis to the passed in ZDT as milliseconds. The millis is rounded first.
 * If millis is negative they will be subtracted.
 * @private
 * @param {number|bigint} millis number of milliseconds to add
 */
function _addMillisToNow (millis) {
  return time.ZonedDateTime.now().plus(Math.round(millis), time.ChronoUnit.MILLIS);
}

/**
 * Adds the passed in QuantityType<Time> to now.
 * @private
 * @param {QuantityType} quantityType an Item's QuantityType
 * @returns now plus the time length in the quantityType
 * @throws error when the units for the quantity type are not one of the Time units
 */
function _addQuantityType (quantityType) {
  const secs = quantityType.toUnit('s');
  if (secs) {
    return time.ZonedDateTime.now().plusSeconds(secs.doubleValue());
  } else {
    throw Error('Only Time units are supported to convert QuantityTypes to a ZonedDateTime: ' + quantityType.toString());
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
    ISO_8160_FULL: /^(-?(?:[1-9][0-9]*)?[0-9]{4})-(1[0-2]|0[1-9])-(3[01]|0[1-9]|[12][0-9])T(2[0-3]|[01][0-9]):([0-5][0-9])(:[0-5][0-9])?(\.\d+)?(Z|[+-]\d{2}(:\d{2})?)/
  };
  switch (true) {
    case REGEX.LOCAL_DATE.test(isoStr): return time.ZonedDateTime.of(time.LocalDate.parse(isoStr), time.LocalTime.MIDNIGHT, time.ZoneId.SYSTEM);
    case REGEX.LOCAL_TIME.test(isoStr): return time.ZonedDateTime.of(time.LocalDate.now(), time.LocalTime.parse(isoStr), time.ZoneId.SYSTEM);
    case REGEX.LOCAL_DATE_TIME.test(isoStr): return time.ZonedDateTime.of(time.LocalDateTime.parse(isoStr), time.ZoneId.SYSTEM);
    case REGEX.ISO_8160_FULL.test(isoStr): return time.ZonedDateTime.parse(isoStr);
  }
  return null;
}

/**
 * Parses the passed in string based on it's format and converts it to a ZonedDateTime.
 * If no timezone is specified, `SYSTEM` is used.
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
 * @param {items.Item} item
 * @returns {time.ZonedDateTime}
 * @throws error if the Item's state is not supported or the Item itself is not supported
 */
function _convertItem (item) {
  if (item.isUninitialized) {
    throw Error('Item ' + item.name + ' is NULL or UNDEF, cannot convert to a time.ZonedDateTime');
  } else if (item.rawState instanceof DecimalType) { // Number type Items
    return _addMillisToNow(item.rawState.floatValue());
  } else if (item.rawState instanceof StringType) { // String type Items
    return _parseString(item.state);
  } else if (item.rawState instanceof DateTimeType) { // DateTime Items
    return utils.javaZDTToJsZDT(item.rawState.getZonedDateTime());
  } else if (item.rawState instanceof QuantityType) { // Number:Time type Items
    return _addQuantityType(item.rawState);
  } else {
    throw Error(item.type + ' is not supported for conversion to time.ZonedDateTime');
  }
}

/**
 * Converts the passed in when to a time.ZonedDateTime based on the following
 * set of rules.
 *
 * - null, undefined: time.ZonedDateTime.now()
 * - time.ZonedDateTime: unmodified
 * - Java ZonedDateTime, DateTimeType: converted to time.ZonedDateTime equivalent
 * - JavaScript native {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date Date}: converted to a `time.ZonedDateTime` using system timezone
 * - number, bigint, Java Number, DecimalType: rounded and added to `time.ZonedDateTime.now()` as milliseconds
 * - {@link Quantity} & QuantityType: if the unit is time-compatible, added to `time.ZonedDateTime.now()`
 * - Item: converts the state of the Item based on the *Type rules described here
 * - String, Java String, StringType: parsed based on the following rules; if no timezone is specified system timezone is used
 *     - ISO 8601 DateTime: any Date, Time or DateTime with optional time offset and/or time zone in the {@link https://en.wikipedia.org/wiki/ISO_8601 ISO8601 calendar system}
 *     - ISO 8601 Duration: any Duration in the {@link https://en.wikipedia.org/wiki/ISO_8601#Durations ISO8601 calendar system} (e.g. 'PT5H4M3.210S'), also see {@link https://js-joda.github.io/js-joda/class/packages/core/src/Duration.js~Duration.html#static-method-parse JS-Joda : Duration}
 *     - RFC (output from a Java ZonedDateTime.toString()): parsed to time.ZonedDateTime
 *     - HH:mm[:ss] (i.e. 24 hour time): that time with today's date (seconds are optional)
 *     - KK:mm[:ss][ ][aa] (i.e. 12 hour time): that time with today's date (seconds and space between time and am/pm are optional)
 * @memberof time
 * @param {*} when any of the types discussed above
 * @returns {time.ZonedDateTime}
 * @throws error if the type, format, or contents of when are not supported
 */
function toZDT (when) {
  // If when is not supplied or null, return now
  if (when === undefined || when === null) {
    return time.ZonedDateTime.now();
  }

  // Pass through if already a time.ZonedDateTime
  if (when instanceof time.ZonedDateTime) {
    return when;
  }

  // String or StringType
  if (typeof when === 'string' || when instanceof javaString || when instanceof StringType) {
    return _parseString(when.toString());
  }

  // JavaScript Native Date, use the SYSTEM timezone
  if (when instanceof Date) {
    const native = time.nativeJs(when);
    const instant = time.Instant.from(native);
    return time.ZonedDateTime.ofInstant(instant, time.ZoneId.SYSTEM);
  }

  // Duration, add to now
  if (when instanceof time.Duration || when instanceof javaDuration) {
    return time.ZonedDateTime.now().plus(time.Duration.parse(when.toString()));
  }

  // JavaScript number of bigint, add as millisecs to now
  if (typeof when === 'number' || typeof when === 'bigint' || !isNaN(when)) {
    return _addMillisToNow(when);
  }

  // Java ZDT
  if (when instanceof javaZDT) {
    return utils.javaZDTToJsZDT(when);
  }

  // DateTimeType, extract the javaZDT and convert to time.ZDT
  if (when instanceof DateTimeType) {
    return utils.javaZDTToJsZDT(when.getZonedDateTime());
  }

  // Quantity
  if (when instanceof Quantity) {
    return _addQuantityType(when.raw);
  }

  // QuantityType<Time>, add to now
  if (when instanceof QuantityType) {
    return _addQuantityType(when);
  }

  // Java Number of DecimalType, add as millisecs to now
  if (when instanceof javaNumber || when instanceof DecimalType) {
    return _addMillisToNow(when.floatValue());
  }

  // GenericItem
  if (when instanceof ohItem) {
    return _convertItem(items.getItem(when.getName()));
  }

  // items.Item
  if (_isItem(when)) {
    return _convertItem(when);
  }

  // Unsupported
  throw Error('"' + when + '" is an unsupported type for conversion to time.ZonedDateTime');
}

// openHAB uses an RFC DateTime string, js-joda defaults to the ISO version, this defaults RFC instead
const rfcFormatter = time.DateTimeFormatter.ofPattern("uuuu-MM-dd'T'HH:mm:ss.SSS[xxxx][xxxxx]");
const targetParse = time.ZonedDateTime.prototype.parse;
time.ZonedDateTime.prototype.parse = function (text, formatter = rfcFormatter) {
  return targetParse(text, formatter);
};

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
  toZDT,
  parseString: _parseString,
  parseISO8601: _parseISO8601
};
