export = ItemHistory;
/**
 * Class representing the historic state of an openHAB Item
 *
 *
 * @memberOf items
 * @hideconstructor
 */
declare class ItemHistory {
    constructor(item: any);
    item: any;
    /**
     * Gets the average value of the state of a given Item since a certain point in time.
     *
     * @example
     * var item = items.getItem("KitchenDimmer");
     * console.log("KitchenDimmer averageSince", item.history.averageSince(yesterday));
     *
     * @param {(Date | ZoneDateTime)} timestamp
     * @param {string} [serviceId] optional persistance service ID
     * @returns {(Number | null)}
     */
    averageSince(timestamp: (Date | ZoneDateTime), serviceId?: string, ...args: any[]): (number | null);
    /**
     * Checks if the state of a given item has changed since a certain point in time.
     *
     * @param {(Date | ZoneDateTime)} timestamp
     * @param {string} [serviceId] optional persistance service ID
     * @returns {boolean}
     */
    changedSince(timestamp: (Date | ZoneDateTime), serviceId?: string, ...args: any[]): boolean;
    /**
     * Gets the difference value of the state of a given item since a certain point in time.
     *
     * @param {(Date | ZoneDateTime)} timestamp
     * @param {string} [serviceId] optional persistance service ID
     * @returns {(Number | null)}
     */
    deltaSince(timestamp: (Date | ZoneDateTime), serviceId?: string, ...args: any[]): (number | null);
    /**
     * Gets the standard deviation of the state of the given Item since a certain point in time.
     *
     * @param {(Date | ZoneDateTime)} timestamp
     * @param {string} [serviceId] optional persistance service ID
     * @returns {(Number | null)}
     */
    deviationSince(timestamp: (Date | ZoneDateTime), serviceId?: string, ...args: any[]): (number | null);
    /**
     * Gets the evolution rate of the state of a given Item since a certain point in time.
     *
     * @param {(Date | ZoneDateTime)} timestamp
     * @param {string} [serviceId] optional persistance service ID
     * @returns {(Number | null)}
     */
    evolutionRate(timestamp: (Date | ZoneDateTime), serviceId?: string, ...args: any[]): (number | null);
    /**
     * Retrieves the historic item state for a given item at a certain point in time.
     *
     * @param {(Date | ZoneDateTime)} timestamp
     * @param {string} [serviceId] optional persistance service ID
     * @returns {*} state
     */
    historicState(timestamp: (Date | ZoneDateTime), serviceId?: string, ...args: any[]): any;
    /**
     * Query the last update time of a given item.
     *
     * @param {string} [serviceId] optional persistance service ID
     * @returns {(Date | null)}
     */
    lastUpdate(serviceId?: string, ...args: any[]): (Date | null);
    /**
     * Gets the historic item with the maximum value of the state of a given item since a certain point in time.
     *
     * @param {(Date | ZoneDateTime)} timestamp
     * @param {string} [serviceId] optional persistance service ID
     * @returns {*} state
     */
    maximumSince(timestamp: (Date | ZoneDateTime), serviceId?: string, ...args: any[]): any;
    /**
     * Gets the historic item with the minimum value of the state of a given item since a certain point in time.
     *
     * @param {(Date | ZoneDateTime)} timestamp
     * @param {string} [serviceId] optional persistance service ID
     * @returns {*} state
     */
    minimumSince(timestamp: (Date | ZoneDateTime), serviceId?: string, ...args: any[]): any;
    /**
     * Persists the state of a given item
     *
     * @param {string} [serviceId] optional persistance service ID
     */
    persist(serviceId?: string, ...args: any[]): void;
    /**
     * Returns the previous state of a given item.
     *
     * @param {boolean} [skipEqual] optional, if true, skips equal state values and searches the first state not equal the current state
     * @param {string} [serviceId] optional persistance service ID
     * @returns {*} state
     */
    previousState(skipEqual?: boolean, serviceId?: string, ...args: any[]): any;
    /**
     * Gets the sum of the state of a given item since a certain point in time.
     *
     * @param {(Date | ZoneDateTime)} timestamp
     * @param {string} [serviceId] optional persistance service ID
     * @returns {(Number | null)}
     */
    sumSince(timestamp: (Date | ZoneDateTime), serviceId?: string, ...args: any[]): (number | null);
    /**
     * Checks if the state of a given item has been updated since a certain point in time.
     *
     * @param {(Date | ZoneDateTime)} timestamp
     * @param {string} [serviceId] optional persistance service ID
     * @returns {boolean}
     */
    updatedSince(timestamp: (Date | ZoneDateTime), serviceId?: string, ...args: any[]): boolean;
    /**
     * Gets the variance of the state of the given Item since a certain point in time.
     *
     * @param {(Date | ZoneDateTime)} timestamp
     * @param {string} [serviceId] optional persistance service ID
     * @returns {*} state
     */
    varianceSince(timestamp: (Date | ZoneDateTime), serviceId?: string, ...args: any[]): any;
    /**
     * Retrieves the historic item state for a given item at the current point in time.
     * @param {string} [serviceId] optional persistance service ID
     * @returns {*} state
     */
    latestState(serviceId?: string, ...args: any[]): any;
    _stateOrNull(result: any): any;
    _dateOrNull(result: any): Date;
    _decimalOrNull(result: any): any;
}
declare namespace ItemHistory {
    export { HostItem, HostGroupFunction, ZoneDateTime };
}
type ZoneDateTime = any;
type HostItem = any;
type HostGroupFunction = any;
