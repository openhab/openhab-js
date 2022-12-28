declare const _exports: {
    toZDT: (when: any) => time.ZonedDateTime;
    parseString: (str: string) => time.ZonedDateTime;
    parseISO8601: (isoStr: any) => time.ZonedDateTime | null;
    nativeJs(date: any, zone?: time.ZoneId): time.TemporalAccessor;
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
import time = require("@js-joda/core");
//# sourceMappingURL=time.d.ts.map