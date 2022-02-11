require('@js-joda/timezone');
const time = require('@js-joda/core');

//openHAB uses a RFC DateTime string, js-joda defaults to the ISO version, this defaults RFC instead
const rfcFormatter = time.DateTimeFormatter.ofPattern("uuuu-MM-dd'T'HH:mm:ss.SSS[xxxx][xxxxx]");
const targetParse = time.ZonedDateTime.prototype.parse;

/**
 * When formatter is not supplied, uses an RFC DateTimeFormatter that can parse the format
 * of java.time.ZonedDateTime.toString()
 * @param {String} text 
 * @param {time.DateTimeFormatter} formatter 
 * @returns {time.ZonedDateTime}
 * @throws {DateTimeParseException} when the text cannot be parsed
 */
time.ZonedDateTime.prototype.parse = function (text, formatter = rfcFormatter) {
    return targetParse(text, formatter);
}

/**
 * A passthrough function that can allow users to call `toZonedDateTime` on
 * almost anything that can be converted to a time.ZonedDateTime without first
 * checking to see if it's already a time.ZonedDateTime. 
 * @returns {time.ZonedDateTime} this
 */
time.ZonedDateTime.prototype.toZonedDateTime = function () {
    return this;
}

/**
 * Change the date of the passed in dt to match the date. This preserves
 * the hours and minutes even in cases where dt and date span a DST changeover.
 * @param {time.ZonedDateTime} dt date time to move the date on
 * @param {time.ZonedDateTime} date date time to move dt's date to
 * @returns {time.ZonedDateTime} dt with date's date
 */
const changeDate = function (dt, date) {
    return dt.withYear(date.year())
             .withMonth(date.month())
             .withDayOfMonth(date.dayOfMonth());
}

/**
 * Moves the date portion of the date time to today, accounting for DST
 * @returns {time.ZonedDateTime} this ZDT with today's date
 */
time.ZonedDateTime.prototype.toToday = function () {
    return changeDate(this, time.ZonedDateTime.now());
}

/**
 * Moves the date portion of the date time to tomorrow, accounting for DST
 * @returns {time.ZonedDateTime} this ZDT with tomorrow's date
 */
time.ZonedDateTime.prototype.toTomorrow = function () {
    return changeDate(this, time.ZonedDateTime.now().plusDays(1));
}

/**
 * Moves the date portion of the date time to yesterday, accounting for DST
 * @returns {time.ZonedDateTime} this ZDT with yesterday's date
 */
time.ZonedDateTime.prototype.toYesterday = function () {
    return changeDate(this, time.ZonedDateTime.now().minusDays(1));
}

/**
 * Compares this ZDT to see if it falls between start and end times,
 * accounting for times that span midnight. start and end can be any type
 * that has a `toZonedDateTime()` method but only the time portion is used.
 * @param {*} start the starting time, anything that has a toZonedDateTime method
 * @param {*} end the ending time, anything that has a toZonedDateTime method
 * @returns {Boolean} true if this is between start and end
 */
time.ZonedDateTime.prototype.betweenTimes = function(start, end) {
    start = start.toZonedDateTime();
    end = end.toZonedDateTime();
    if(end.isBefore(start)) {
        if(this.isAfter(start)) {
            end = end.toTomorrow();
        }
        else if(this.isBefore(start)) {
            start = start.toYesterday();
        }
    }
    return this.isAfter(start) && this.isBefore(end);
}

/**
 * Adds this Duration to now, returning it as a ZonedDateTime
 * @returns {time.ZonedDateTime} 
 */
 time.Duration.prototype.toZonedDateTime = function () {
    return time.ZonedDateTime.now().plus(this);
}

/**
 * @returns {time.ZonedDateTime} value of the number rounded to the nearest int added to now as milliseconds
 */
Number.prototype.toZonedDateTime = function() {
    const millis = (Number.isInteger(this)) ? this : Math.round(this);
    return time.ZonedDateTime.now().plus(this, time.ChronoUnit.MILLIS);
}

/**
 * Tests the string to see if it matches a 24 hour clock time
 * @param {String} dtStr potential HH:MM String
 * @returns {boolean} true if it matches HH:MM
 */
 const is24Hr = function (dtStr) {
    var regex = new RegExp(/^(0[0-9]|1[0-9]|2[0-3])(:[0-5][0-9]){1,2}$/);
    return regex.test(dtStr);
}
  
/**
 * Tests the string to see if it matches a 12 hour clock time
 * @param {String} dtStr potential hh:MM aa string
 * @returns {boolean} true if it matches hh:mm aa 
 */
const is12Hr = function (dtStr) {
    var regex = new RegExp(/^(0?[0-9]|1[0-2])(:[0-5][0-9]){1,2} ?[a|p|A|P]\.?[m|M]\.?$/);
    return regex.test(dtStr);
}

/**
 * Converts strings of various formats to a time.ZonedDateTime
 * - java.time.ZonedDateTime.toString() format-
 * - HH:MM:SS: 24 hour time converted to ZonedDateTime with that time and today's date
 * - hh:mm:ss aa:  12 hour time converted to a ZonedDateTime with that time and today's date
 * - duration string: see the docs for js-joda Duration, will add that duration to now
 * - Number string: parsed to a Number and added to now as milliseconds 
 * @returns {time.ZonedDateTime}
 * @throws error is thrown when the String is not of a recognized format that can be converted to a date time
 */
String.prototype.toZonedDateTime = function () {
  if(!isNaN(this)) {
      return Number(this).toZonedDateTime();
  }
  else if(is24Hr(this)) {
      const parts = this.split(':');
      return time.ZonedDateTime.now().withHour(parts[0])
                                     .withMinute(parts[1])
                                     .withSecond(parts[2] || 0)
                                     .withNano(0);
  }
  else if(is12Hr(this)) {
      const parts = this.split(':');
      let hr = parseInt(parts[0]);
      hr = (this.includes('p') || this.includes('P'))? hr + 12 : hr;
      return time.ZonedDateTime.now().withHour(hr)
                                       .withMinute(parseInt(parts[1]))
                                       .withSecond((parts[2]) ? parseInt(parts[2]) : 0)
                                       .withNano(0);
  }
  else {
      // See if it's a Java ZonedDateTime.toString()
      try {
          return time.ZonedDateTime.parse(this);
      }
      catch (e) {
          // Assume it's a duration string
          const rval = time.Duration.parse(this).toZonedDateTime();
          if(!rval) throw Error('Cannot parse ' + this + ' into a date time');
          return rval;
      }
  }
}

module.exports = time;