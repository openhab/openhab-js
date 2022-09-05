export = ItemHistory;
/**
 * Class representing the historic state of an openHAB Item.
 * Wrapping the {@link https://www.openhab.org/javadoc/latest/org/openhab/core/persistence/extensions/persistenceextensions PersistenceExtensions}.
 *
 *
 * @memberOf items
 * @hideconstructor
 */
declare class ItemHistory {
    constructor(rawItem: any);
    rawItem: any;
    /**
     * Gets the average value of the state of a given Item between two certain points in time.
     *
     * @param {ZoneDateTime} begin begin
     * @param {ZoneDateTime} end end
     * @param {string} [serviceId] optional persistance service ID
     * @returns {(number | null)}
     */
    averageBetween(begin: ZoneDateTime, end: ZoneDateTime, serviceId?: string, ...args: any[]): (number | null);
    /**
       * Gets the average value of the state of a given Item since a certain point in time.
       *
       * @param {ZoneDateTime} timestamp
       * @param {string} [serviceId] optional persistance service ID
       * @returns {(number | null)}
       */
    averageSince(timestamp: ZoneDateTime, serviceId?: string, ...args: any[]): (number | null);
    /**
     * Checks if the state of a given Item has changed between two certain points in time.
     *
     * @param {ZoneDateTime} begin begin
     * @param {ZoneDateTime} end end
     * @param {string} [serviceId] optional persistance service ID
     * @returns {boolean}
     */
    changedBetween(begin: ZoneDateTime, end: ZoneDateTime, serviceId?: string, ...args: any[]): boolean;
    /**
       * Checks if the state of a given Item has changed since a certain point in time.
       *
       * @param {ZoneDateTime} timestamp
       * @param {string} [serviceId] optional persistance service ID
       * @returns {boolean}
       */
    changedSince(timestamp: ZoneDateTime, serviceId?: string, ...args: any[]): boolean;
    /**
     * Gets the difference value of the state of a given Item between two certain points in time.
     *
     * @param {ZoneDateTime} begin begin
     * @param {ZoneDateTime} end end
     * @param {string} [serviceId] optional persistance service ID
     * @returns {(number | null)}
     */
    deltaBetween(begin: ZoneDateTime, end: ZoneDateTime, serviceId?: string, ...args: any[]): (number | null);
    /**
       * Gets the difference value of the state of a given Item since a certain point in time.
       *
       * @param {ZoneDateTime} timestamp
       * @param {string} [serviceId] optional persistance service ID
       * @returns {(number | null)}
       */
    deltaSince(timestamp: ZoneDateTime, serviceId?: string, ...args: any[]): (number | null);
    /**
     * Gets the standard deviation of the state of the given Item between two certain points in time.
     *
     * @param {ZoneDateTime} begin begin
     * @param {ZoneDateTime} end end
     * @param {string} [serviceId] optional persistance service ID
     * @returns {(number | null)}
     */
    deviationBetween(begin: ZoneDateTime, end: ZoneDateTime, serviceId?: string, ...args: any[]): (number | null);
    /**
       * Gets the standard deviation of the state of the given Item since a certain point in time.
       *
       * @param {ZoneDateTime} timestamp
       * @param {string} [serviceId] optional persistance service ID
       * @returns {(number | null)}
       */
    deviationSince(timestamp: ZoneDateTime, serviceId?: string, ...args: any[]): (number | null);
    /**
       * Gets the evolution rate of the state of a given Item since a certain point in time.
       *
       * @param {ZoneDateTime} timestamp
       * @param {string} [serviceId] optional persistance service ID
       * @returns {(number | null)}
       */
    evolutionRate(timestamp: ZoneDateTime, serviceId?: string, ...args: any[]): (number | null);
    /**
       * Retrieves the historic state for a given Item at a certain point in time.
       *
       * @param {ZoneDateTime} timestamp
       * @param {string} [serviceId] optional persistance service ID
       * @returns {*} state
       */
    historicState(timestamp: ZoneDateTime, serviceId?: string, ...args: any[]): any;
    /**
     * Query the last update time of a given Item.
     *
     * @param {string} [serviceId] optional persistance service ID
     * @returns {(ZonedDateTime | null)}
     */
    lastUpdate(serviceId?: string, ...args: any[]): (ZonedDateTime | null);
    /**
     * Gets the maximum value of the historic state of a given Item between two certain points in time.
     *
     * @param {ZoneDateTime} begin begin
     * @param {ZoneDateTime} end end
     * @param {string} [serviceId] optional persistance service ID
     * @returns {(string | null)} state or null
     */
    maximumBetween(begin: ZoneDateTime, end: ZoneDateTime, serviceId?: string, ...args: any[]): (string | null);
    /**
     * Gets the maximum value of the historic state of a given Item since a certain point in time.
     *
     * @param {ZoneDateTime} timestamp
     * @param {string} [serviceId] optional persistance service ID
     * @returns {(string | null)} state or null
     */
    maximumSince(timestamp: ZoneDateTime, serviceId?: string, ...args: any[]): (string | null);
    /**
     * Gets the minimum value of the historic state of a given Item between two certain points in time.
     *
     * @param {ZoneDateTime} begin begin
     * @param {ZoneDateTime} end end
     * @param {string} [serviceId] optional persistance service ID
     * @returns {(string | null)} state or null
     */
    minimumBetween(begin: ZoneDateTime, end: ZoneDateTime, serviceId?: string, ...args: any[]): (string | null);
    /**
     * Gets the minimum value of the historic state of a given Item since a certain point in time.
     *
     * @param {ZoneDateTime} timestamp
     * @param {string} [serviceId] optional persistance service ID
     * @returns {(string | null)} state or null
     */
    minimumSince(timestamp: ZoneDateTime, serviceId?: string, ...args: any[]): (string | null);
    /**
     * Persists the state of a given Item.
     *
     * @param {string} [serviceId] optional persistance service ID
     */
    persist(serviceId?: string, ...args: any[]): void;
    /**
     * Returns the previous state of a given Item.
     *
     * @param {boolean} [skipEqual] optional, if true, skips equal state values and searches the first state not equal the current state
     * @param {string} [serviceId] optional persistance service ID
     * @returns {(string | null)} state or null
     */
    previousState(skipEqual?: boolean, serviceId?: string, ...args: any[]): (string | null);
    /**
     * Gets the sum of the states of a given Item between two certain points in time.
     *
     * @param {ZoneDateTime} begin begin
     * @param {ZoneDateTime} end end
     * @param {string} [serviceId] optional persistance service ID
     * @returns {(number | null)}
     */
    sumBetween(begin: ZoneDateTime, end: ZoneDateTime, serviceId?: string, ...args: any[]): (number | null);
    /**
     * Gets the sum of the states of a given Item since a certain point in time.
     *
     * @param {ZoneDateTime} timestamp
     * @param {string} [serviceId] optional persistance service ID
     * @returns {(number | null)}
     */
    sumSince(timestamp: ZoneDateTime, serviceId?: string, ...args: any[]): (number | null);
    /**
     * Checks if the state of a given Item has been updated between two certain points in time.
     *
     * @param {ZoneDateTime} begin begin
     * @param {ZoneDateTime} end end
     * @param {string} [serviceId] optional persistance service ID
     * @returns {boolean}
     */
    updatedBetween(begin: ZoneDateTime, end: ZoneDateTime, serviceId?: string, ...args: any[]): boolean;
    /**
     * Checks if the state of a given Item has been updated since a certain point in time.
     *
     * @param {ZoneDateTime} timestamp
     * @param {string} [serviceId] optional persistance service ID
     * @returns {boolean}
     */
    updatedSince(timestamp: ZoneDateTime, serviceId?: string, ...args: any[]): boolean;
    /**
     * Gets the variance of the state of the given Item between two certain points in time.
     *
     * @param {ZoneDateTime} begin begin
     * @param {ZoneDateTime} end end
     * @param {string} [serviceId] optional persistance service ID
     * @returns {(number | null)}
     */
    varianceBetween(begin: ZoneDateTime, end: ZoneDateTime, serviceId?: string, ...args: any[]): (number | null);
    /**
     * Gets the variance of the state of the given Item since a certain point in time.
     *
     * @param {ZoneDateTime} timestamp
     * @param {string} [serviceId] optional persistance service ID
     * @returns {(number | null)}
     */
    varianceSince(timestamp: ZoneDateTime, serviceId?: string, ...args: any[]): (number | null);
    /**
     * Retrieves the historic item state for a given Item at the current point in time.
     *
     * @param {string} [serviceId] optional persistance service ID
     * @returns {(string | null)} state
     */
    latestState(serviceId?: string, ...args: any[]): (string | null);
    /**
     * @private
     */
    private _stateOrNull;
    /**
     * @private
     */
    private _dateOrNull;
    /**
     * @private
     */
    private _decimalOrNull;
}
//# sourceMappingURL=item-history.d.ts.map