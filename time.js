/**
 * Time namespace.
 * This namespace exports the {@link https://js-joda.github.io/js-joda/ JS-Joda library}, but also provides additional functionality.
 *
 * @namespace time
 */

 require('@js-joda/timezone');
 const time = require('@js-joda/core');
 
 const javaZDT = Java.type('java.time.ZonedDateTime');
 const javaDuration = Java.type('java.time.Duration');
 const javaString = Java.type('java.lang.String');
 const javaNumber = Java.type('java.lang.Number');
 const { DateTimeType, DecimalType, StringType, QuantityType } = require('@runtime');
 const ohItem = Java.type('org.openhab.core.items.Item');
 
 /**
  * Converts the Java ZonedDateTime to a time.ZonedDateTime
  * @param {java.time.ZonedDateTime} zdt date time to convert to a time.ZonedDateTime
  * @returns {time.ZonedDateTime}
  */
 const javaZDTtoZDT = function(zdt) {
     const epoch = zdt.toInstant().toEpochMilli();
     const instant = time.Instant.ofEpochMilli(epoch);
     const zone = time.ZoneId.of(zdt.getZone().toString());
     return time.ZonedDateTime.ofInstant(instant, zone);
 }
 
 /**
  * Adds millis to the passed in ZDT as milliseconds. The millis is rounded 
  * first. If millis is negative they will be subtracted.
  * @param {number|bigint} millis number of milliseconds to add
  */
 const addMillisToNow = function(millis) {
     return time.ZonedDateTime.now().plus(Math.round(millis), time.ChronoUnit.MILLIS);
 }
 
 /**
  * Adds the passed in QuantityType<Time> to now.
  * @param {QuantityType} quantityType an Item's QuantityType
  * @returns now plus the time length in the quantityType
  * @throws error when the units for the quantity type are not one of the Time units
  */
 const addQuantityType = function(quantityType) {
     const secs = quantityType.toUnit('s');
     if(secs) {
         return time.ZonedDateTime.now().plusSeconds(secs.doubleValue());
     } else {
         throw Error('Only Time units are supported to convert QuantityTypes to a ZonedDateTime: ' + quantityType.toString());
     }
 }
 
 /**
  * Tests the passed in string to see if it conforms to the ISO8601 standard
  * @param {String} dtStr potential ISO8601 string
  * @returns {boolean} true if ISO8601 format
  */
 const isISO8601 = (dtStr) => {
   var regex = new RegExp(/^(-?(?:[1-9][0-9]*)?[0-9]{4})-(1[0-2]|0[1-9])-(3[01]|0[1-9]|[12][0-9])T(2[0-3]|[01][0-9]):([0-5][0-9]):([0-5][0-9])(\.[0-9]+)?(Z|[+-](?:2[0-3]|[01][0-9]):[0-5][0-9])?$/);
   return regex.test(dtStr);    
 }
 
 /**
  * Tests the string to see if it matches a 24 hour clock time
  * @param {String} dtStr potential HH:MM String
  * @returns {boolean} true if it matches HH:MM
  */
  const is24Hr = function (dtStr) {
     var regex = new RegExp(/^(0?[0-9]|1[0-9]|2[0-3])(:[0-5][0-9]){1,2}$/);
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
  * Parses the passed in string based on it's format and converted to a ZonedDateTime.
  * @param {String} str string number to try and parse and convert
  * @throws Error when the string cannot be parsed
  */
 const parseString = function(str) {
 
     // Number
     if(!isNaN(str)) {
         return addMillisToNow(str);
     }
 
     // ISO8601
     else if(isISO8601(str)) {
         throw Error('ISO 8601 strings are not yet supported');
     }
 
     // 24 hour time string
     else if(is24Hr(str)) {
         const parts = str.split(':');
         return time.ZonedDateTime.now().withHour(parts[0])
                                        .withMinute(parts[1])
                                        .withSecond(parts[2] || 0)
                                        .withNano(0);
     }
 
     // 12 hour time string
     else if(is12Hr(str)) {
         const parts = str.split(':');
         let hr = parseInt(parts[0]);
         hr = (str.contains('p') || str.contains('P')) ? hr + 12 : hr;
         return time.ZonedDateTime.now().withHour(hr) 
                                        .withMinute(parseInt(parts[1])) // parseInt will ignore the am/pm
                                        .withSecond(parseInt(parts[2]) || 0)
                                        .withNano(0);
     }
 
     else {
 
         // Java ZonedDateTime's toString format (see monkey patched parse function)
         try {
             return time.ZonedDateTime.parse(str);
         }
 
         // Duration string
         catch(e) {
             try {
                 return time.ZonedDateTime.now().plus(time.Duration.parse(str));
             }
 
             // Unsupported
             catch(e) {
                 throw Error('"' + str + '" cannot be parsed into a format that can be converted to a ZonedDateTime');
             }
         }
     }
 
 }
 
 /**
  * Converts the state of the passed in Item to a time.ZonedDateTime
  * @param {items.Item} item 
  * @returns {time.ZonedDateTime}
  * @throws error if the Item's state is not supported or the Item itself is not supported
  */
 const convertItem = function(item) {
 
 
     // Uninitialized
     if(item.isUninitialized) {
         throw Error('Item ' + item.name + ' is NULL or UNDEF, cannot convert to a time.ZonedDateTime');
     }
 
     // Number type Items
     else if(item.rawState instanceof DecimalType) {
         return addMillisToNow(item.rawState.floatValue());
     }
 
     // String type Items
     else if(item.rawState instanceof StringType) {
         return parseString(item.state);
     }
 
     // DateTime Items
     else if(item.rawState instanceof DateTimeType) {
         return javaZDTtoZDT(item.rawState.getZonedDateTime());
     }
 
     // Number:Time type Items
     else if(item.rawState instanceof QuantityType) {
         return addQuantityType(item.rawState);
     }
 
     else {
         throw Error(item.type + ' is not supported for conversion to time.ZonedDateTime');
     }
 }
 
 /**
  * Converts the passed in when to a time.ZonedDateTime based on the following 
  * set of rules.
  * 
  * - null, undefined: time.ZonedDateTime.now()
  * - time.ZonedDateTime: unmodified
  * - Java ZonedDateTime, DateTimeType: converted to time.ZonedDateTime equivalnet
  * - JavaScript native Date: converted to a time.ZonedDateTime using SYSTEM as the timezone
  * - number, bigint, Java Number, DecimalType: rounded and added to time.ZonedDateTime.now() as milliseconds
  * - QuantityType: if the units are Time, added to now
  * - Item: converts the state of the Item based on the *Type rules described here
  * - String, Java String, StringType: Parsed based on the following rules
  *     - ISO 8601: Not yet implemented
  *     - RFC (output from a Java ZonedDateTime.toString()): parsed to time.ZonedDateTime
  *     - HH:mm[:ss] (i.e. 24 hour time): that time with today's date (seconds are optional)
  *     - KK:mm[:ss][ ][aa] (i.e. 12 hour time): that time with today's date (seconds and space between time and am/pm are optional)
  *     - Duration: any duration string supported by time.Duration (e.g. 'PT5H4M3.210S'), see https://js-joda.github.io/js-joda/class/packages/core/src/Duration.js~Duration.html#static-method-parse
  * @param {*} when any of the types discussed above
  * @returns time.ZonedDateTime
  * @throws error if the type, format, or contents of when are not supported
  */
 time.toZDT = function(when) {
 
     // If when is not supplied or null, return now
     if(when === undefined || when === null) {
         return time.ZonedDateTime.now();
     }
 
     // Pass through if already a time.ZonedDateTime
     else if(when instanceof time.ZonedDateTime) {
         return when;
     }
 
     // Java ZDT
     else if(when instanceof javaZDT) {
         return javaZDTtoZDT(when);
     }
 
     // DateTimeType, extract the javaZDT and convert to time.ZDT
     else if(when instanceof DateTimeType) {
         return javaZDTtoZDT(when.getZonedDateTime());
     }
 
     // JavaScript Native Date, use the SYSTEM timezone
     else if(when instanceof Date) {
         const native = time.nativeJs(when);
         const instant = time.Instant.from(native);
         return time.ZonedDateTime.ofInstant(instant, time.ZoneId.SYSTEM);
     }
 
     // Duration, add to now
     else if(when instanceof time.Duration || when instanceof javaDuration) {
         return time.ZonedDateTime.now().plus(time.Duration.parse(when.toString()));
     }
 
     // JavaScript number of bigint, add as millisecs to now
     else if(typeof when === 'number' || typeof when === 'bigint') {
         return addMillisToNow(when);
     }
 
     // QuantityType<Time>, add to now
     else if(when instanceof QuantityType) {
         return addQuantityType(when);
     }
 
     // Java Number of DecimalType, add as millisecs to now
     else if(when instanceof javaNumber || when instanceof DecimalType) {
         return addMillisToNow(when.floatValue());
     }
 
     // String or StringType
     else if(typeof when === 'string' || when instanceof javaString || when instanceof StringType) {
         return parseString(when.toString());
     }
 
     // GenericItem
     else if(when instanceof ohItem) {
         return convertItem(items.getItem(when.name));
     }
 
     // items.Item
     else if(when.constructor.name === 'Item') {
         return convertItem(when);
     }
 
     // Unsupported
     throw Error('"' + when + '" is an unsupported type for conversion to time.ZonedDateTime');
 
 }
 
 //openHAB uses a RFC DateTime string, js-joda defaults to the ISO version, this defaults RFC instead
 const rfcFormatter = time.DateTimeFormatter.ofPattern("uuuu-MM-dd'T'HH:mm:ss.SSS[xxxx][xxxxx]");
 const targetParse = time.ZonedDateTime.prototype.parse;
 time.ZonedDateTime.prototype.parse = function (text, formatter = rfcFormatter) {
     return targetParse(text, formatter);
 }
 
 /**
  * Moves the date portion of the date time to today, accounting for DST
  */
  time.ZonedDateTime.prototype.toToday = function () {
     let now = time.ZonedDateTime.now();
     return this.withYear(now.year())
                .withMonth(now.month())
                .withDayOfMonth(now.dayOfMonth());
 }
 
 /**
  * Compares this ZDT to see if it falls between start and end times,
  * accounting for times that span midnight. start and end can be any type
  * that has a `toZonedDateTime()` method.
  * time.toZDT is called on the arguments. Examples:
  * 
  * time.ZonedDateTime.now().betweenTimes(items.getItem('Sunset'), "23:30:00") // is now between sunset and 11:00 pm?
  * time.toZDT(items.geItem('MyDateTimeItem')).betweenTimes(time.toZDT(), time.toZDT(1000)) // is the state of MyDateTimeItem between now and a second from now?
  * 
  * @param {*} start the starting time in anything that can be 
  * @param {*} end the ending time
  * @returns {Boolean} true if this is between start and end
  */
  time.ZonedDateTime.prototype.betweenTimes = function(start, end) {
     start = time.toZDT(start).toLocalTime();
     end = time.toZDT(end).toLocalTime();
     time = this.toLocalTime();
 
     // time range spans midnight
     if(end.isBefore(start)) {
         return (time.isAfter(start) && time.isBefore(time.LocalTime.MIDNIGHT)) 
                || (time.isAfter(time.LocalTime.MIDNIGHT) && time.isBefore(end));
     }
     else {
         return time.isAfter(start) && time.isBefore(end);
     }
     
 }
 
 /**
  * Tests to see if the difference betwee this and the passed in ZoneDateTime is
  * within the passed in maxDur.
  * @param {time.ZonedDateTime} zdt the date tiem to compare to this
  * @param {time.Duration} maxDur the duration to test that the difference between this and zdt is within
  * @returns {Boolean} true if the delta between this and zdt is within maxDur
  */
 time.ZonedDateTime.prototype.isClose = function(zdt, maxDur) {
     const delta = time.Duration.between(this, zdt).abs();
     return delta.compareTo(maxDur) <= 0;
 }
 
 module.exports = time;
