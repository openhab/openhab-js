export type Quantity = import('../quantity').Quantity;
/**
 * Class representing the historic state of an openHAB Item.
 * If the Item receives its state from a binding that supports units of measurement, the returned state is in the according base unit, otherwise there is no unit conversion happening.
 * Wrapping the {@link https://www.openhab.org/javadoc/latest/org/openhab/core/persistence/extensions/persistenceextensions PersistenceExtensions}.
 *
 * Be warned: This class can throw several exceptions from the underlying Java layer. It is recommended to wrap the methods of this class inside a try_catch block!
 *
 * Be aware that several methods return <code>null</code> if the default persistence service is no queryable persistence service
 * or the provided <code>serviceId</code> does not refer to an available queryable persistence service.
 *
 * @memberOf items
 * @hideconstructor
 */
export class ItemPersistence {
    constructor(rawItem: any);
    rawItem: any;
    /**
     * Persists the state of a given Item.
     *
     * Tells the persistence service to store the current state of the Item, which is then performed asynchronously.
     * This has the side effect, that if the Item state changes shortly after `.persist` has been called, the new state will be persisted.
     * To work around that side effect, you might add `java.lang.Thread.sleep` to your code:
     * @example
     * items.MyItem.persistence.persist(); // Tell persistence to store the current Item state
     * java.lang.Thread.sleep(100); // Wait 100 ms to make sure persistence has enough time to store the current Item state
     * items.MyItem.postUpdate(0); // Now set the Item state to a new value
     *
     * @param {(time.ZonedDateTime | Date)} [timestamp] the date for the item state to be stored
     * @param {string} [state] the state to be stored
     * @param {string} [serviceId] optional persistence service ID, if omitted, the default persistence service will be used
     */
    persist(timestamp?: (time.ZonedDateTime | Date), state?: string, serviceId?: string, ...args: any[]): void;
    /**
     * Retrieves the persisted state for a given Item at a certain point in time.
     *
     * @param {(time.ZonedDateTime | Date)} timestamp the point in time for which the persisted item should be retrieved
     * @param {string} [serviceId] optional persistence service ID, if omitted, the default persistence service will be used
     * @returns {(HistoricItem | null)} the persisted item at the given point in time, or <code>null</code> if no persisted item could be found
     */
    persistedState(timestamp: (time.ZonedDateTime | Date), serviceId?: string, ...args: any[]): (HistoricItem | null);
    /**
     * Query the last update time of a given Item.
     *
     * @param {string} [serviceId] optional persistence service ID, if omitted, the default persistence service will be used
     * @returns {(time.ZonedDateTime | null)} point in time of the last historic update to <code>item</code>, or <code>null</code> if there are no historic persisted updates
     */
    lastUpdate(serviceId?: string, ...args: any[]): (time.ZonedDateTime | null);
    /**
     * Query the next update time of a given Item.
     *
     * @param {string} [serviceId] optional persistence service ID, if omitted, the default persistence service will be used
     * @returns {(time.ZonedDateTime | null)} point in time of the first future update to <code>item</code>, or <code>null</code> if there are no future persisted updates
     */
    nextUpdate(serviceId?: string, ...args: any[]): (time.ZonedDateTime | null);
    /**
     * Returns the previous state of a given Item.
     *
     * @param {boolean} [skipEqual] optional, if true, skips equal state values and searches the first state not equal the current state
     * @param {string} [serviceId] optional persistence service ID, if omitted, the default persistence service will be used
     * @returns {(HistoricItem | null)} the persisted item at the given point in time, or <code>null</code> if no persisted item could be found or null
     */
    previousState(skipEqual?: boolean, serviceId?: string, ...args: any[]): (HistoricItem | null);
    /**
     * Returns the next state of a given Item.
     *
     * @param {boolean} [skipEqual] optional, if true, skips equal state values and searches the first state not equal the current state
     * @param {string} [serviceId] optional persistence service ID, if omitted, the default persistence service will be used
     * @returns {(HistoricItem | null)} the persisted item at the given point in time, or <code>null</code> if no persisted item could be found or null
     */
    nextState(skipEqual?: boolean, serviceId?: string, ...args: any[]): (HistoricItem | null);
    /**
     * Checks if the state of a given Item has changed since a certain point in time.
     *
     * @param {(time.ZonedDateTime | Date)} timestamp the point in time to start the check
     * @param {string} [serviceId] optional persistence service ID, if omitted, the default persistence service will be used
     * @returns {boolean} <code>true</code> if item state has changed, <code>false</code> if it has not changed,
     *                    <code>null</code> if <code>timestamp</code> is in the future
     */
    changedSince(timestamp: (time.ZonedDateTime | Date), serviceId?: string, ...args: any[]): boolean;
    /**
     * Checks if the state of a given Item will change by a certain point in time.
     *
     * @param {(time.ZonedDateTime | Date)} timestamp the point in time to end the check
     * @param {string} [serviceId] optional persistence service ID, if omitted, the default persistence service will be used
     * @returns {boolean} <code>true</code> if item state will change, <code>false</code> if it will not change,
     *                    <code>null</code> if <code>timestamp></code> is in the past
     */
    changedUntil(timestamp: (time.ZonedDateTime | Date), serviceId?: string, ...args: any[]): boolean;
    /**
     * Checks if the state of a given Item has changed between two certain points in time.
     *
     * @param {(time.ZonedDateTime | Date)} begin the point in time to start the check
     * @param {(time.ZonedDateTime | Date)} end the point in time to stop the check
     * @param {string} [serviceId] optional persistence service ID, if omitted, the default persistence service will be used
     * @returns {boolean} <code>true</code> if item state changes, <code>false</code> if the item does not change in the given interval,
     *                    <code>null</code> if <code>begin</code> is after <code>end</code>
     */
    changedBetween(begin: (time.ZonedDateTime | Date), end: (time.ZonedDateTime | Date), serviceId?: string, ...args: any[]): boolean;
    /**
     * Checks if the state of a given Item has been updated since a certain point in time.
     *
     * @param {(time.ZonedDateTime | Date)} timestamp the point in time to start the check
     * @param {string} [serviceId] optional persistence service ID, if omitted, the default persistence service will be used
     * @returns {boolean} <code>true</code> if item state was updated, <code>false</code> if the item has not been updated since <code>timestamp</code>,
     *                    <code>null</code> if <code>timestamp</code> is in the future
     */
    updatedSince(timestamp: (time.ZonedDateTime | Date), serviceId?: string, ...args: any[]): boolean;
    /**
     * Checks if the state of a given Item will be updated until a certain point in time.
     *
     * @param {(time.ZonedDateTime | Date)} timestamp the point in time to end the check
     * @param {string} [serviceId] optional persistence service ID, if omitted, the default persistence service will be used
     * @returns {boolean} <code>true</code> if item state is updated, <code>false</code> if the item is not updated until <code>timestamp</code>,
     *                    <code>null</code> if <code>timestamp</code> is in the past
     */
    updatedUntil(timestamp: (time.ZonedDateTime | Date), serviceId?: string, ...args: any[]): boolean;
    /**
     * Checks if the state of a given Item has been updated between two certain points in time.
     *
     * @param {(time.ZonedDateTime | Date)} begin the point in time to start the check
     * @param {(time.ZonedDateTime | Date)} end the point in time to stop the check
     * @param {string} [serviceId] optional persistence service ID, if omitted, the default persistence service will be used
     * @returns {boolean} <code>true</code> if item state was updated, <code>false</code> if the item has not been updated in the given interval,
     *                    <code>null</code> if <code>begin</code> is after <code>end</code>
     */
    updatedBetween(begin: (time.ZonedDateTime | Date), end: (time.ZonedDateTime | Date), serviceId?: string, ...args: any[]): boolean;
    /**
     * Gets the historic Item with the maximum value of a given Item since a certain point in time.
     *
     * @param {(time.ZonedDateTime | Date)} timestamp the point in time to start the check
     * @param {string} [serviceId] optional persistence service ID, if omitted, the default persistence service will be used
     * @returns {(HistoricItem | null)} a historic item with the maximum state value since the given point in time, a
     *                                  {@link HistoricItem} constructed from the <code>item</code>'s state if <code>item</code>'s state
     *                                  is the maximum value, <code>null</code> if <code>timestamp</code> is in the future
     */
    maximumSince(timestamp: (time.ZonedDateTime | Date), serviceId?: string, ...args: any[]): (HistoricItem | null);
    /**
     * Gets the historic Item with the maximum value of a given Item until a certain point in time.
     *
     * @param {(time.ZonedDateTime | Date)} timestamp the point in time to end the check
     * @param {string} [serviceId] optional persistence service ID, if omitted, the default persistence service will be used
     * @returns {(HistoricItem | null)} a historic item with the maximum state value until the given point in time, a
     *                                  {@link HistoricItem} constructed from the <code>item</code>'s state if <code>item</code>'s state
     *                                  is the maximum value, <code>null</code> if <code>timestamp</code> is in the past
     */
    maximumUntil(timestamp: (time.ZonedDateTime | Date), serviceId?: string, ...args: any[]): (HistoricItem | null);
    /**
     * Gets the historic Item with the maximum value of a given Item between two certain points in time.
     *
     * @param {(time.ZonedDateTime | Date)} begin the point in time to start the check
     * @param {(time.ZonedDateTime | Date)} end the point in time to stop the check
     * @param {string} [serviceId] optional persistence service ID, if omitted, the default persistence service will be used
     * @returns {(HistoricItem | null)} a {@link HistoricItem} with the maximum state value between two points in time, a
     *                                  {@link HistoricItem} constructed from the <code>item</code>'s state if no persisted states found,
     *                                  or <code>null</code> if <code>begin</code> is after <code>end</end>
     */
    maximumBetween(begin: (time.ZonedDateTime | Date), end: (time.ZonedDateTime | Date), serviceId?: string, ...args: any[]): (HistoricItem | null);
    /**
     * Gets the historic Item with the minimum value of a given Item since a certain point in time.
     *
     * @param {(time.ZonedDateTime | Date)} timestamp the point in time to start the check
     * @param {string} [serviceId] optional persistence service ID, if omitted, the default persistence service will be used
     * @returns {(HistoricItem | null)} a historic item with the minimum state value since the given point in time, a
     *                                  {@link HistoricItem} constructed from the <code>item</code>'s state if <code>item</code>'s state
     *                                  is the maximum value, <code>null</code> if <code>timestamp</code> is in the future
     */
    minimumSince(timestamp: (time.ZonedDateTime | Date), serviceId?: string, ...args: any[]): (HistoricItem | null);
    /**
     * Gets the historic Item with the minimum value of a given Item until a certain point in time.
     *
     * @param {(time.ZonedDateTime | Date)} timestamp the point in time to end the check
     * @param {string} [serviceId] optional persistence service ID, if omitted, the default persistence service will be used
     * @returns {(HistoricItem | null)} a historic item with the minimum state value until the given point in time, a
     *                                  {@link HistoricItem} constructed from the <code>item</code>'s state if <code>item</code>'s state
     *                                  is the maximum value, <code>null</code> if <code>timestamp</code> is in the past
     */
    minimumUntil(timestamp: (time.ZonedDateTime | Date), serviceId?: string, ...args: any[]): (HistoricItem | null);
    /**
     * Gets the state with the minimum value of a given Item between two certain points in time.
     *
     * @param {(time.ZonedDateTime | Date)} begin the point in time to start the check
     * @param {(time.ZonedDateTime | Date)} end the point in time to stop the check
     * @param {string} [serviceId] optional persistence service ID, if omitted, the default persistence service will be used
     * @returns {(HistoricItem | null)} a {@link HistoricItem} with the minimum state value between two points in time, a
     *                                  {@link HistoricItem} constructed from the <code>item</code>'s state if no persisted states found,
     *                                  or <code>null</code> if <code>begin</code> is after <code>end</end>
     */
    minimumBetween(begin: (time.ZonedDateTime | Date), end: (time.ZonedDateTime | Date), serviceId?: string, ...args: any[]): (HistoricItem | null);
    /**
     * Gets the variance of the state of the given Item since a certain point in time.
     *
     * @param {(time.ZonedDateTime | Date)} timestamp the point in time from which to compute the variance
     * @param {string} [serviceId] optional persistence service ID, if omitted, the default persistence service will be used
     * @returns {(string | null)} the variance between then and now, or <code>null</code> if <code>timestamp</code> is in the future,
     *                            or if there is no persisted state for the given <code>item</code> at the given <code>timestamp</code>
     */
    varianceSince(timestamp: (time.ZonedDateTime | Date), serviceId?: string, ...args: any[]): (string | null);
    /**
     * Gets the variance of the state of the given Item until a certain point in time.
     *
     * @param {(time.ZonedDateTime | Date)} timestamp the point in time to which to compute the variance
     * @param {string} [serviceId] optional persistence service ID, if omitted, the default persistence service will be used
     * @returns {(string | null)} the variance between now and then, or <code>null</code> if <code>timestamp</code> is in the past,
     *                            or if there is no persisted state for the given <code>item</code> at the given <code>timestamp</code>
     */
    varianceUntil(timestamp: (time.ZonedDateTime | Date), serviceId?: string, ...args: any[]): (string | null);
    /**
     * Gets the variance of the state of the given Item between two certain points in time.
     *
     * @param {(time.ZonedDateTime | Date)} begin the point in time from which to compute the variance
     * @param {(time.ZonedDateTime | Date)} end the end time for the computation
     * @param {string} [serviceId] optional persistence service ID, if omitted, the default persistence service will be used
     * @returns {(string | null)} the variance between both points of time, or <code>null</code> if <code>begin</code> is after <code>end</code>,
     *                            or if there is no persisted state for the given <code>item</code> between <code>begin</code> and <code>end</code>
     */
    varianceBetween(begin: (time.ZonedDateTime | Date), end: (time.ZonedDateTime | Date), serviceId?: string, ...args: any[]): (string | null);
    /**
     * Gets the standard deviation of the state of the given Item since a certain point in time.
     *
     * @param {(time.ZonedDateTime | Date)} timestamp the point in time from which to compute the standard deviation
     * @param {string} [serviceId] optional persistence service ID, if omitted, the default persistence service will be used
     * @returns {(string | null)} the standard deviation between then and now, or <code>null</code> if <code>timestamp</code> is in the future,
     *                            or if there is no persisted state for the given <code>item</code> at the given <code>timestamp</code>
     */
    deviationSince(timestamp: (time.ZonedDateTime | Date), serviceId?: string, ...args: any[]): (string | null);
    /**
     * Gets the standard deviation of the state of the given Item until a certain point in time.
     *
     * @param {(time.ZonedDateTime | Date)} timestamp the point in time to which to compute the standard deviation
     * @param {string} [serviceId] optional persistence service ID, if omitted, the default persistence service will be used
     * @returns {(string | null)} the standard deviation between now and then, or <code>null</code> if <code>timestamp</code> is in the past,
     *                            or if there is no persisted state for the given <code>item</code> at the given <code>timestamp</code>
     */
    deviationUntil(timestamp: (time.ZonedDateTime | Date), serviceId?: string, ...args: any[]): (string | null);
    /**
     * Gets the standard deviation of the state of the given Item between two certain points in time.
     *
     * @param {(time.ZonedDateTime | Date)} begin the point in time from which to compute
     * @param {(time.ZonedDateTime | Date)} end the end time for the computation
     * @param {string} [serviceId] optional persistence service ID, if omitted, the default persistence service will be used
     * @returns {(string | null)} the standard deviation between both points of time, or <code>null</code> if <code>begin</code> is after
     *                            <code>end</code>, or if there is no persisted state for the given <code>item</code> between <code>begin</code> and <code>end</code>
     */
    deviationBetween(begin: (time.ZonedDateTime | Date), end: (time.ZonedDateTime | Date), serviceId?: string, ...args: any[]): (string | null);
    /**
     * Gets the average value of the state of a given Item since a certain point in time.
     *
     * @example
     * var yesterday = new Date(new Date().getTime() - (24 * 60 * 60 * 1000));
     * var item = items.getItem('KitchenDimmer');
     * console.log('KitchenDimmer average since yesterday', item.persistence.averageSince(yesterday));
     *
     * @param {(time.ZonedDateTime | Date)} timestamp the point in time from which to search for the average value
     * @param {string} [serviceId] optional persistence service ID, if omitted, the default persistence service will be used
     * @returns {(string | null)} the average value since <code>timestamp</code> or <code>null</code> if no previous states could be found
     */
    averageSince(timestamp: (time.ZonedDateTime | Date), serviceId?: string, ...args: any[]): (string | null);
    /**
     * Gets the average value of the state of a given Item until a certain point in time.
     *
     * @param {(time.ZonedDateTime | Date)} timestamp the point in time to which to search for the average value
     * @param {string} [serviceId] optional persistence service ID, if omitted, the default persistence service will be used
     * @returns {(string | null)} the average value until <code>timestamp</code> or <code>null</code> if no future states could be found
     */
    averageUntil(timestamp: (time.ZonedDateTime | Date), serviceId?: string, ...args: any[]): (string | null);
    /**
     * Gets the average value of the state of a given Item between two certain points in time.
     *
     * @param {(time.ZonedDateTime | Date)} begin the point in time from which to start the average
     * @param {(time.ZonedDateTime | Date)} end the point in time to which to start the average
     * @param {string} [serviceId] optional persistence service ID, if omitted, the default persistence service will be used
     * @returns {(string | null)} the average value between <code>begin</code> and <code>end</code> or <code>null</code> if no states could be found
     */
    averageBetween(begin: (time.ZonedDateTime | Date), end: (time.ZonedDateTime | Date), serviceId?: string, ...args: any[]): (string | null);
    /**
     * Gets the sum of the states of a given Item since a certain point in time.
     *
     * @param {(time.ZonedDateTime | Date)} timestamp the point in time from which to start the summation
     * @param {string} [serviceId] optional persistence service ID, if omitted, the default persistence service will be used
     * @returns {(string | null)} the sum of the state values since <code>timestamp</code>, or null if <code>timestamp</code> is in the future
     */
    sumSince(timestamp: (time.ZonedDateTime | Date), serviceId?: string, ...args: any[]): (string | null);
    /**
     * Gets the sum of the states of a given Item until a certain point in time.
     *
     * @param {(time.ZonedDateTime | Date)} timestamp the point in time to which to start the summation
     * @param {string} [serviceId] optional persistence service ID, if omitted, the default persistence service will be used
     * @returns {(string | null)} the sum of the state values until <code>timestamp</code>, or null if <code>timestamp</code> is in the past
     */
    sumUntil(timestamp: (time.ZonedDateTime | Date), serviceId?: string, ...args: any[]): (string | null);
    /**
     * Gets the sum of the states of a given Item between two certain points in time.
     *
     * @param {(time.ZonedDateTime | Date)} begin the point in time from which to start the summation
     * @param {(time.ZonedDateTime | Date)} end the point in time to which to start the summation
     * @param {string} [serviceId] optional persistence service ID, if omitted, the default persistence service will be used
     * @returns {(string | null)} the sum of the state values between the given points in time, or null if <code>begin</code> is after <code>end</code>
     */
    sumBetween(begin: (time.ZonedDateTime | Date), end: (time.ZonedDateTime | Date), serviceId?: string, ...args: any[]): (string | null);
    /**
     * Gets the difference value of the state of a given Item since a certain point in time.
     *
     * @param {(time.ZonedDateTime | Date)} timestamp the point in time from which to compute the delta
     * @param {string} [serviceId] optional persistence service ID, if omitted, the default persistence service will be used
     * @returns {(string | null)} the difference between now and then, or <code>null</code> if there is no persisted state for
     *                            the given <code>item</code> at the given <code>timestamp</code> available
     */
    deltaSince(timestamp: (time.ZonedDateTime | Date), serviceId?: string, ...args: any[]): (string | null);
    /**
     * Gets the difference value of the state of a given Item until a certain point in time.
     *
     * @param {(time.ZonedDateTime | Date)} timestamp the point in time to which to compute the delta
     * @param {string} [serviceId] optional persistence service ID, if omitted, the default persistence service will be used
     * @returns {(string | null)} the difference between then and now, or <code>null</code> if there is no persisted state
     *                            for the given <code>item</code> at the given <code>timestamp</code> available
     */
    deltaUntil(timestamp: (time.ZonedDateTime | Date), serviceId?: string, ...args: any[]): (string | null);
    /**
     * Gets the difference value of the state of a given Item between two certain points in time.
     *
     * @param {(time.ZonedDateTime | Date)} begin the beginning point in time
     * @param {(time.ZonedDateTime | Date)} end the end point in time
     * @param {string} [serviceId] optional persistence service ID, if omitted, the default persistence service will be used
     * @returns {(string | null)} the difference between end and begin, or <code>null</code> if there is no persisted state for
     *                            the given <code>item</code> for the given points in time
     */
    deltaBetween(begin: (time.ZonedDateTime | Date), end: (time.ZonedDateTime | Date), serviceId?: string, ...args: any[]): (string | null);
    /**
     * Gets the evolution rate of the state of a given Item since a certain point in time.
     *
     * @param {(time.ZonedDateTime | Date)} timestamp the point in time from which to compute the evolution rate
     * @param {string} [serviceId] optional persistence service ID, if omitted, the default persistence service will be used
     * @returns {(number | null)} the evolution rate in percent (positive and negative) between then and now, or <code>null</code>
     *                            if there is no persisted state for the given <code>item</code> at the given <code>timestamp</code>,
     *                            or if there is a state but it is zero (which would cause a divide-by-zero error)
     */
    evolutionRateSince(timestamp: (time.ZonedDateTime | Date), serviceId?: string, ...args: any[]): (number | null);
    /**
     * Gets the evolution rate of the state of a given Item until a certain point in time.
     *
     * @param {(time.ZonedDateTime | Date)} timestamp the point in time to which to compute the evolution rate
     * @param {string} [serviceId] optional persistence service ID, if omitted, the default persistence service will be used
     * @returns {(number | null)} the evolution rate in percent (positive and negative) between then and now, or <code>null</code>
     *                            if there is no persisted state for the given <code>item</code> at the given <code>timestamp</code>,
     *                            or if there is a state but it is zero (which would cause a divide-by-zero error)
     */
    evolutionRateUntil(timestamp: (time.ZonedDateTime | Date), serviceId?: string, ...args: any[]): (number | null);
    /**
     * Gets the evolution rate of the state of a given Item between two certain points in time.
     *
     * @param {(time.ZonedDateTime | Date)} begin the beginning point in time
     * @param {(time.ZonedDateTime | Date)} end the end point in time
     * @param {string} [serviceId] optional persistence service ID, if omitted, the default persistence service will be used
     * @returns {(number | null)} the evolution rate in percent (positive and negative) in the given interval, or <code>null</code>
     *                            if there are no persisted states for the given Item at the given interval, or if there is a state #
     *                            but it is zero (which would cause a divide-by-zero error)
     */
    evolutionRateBetween(begin: (time.ZonedDateTime | Date), end: (time.ZonedDateTime | Date), serviceId?: string, ...args: any[]): (number | null);
    /**
     * Gets the number of available historic data points of a given Item since a certain point in time.
     *
     * @param {(time.ZonedDateTime | Date)} timestamp the beginning point in time
     * @param {string} [serviceId] optional persistence service ID, if omitted, the default persistence service will be used
     * @returns {number} the number of values persisted for this item, <code>null</code> if <code>timestamp</code> is in the future
     */
    countSince(timestamp: (time.ZonedDateTime | Date), serviceId?: string, ...args: any[]): number;
    /**
     * Gets the number of available data points of a given Item until a certain point in time.
     *
     * @param {(time.ZonedDateTime | Date)} timestamp the ending point in time
     * @param {string} [serviceId] optional persistence service ID, if omitted, the default persistence service will be used
     * @returns {number} the number of values persisted for this item, <code>null</code> if <code>timestamp</code> is in the past
     */
    countUntil(timestamp: (time.ZonedDateTime | Date), serviceId?: string, ...args: any[]): number;
    /**
     * Gets the number of available data points of a given Item between two certain points in time.
     *
     * @param {(time.ZonedDateTime | Date)} begin the beginning point in time
     * @param {(time.ZonedDateTime | Date)} end the end point in time
     * @param {string} [serviceId] optional persistence service ID, if omitted, the default persistence service will be used
     * @returns {number} the number of values persisted for this item, <code>null</code> if <code>begin</code> is after <code>end</code>
     */
    countBetween(begin: (time.ZonedDateTime | Date), end: (time.ZonedDateTime | Date), serviceId?: string, ...args: any[]): number;
    /**
     * Gets the number of changes in historic data points of a given Item since a certain point in time.
     *
     * @param {(time.ZonedDateTime | Date)} timestamp the beginning point in time
     * @param {string} [serviceId] optional persistence service ID, if omitted, the default persistence service will be used
     * @returns {number} the number of state changes for this item
     */
    countStateChangesSince(timestamp: (time.ZonedDateTime | Date), serviceId?: string, ...args: any[]): number;
    /**
     * Gets the number of changes in data points of a given Item until a certain point in time.
     *
     * @param {(time.ZonedDateTime | Date)} timestamp the ending point in time
     * @param {string} [serviceId] optional persistence service ID, if omitted, the default persistence service will be used
     * @returns {number} the number of state changes for this item
     */
    countStateChangesUntil(timestamp: (time.ZonedDateTime | Date), serviceId?: string, ...args: any[]): number;
    /**
     * Gets the number of changes in data points of a given Item between two certain points in time.
     *
     * @param {(time.ZonedDateTime | Date)} begin the beginning point in time
     * @param {(time.ZonedDateTime | Date)} end the end point in time
     * @param {string} [serviceId] optional persistence service ID, if omitted, the default persistence service will be used
     * @returns {number} the number of state changes for this item
     */
    countStateChangesBetween(begin: (time.ZonedDateTime | Date), end: (time.ZonedDateTime | Date), serviceId?: string, ...args: any[]): number;
    /**
     * Retrieves the historic Items for a given Item since a certain point in time.
     *
     * @param {(time.ZonedDateTime | Date)} timestamp the point in time from which to retrieve the states
     * @param {string} [serviceId] optional persistence service ID, if omitted, the default persistence service will be used
     * @returns {HistoricItem[]} the historic items since the given point in time
     */
    getAllStatesSince(timestamp: (time.ZonedDateTime | Date), serviceId?: string, ...args: any[]): HistoricItem[];
    /**
     * Retrieves the future Items for a given Item until a certain point in time.
     *
     * @param {(time.ZonedDateTime | Date)} timestamp the point in time to which to retrieve the states
     * @param {string} [serviceId] optional persistence service ID, if omitted, the default persistence service will be used
     * @returns {HistoricItem[]} the future items to the given point in time
     */
    getAllStatesUntil(timestamp: (time.ZonedDateTime | Date), serviceId?: string, ...args: any[]): HistoricItem[];
    /**
     * Retrieves the historic Items for a given Item between two certain points in time.
     *
     * @param {(time.ZonedDateTime | Date)} begin the point in time from which to retrieve the states
     * @param {(time.ZonedDateTime | Date)} end the point in time to which to retrieve the states
     * @param {string} [serviceId] optional persistence service ID, if omitted, the default persistence service will be used
     * @returns {HistoricItem[]} the historic items between the given points in time,
     */
    getAllStatesBetween(begin: (time.ZonedDateTime | Date), end: (time.ZonedDateTime | Date), serviceId?: string, ...args: any[]): HistoricItem[];
    /**
     * Removes from persistence the historic items for a given Item since a certain point in time.
     * This will only have effect if the persistence service is a modifiable persistence service.
     *
     * @param {(time.ZonedDateTime | Date)} timestamp the point in time from which to remove the states
     * @param {string} [serviceId] optional persistence service ID, if omitted, the default persistence service will be used
     */
    removeAllStatesSince(timestamp: (time.ZonedDateTime | Date), serviceId?: string, ...args: any[]): any;
    /**
     * Removes from persistence the future items for a given Item until a certain point in time.
     * This will only have effect if the persistence service is a modifiable persistence service.
     *
     * @param {(time.ZonedDateTime | Date)} timestamp the point in time to which to remove the states
     * @param {string} [serviceId] optional persistence service ID, if omitted, the default persistence service will be used
     */
    removeAllStatesUntil(timestamp: (time.ZonedDateTime | Date), serviceId?: string, ...args: any[]): any;
    /**
     * Removes from persistence the historic items for a given Item between two certain points in time.
     * This will only have effect if the persistence service is a modifiable persistence service.
     *
     * @param {(time.ZonedDateTime | Date)} begin the point in time from which to remove the states
     * @param {(time.ZonedDateTime | Date)} end the point in time to which to remove the states
     * @param {string} [serviceId] optional persistence service ID, if omitted, the default persistence service will be used
     */
    removeAllStatesBetween(begin: (time.ZonedDateTime | Date), end: (time.ZonedDateTime | Date), serviceId?: string, ...args: any[]): any;
}
/**
 * Class representing an openHAB HistoricItem
 *
 * @memberof items
 * @hideconstructor
 */
export class HistoricItem {
    /**
     * @param {*} rawHistoricItem {@link https://www.openhab.org/javadoc/latest/org/openhab/core/persistence/historicitem org.openhab.core.persistence.HistoricItem}
     */
    constructor(rawHistoricItem: any);
    rawHistoricItem: any;
    /**
     * Raw Java Item state
     * @type {HostState}
     */
    rawState: HostState;
    /**
     * String representation of the Item state.
     * @type {string}
     */
    get state(): string;
    /**
     * Numeric representation of Item state, or `null` if state is not numeric
     * @type {number|null}
     */
    get numericState(): number;
    /**
     * Item state as {@link Quantity} or `null` if state is not Quantity-compatible or Quantity would be unit-less (without unit)
     * @type {Quantity|null}
     */
    get quantityState(): import("../quantity").Quantity;
    /**
     * Timestamp of persisted Item.
     * @type {time.ZonedDateTime}
     */
    get timestamp(): JSJoda.ZonedDateTime;
}
declare namespace time {
    type ZonedDateTime = import('@js-joda/core').ZonedDateTime;
}
import time = require("../time");
export {};
//# sourceMappingURL=item-persistence.d.ts.map