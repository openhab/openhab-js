export = ItemHistory;
/**
 * Class representing the historic state of an openHAB Item.
 * If the Item receives it's state from a binding that supports units of measurement, the returned state is in the according base unit, otherwise there is no unit conversion happening.
 * Wrapping the {@link https://www.openhab.org/javadoc/latest/org/openhab/core/persistence/extensions/persistenceextensions PersistenceExtensions}.
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
     * @param {(time.ZonedDateTime | Date)} begin begin
     * @param {(time.ZonedDateTime | Date)} end end
     * @param {string} [serviceId] Optional persistence service ID, if omitted, the default persistence service will be used.
     * @returns {(number | null)}
     */
    averageBetween(begin: (time.ZonedDateTime | Date), end: (time.ZonedDateTime | Date), serviceId?: string, ...args: any[]): (number | null);
    /**
     * Gets the average value of the state of a given Item since a certain point in time.
     *
     * @example
     * var yesterday = new Date(new Date().getTime() - (24 * 60 * 60 * 1000));
     * var item = items.getItem('KitchenDimmer');
     * console.log('KitchenDimmer average since yesterday', item.history.averageSince(yesterday));
     *
     * @param {(time.ZonedDateTime | Date)} timestamp
     * @param {string} [serviceId] Optional persistence service ID, if omitted, the default persistence service will be used.
     * @returns {(number | null)}
     */
    averageSince(timestamp: (time.ZonedDateTime | Date), serviceId?: string, ...args: any[]): (number | null);
    /**
     * Checks if the state of a given Item has changed between two certain points in time.
     *
     * @param {(time.ZonedDateTime | Date)} begin begin
     * @param {(time.ZonedDateTime | Date)} end end
     * @param {string} [serviceId] Optional persistence service ID, if omitted, the default persistence service will be used.
     * @returns {boolean}
     */
    changedBetween(begin: (time.ZonedDateTime | Date), end: (time.ZonedDateTime | Date), serviceId?: string, ...args: any[]): boolean;
    /**
     * Checks if the state of a given Item has changed since a certain point in time.
     *
     * @param {(time.ZonedDateTime | Date)} timestamp
     * @param {string} [serviceId] Optional persistence service ID, if omitted, the default persistence service will be used.
     * @returns {boolean}
     */
    changedSince(timestamp: (time.ZonedDateTime | Date), serviceId?: string, ...args: any[]): boolean;
    /**
     * Gets the number of available historic data points of a given Item between two certain points in time.
     *
     * @param {(time.ZonedDateTime | Date)} begin begin
     * @param {(time.ZonedDateTime | Date)} end end
     * @param {string} [serviceId] Optional persistence service ID, if omitted, the default persistence service will be used.
     * @returns {number}
     */
    countBetween(begin: (time.ZonedDateTime | Date), end: (time.ZonedDateTime | Date), serviceId?: string, ...args: any[]): number;
    /**
     * Gets the number of available historic data points of a given Item since a certain point in time.
     *
     * @param {(time.ZonedDateTime | Date)} timestamp
     * @param {string} [serviceId] Optional persistence service ID, if omitted, the default persistence service will be used.
     * @returns {number}
     */
    countSince(timestamp: (time.ZonedDateTime | Date), serviceId?: string, ...args: any[]): number;
    /**
     * Gets the number of changes in historic data points of a given Item between two certain points in time.
     *
     * @param {(time.ZonedDateTime | Date)} begin begin
     * @param {(time.ZonedDateTime | Date)} end end
     * @param {string} [serviceId] Optional persistence service ID, if omitted, the default persistence service will be used.
     * @returns {number}
     */
    countStateChangesBetween(begin: (time.ZonedDateTime | Date), end: (time.ZonedDateTime | Date), serviceId?: string, ...args: any[]): number;
    /**
     * Gets the number of changes in historic data points of a given Item since a certain point in time.
     *
     * @param {(time.ZonedDateTime | Date)} timestamp
     * @param {string} [serviceId] Optional persistence service ID, if omitted, the default persistence service will be used.
     * @returns {number}
     */
    countStateChangesSince(timestamp: (time.ZonedDateTime | Date), serviceId?: string, ...args: any[]): number;
    /**
     * Gets the difference value of the state of a given Item between two certain points in time.
     *
     * @param {(time.ZonedDateTime | Date)} begin begin
     * @param {(time.ZonedDateTime | Date)} end end
     * @param {string} [serviceId] Optional persistence service ID, if omitted, the default persistence service will be used.
     * @returns {(number | null)}
     */
    deltaBetween(begin: (time.ZonedDateTime | Date), end: (time.ZonedDateTime | Date), serviceId?: string, ...args: any[]): (number | null);
    /**
     * Gets the difference value of the state of a given Item since a certain point in time.
     *
     * @param {(time.ZonedDateTime | Date)} timestamp
     * @param {string} [serviceId] Optional persistence service ID, if omitted, the default persistence service will be used.
     * @returns {(number | null)}
     */
    deltaSince(timestamp: (time.ZonedDateTime | Date), serviceId?: string, ...args: any[]): (number | null);
    /**
     * Gets the standard deviation of the state of the given Item between two certain points in time.
     *
     * @param {(time.ZonedDateTime | Date)} begin begin
     * @param {(time.ZonedDateTime | Date)} end end
     * @param {string} [serviceId] Optional persistence service ID, if omitted, the default persistence service will be used.
     * @returns {(number | null)}
     */
    deviationBetween(begin: (time.ZonedDateTime | Date), end: (time.ZonedDateTime | Date), serviceId?: string, ...args: any[]): (number | null);
    /**
     * Gets the standard deviation of the state of the given Item since a certain point in time.
     *
     * @param {(time.ZonedDateTime | Date)} timestamp
     * @param {string} [serviceId] Optional persistence service ID, if omitted, the default persistence service will be used.
     * @returns {(number | null)}
     */
    deviationSince(timestamp: (time.ZonedDateTime | Date), serviceId?: string, ...args: any[]): (number | null);
    /**
     * Gets the evolution rate of the state of a given Item since a certain point in time.
     *
     * @deprecated Replaced by evolutionRateSince and evolutionRateBetween.
     * @param {(time.ZonedDateTime | Date)} timestamp
     * @param {string} [serviceId] Optional persistence service ID, if omitted, the default persistence service will be used.
     * @returns {(number | null)}
     */
    evolutionRate(timestamp: (time.ZonedDateTime | Date), serviceId?: string, ...args: any[]): (number | null);
    /**
     * Gets the evolution rate of the state of a given Item between two certain points in time.
     *
     * @param {(time.ZonedDateTime | Date)} begin begin
     * @param {(time.ZonedDateTime | Date)} end end
     * @param {string} [serviceId] Optional persistence service ID, if omitted, the default persistence service will be used.
     * @returns {(number | null)}
     */
    evolutionRateBetween(begin: (time.ZonedDateTime | Date), end: (time.ZonedDateTime | Date), serviceId?: string, ...args: any[]): (number | null);
    /**
     * Gets the evolution rate of the state of a given Item since a certain point in time.
     *
     * @param {(time.ZonedDateTime | Date)} timestamp
     * @param {string} [serviceId] Optional persistence service ID, if omitted, the default persistence service will be used.
     * @returns {(number | null)}
     */
    evolutionRateSince(timestamp: (time.ZonedDateTime | Date), serviceId?: string, ...args: any[]): (number | null);
    /**
     * Retrieves the historic state for a given Item at a certain point in time.
     *
     * @param {(time.ZonedDateTime | Date)} timestamp
     * @param {string} [serviceId] Optional persistence service ID, if omitted, the default persistence service will be used.
     * @returns {(string | null)} state
     */
    historicState(timestamp: (time.ZonedDateTime | Date), serviceId?: string, ...args: any[]): (string | null);
    /**
     * Query the last update time of a given Item.
     *
     * @param {string} [serviceId] Optional persistence service ID, if omitted, the default persistence service will be used.
     * @returns {(time.ZonedDateTime | null)}
     */
    lastUpdate(serviceId?: string, ...args: any[]): (time.ZonedDateTime | null);
    /**
     * Retrieves the historic item state for a given Item at the current point in time.
     *
     * @param {string} [serviceId] Optional persistence service ID, if omitted, the default persistence service will be used.
     * @returns {(string | null)} state
     */
    latestState(serviceId?: string, ...args: any[]): (string | null);
    /**
     * Gets the state with the maximum value of a given Item between two certain points in time.
     *
     * @param {(time.ZonedDateTime | Date)} begin begin
     * @param {(time.ZonedDateTime | Date)} end end
     * @param {string} [serviceId] Optional persistence service ID, if omitted, the default persistence service will be used.
     * @returns {(number | null)} state or null
     */
    maximumBetween(begin: (time.ZonedDateTime | Date), end: (time.ZonedDateTime | Date), serviceId?: string, ...args: any[]): (number | null);
    /**
     * Gets the state with the maximum value of a given Item since a certain point in time.
     *
     * @param {(time.ZonedDateTime | Date)} timestamp
     * @param {string} [serviceId] Optional persistence service ID, if omitted, the default persistence service will be used.
     * @returns {(number | null)} state or null
     */
    maximumSince(timestamp: (time.ZonedDateTime | Date), serviceId?: string, ...args: any[]): (number | null);
    /**
     * Gets the state with the minimum value of a given Item between two certain points in time.
     *
     * @param {(time.ZonedDateTime | Date)} begin begin
     * @param {(time.ZonedDateTime | Date)} end end
     * @param {string} [serviceId] Optional persistence service ID, if omitted, the default persistence service will be used.
     * @returns {(number | null)} state or null
     */
    minimumBetween(begin: (time.ZonedDateTime | Date), end: (time.ZonedDateTime | Date), serviceId?: string, ...args: any[]): (number | null);
    /**
     * Gets the state with the minimum value of a given Item since a certain point in time.
     *
     * @param {(time.ZonedDateTime | Date)} timestamp
     * @param {string} [serviceId] Optional persistence service ID, if omitted, the default persistence service will be used.
     * @returns {(number | null)} state or null
     */
    minimumSince(timestamp: (time.ZonedDateTime | Date), serviceId?: string, ...args: any[]): (number | null);
    /**
     * Persists the state of a given Item.
     *
     * @param {string} [serviceId] Optional persistence service ID, if omitted, the default persistence service will be used.
     */
    persist(serviceId?: string, ...args: any[]): void;
    /**
     * Returns the previous state of a given Item.
     *
     * @param {boolean} [skipEqual] optional, if true, skips equal state values and searches the first state not equal the current state
     * @param {string} [serviceId] Optional persistence service ID, if omitted, the default persistence service will be used.
     * @returns {(string | null)} state or null
     */
    previousState(skipEqual?: boolean, serviceId?: string, ...args: any[]): (string | null);
    /**
     * Returns the time when the previous state of a given Item was persisted.
     *
     * @param {boolean} [skipEqual] optional, if true, skips equal state values and searches the first state not equal the current state
     * @param {string} [serviceId] Optional persistence service ID, if omitted, the default persistence service will be used.
     * @returns {(time.ZonedDateTime | null)} {@link time.ZonedDateTime} or null
     */
    previousStateTimestamp(skipEqual?: boolean, serviceId?: string, ...args: any[]): (time.ZonedDateTime | null);
    /**
     * Gets the sum of the states of a given Item between two certain points in time.
     *
     * @param {(time.ZonedDateTime | Date)} begin begin
     * @param {(time.ZonedDateTime | Date)} end end
     * @param {string} [serviceId] Optional persistence service ID, if omitted, the default persistence service will be used.
     * @returns {(number | null)}
     */
    sumBetween(begin: (time.ZonedDateTime | Date), end: (time.ZonedDateTime | Date), serviceId?: string, ...args: any[]): (number | null);
    /**
     * Gets the sum of the states of a given Item since a certain point in time.
     *
     * @param {(time.ZonedDateTime | Date)} timestamp
     * @param {string} [serviceId] Optional persistence service ID, if omitted, the default persistence service will be used.
     * @returns {(number | null)}
     */
    sumSince(timestamp: (time.ZonedDateTime | Date), serviceId?: string, ...args: any[]): (number | null);
    /**
     * Checks if the state of a given Item has been updated between two certain points in time.
     *
     * @param {(time.ZonedDateTime | Date)} begin begin
     * @param {(time.ZonedDateTime | Date)} end end
     * @param {string} [serviceId] Optional persistence service ID, if omitted, the default persistence service will be used.
     * @returns {boolean}
     */
    updatedBetween(begin: (time.ZonedDateTime | Date), end: (time.ZonedDateTime | Date), serviceId?: string, ...args: any[]): boolean;
    /**
     * Checks if the state of a given Item has been updated since a certain point in time.
     *
     * @param {(time.ZonedDateTime | Date)} timestamp
     * @param {string} [serviceId] Optional persistence service ID, if omitted, the default persistence service will be used.
     * @returns {boolean}
     */
    updatedSince(timestamp: (time.ZonedDateTime | Date), serviceId?: string, ...args: any[]): boolean;
    /**
     * Gets the variance of the state of the given Item between two certain points in time.
     *
     * @param {(time.ZonedDateTime | Date)} begin begin
     * @param {(time.ZonedDateTime | Date)} end end
     * @param {string} [serviceId] Optional persistence service ID, if omitted, the default persistence service will be used.
     * @returns {(number | null)}
     */
    varianceBetween(begin: (time.ZonedDateTime | Date), end: (time.ZonedDateTime | Date), serviceId?: string, ...args: any[]): (number | null);
    /**
     * Gets the variance of the state of the given Item since a certain point in time.
     *
     * @param {(time.ZonedDateTime | Date)} timestamp
     * @param {string} [serviceId] Optional persistence service ID, if omitted, the default persistence service will be used.
     * @returns {(number | null)}
     */
    varianceSince(timestamp: (time.ZonedDateTime | Date), serviceId?: string, ...args: any[]): (number | null);
    /**
     * @private
     */
    private _stateOrNull;
    /**
     * @private
     */
    private _timestampOrNull;
    /**
     * @private
     */
    private _dateOrNull;
    /**
     * @private
     */
    private _decimalOrNull;
}
declare namespace ItemHistory {
    export { time };
}
type time = typeof JSJoda;
//# sourceMappingURL=item-history.d.ts.map