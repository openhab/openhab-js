declare const _exports: {
    javaInstantToJsInstant: typeof javaInstantToJsInstant;
    javaZDTToJsZDT: typeof javaZDTToJsZDT;
    toZDT: typeof toZDT;
    _parseString: typeof _parseString;
    _parseISO8601: typeof _parseISO8601;
    nativeJs(date: any, zone?: time.ZoneId): time.ZonedDateTime;
    convert(temporal: time.LocalDate | time.Instant | time.ZonedDateTime | time.LocalDateTime, zone?: time.ZoneId): {
        toDate: () => Date;
        toEpochMilli: () => number;
    };
    use(plugin: Function): any;
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
    TemporalField: typeof time.TemporalField;
    TemporalUnit: typeof time.TemporalUnit;
    ValueRange: typeof time.ValueRange;
    TemporalAmount: typeof time.TemporalAmount;
    TemporalAccessor: typeof time.TemporalAccessor;
    Temporal: typeof time.Temporal;
    TemporalAdjuster: typeof time.TemporalAdjuster;
    TemporalQuery: typeof time.TemporalQuery;
    ChronoField: typeof time.ChronoField;
    ChronoUnit: typeof time.ChronoUnit;
    IsoFields: typeof time.IsoFields;
    TemporalAdjusters: typeof time.TemporalAdjusters;
    TemporalQueries: typeof time.TemporalQueries;
    Clock: typeof time.Clock;
    Duration: typeof time.Duration;
    Instant: typeof time.Instant;
    LocalDate: typeof time.LocalDate;
    LocalDateTime: typeof time.LocalDateTime;
    LocalTime: typeof time.LocalTime;
    MonthDay: typeof time.MonthDay;
    Period: typeof time.Period;
    Year: typeof time.Year;
    YearMonth: typeof time.YearMonth;
    OffsetDateTime: typeof time.OffsetDateTime;
    OffsetTime: typeof time.OffsetTime;
    ZonedDateTime: typeof time.ZonedDateTime;
    ZoneId: typeof time.ZoneId;
    ZoneOffset: typeof time.ZoneOffset;
    ZoneRegion: typeof time.ZoneRegion;
    DayOfWeek: typeof time.DayOfWeek;
    Month: typeof time.Month;
    DateTimeFormatter: typeof time.DateTimeFormatter;
    DateTimeFormatterBuilder: typeof time.DateTimeFormatterBuilder;
    DecimalStyle: typeof time.DecimalStyle;
    ResolverStyle: typeof time.ResolverStyle;
    SignStyle: typeof time.SignStyle;
    TextStyle: typeof time.TextStyle;
    ParsePosition: typeof time.ParsePosition;
    ZoneOffsetTransition: typeof time.ZoneOffsetTransition;
    ZoneRules: typeof time.ZoneRules;
    ZoneRulesProvider: typeof time.ZoneRulesProvider;
    IsoChronology: typeof time.IsoChronology;
    ChronoLocalDate: typeof time.ChronoLocalDate;
    ChronoLocalDateTime: typeof time.ChronoLocalDateTime;
    ChronoZonedDateTime: typeof time.ChronoZonedDateTime;
    DateTimeException: typeof time.DateTimeException;
    UnsupportedTemporalTypeException: typeof time.UnsupportedTemporalTypeException;
    DateTimeParseException: typeof time.DateTimeParseException;
    ArithmeticException: typeof time.ArithmeticException;
    IllegalArgumentException: typeof time.IllegalArgumentException;
    IllegalStateException: typeof time.IllegalStateException;
    NullPointerException: typeof time.NullPointerException;
    __esModule: true;
};
export = _exports;
/**
 * Convert Java Instant to JS-Joda Instant.
 *
 * @memberOf time
 * @param {JavaInstant} instant {@link https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/time/Instant.html java.time.Instant}
 * @returns {time.Instant} {@link https://js-joda.github.io/js-joda/class/packages/core/src/Instant.js~Instant.html JS-Joda Instant}
 */
declare function javaInstantToJsInstant(instant: JavaInstant): time.Instant;
/**
 * Convert Java ZonedDateTime to JS-Joda ZonedDateTime.
 *
 * @memberOf time
 * @param {JavaZonedDateTime} zdt {@link https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/time/ZonedDateTime.html java.time.ZonedDateTime}
 * @returns {time.ZonedDateTime} {@link https://js-joda.github.io/js-joda/class/packages/core/src/ZonedDateTime.js~ZonedDateTime.html JS-Joda ZonedDateTime}
 */
declare function javaZDTToJsZDT(zdt: JavaZonedDateTime): time.ZonedDateTime;
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
declare function toZDT(when?: any): time.ZonedDateTime;
/**
 * Parses the passed in string based on it's format and converts it to a ZonedDateTime.
 * If no timezone is specified, the configured timezone is used.
 * @private
 * @param {string} str string to parse and convert
 * @returns {time.ZonedDateTime}
 * @throws Error when the string cannot be parsed
 */
declare function _parseString(str: string): time.ZonedDateTime;
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
declare function _parseISO8601(isoStr: any): time.ZonedDateTime | null;
import time = require("@js-joda/core");
//# sourceMappingURL=time.d.ts.map