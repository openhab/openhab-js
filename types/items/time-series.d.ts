export = TimeSeries;
/**
 * @typedef { import('@js-joda/core').Instant} time.Instant
 * @private
 */
/**
 * @typedef { import('@js-joda/core').ZonedDateTime} time.ZonedDateTime
 * @private
 */
/**
 * A TimeSeries is used to transport a set of states together with their timestamp.
 * It is usually used for persisting historic state or forecasts in a persistence service.
 *
 * @memberof items
 */
declare class TimeSeries {
    /**
     * Creates a new TimeSeries.
     *
     * The TimeSeries policy defines how the TimeSeries is persisted in a persistence service:
     * <code>ADD</code> adds the content to the persistence,
     * <code>REPLACE</code> first removes all persisted elements in the timespan given by {@link begin} and {@link end}.
     *
     * @param {string} policy TimeSeries policy <code>ADD</code> or <code>REPLACE</code>
     */
    constructor(policy: string);
    /**
     * The persistence policy of this TimeSeries
     *
     * @type {string}
     */
    get policy(): string;
    /**
     * Timestamp of the first element in the TimeSeries
     * @type {time.Instant}
     */
    get begin(): JSJoda.Instant;
    /**
     * Timestamp of the last element in the TimeSeries
     * @type {time.Instant}
     */
    get end(): JSJoda.Instant;
    /**
     * Number of elements in the TimeSeries
     * @type {number}
     */
    get size(): number;
    /**
     * States of the TimeSeries together with their timestamp and sorted by their timestamps
     *
     * Be aware that this method returns a reference to the internal state array, so changes to the array will affect the TimeSeries.
     *
     * @type {Array}
     */
    get states(): any[];
    /**
     * Add a new element to the TimeSeries.
     *
     * Elements can be added in an arbitrary order and are sorted chronologically.
     *
     * @param {(time.Instant|time.ZonedDateTime|string|Date)} timestamp a timestamp for the given state
     * @param {string|number|import('../quantity').Quantity|HostState} state the state at the given timestamp
     * @returns {TimeSeries} this TimeSeries instance
     */
    add(timestamp: (time.Instant | time.ZonedDateTime | string | Date), state: string | number | import('../quantity').Quantity | HostState): TimeSeries;
    toString(): string;
    #private;
}
declare namespace time {
    type Instant = import('@js-joda/core').Instant;
    type ZonedDateTime = import('@js-joda/core').ZonedDateTime;
}
import time = require("../time");
//# sourceMappingURL=time-series.d.ts.map