export = ItemPersistence;
/**
 * Class representing the historic state of an openHAB Item.
 * Wrapping the {@link https://www.openhab.org/javadoc/latest/org/openhab/core/persistence/extensions/persistenceextensions org.openhab.core.persistence.extensions.PersistenceExtensions}.
 *
 * Be warned: This class can throw several exceptions from the underlying Java layer. It is recommended to wrap the methods of this class inside a try_catch block!
 *
 * Please note: Several methods return <code>null</code> if the default persistence service is no queryable persistence service
 * or the provided <code>serviceId</code> does not refer to an available queryable persistence service.
 *
 * @memberOf items
 * @hideconstructor
 */
declare class ItemPersistence {
    static RiemannType: any;
    constructor(rawItem: any);
    rawItem: any;
    /**
     * Persists a state of a given Item.
     *
     * There are six ways to use this method:
     * ```js
     * // Tell persistence to store the current Item state
     * items.MyItem.persistence.persist();
     * items.MyItem.persistence.persist('influxdb'); // using the InfluxDB persistence service
     *
     * // Tell persistence to store the state 'ON' at 2021-01-01 00:00:00
     * items.MyItem.persistence.persist(time.toZDT('2021-01-01T00:00:00'), 'ON');
     * items.MyItem.persistence.persist(time.toZDT('2021-01-01T00:00:00'), 'ON', 'influxdb'); // using the InfluxDB persistence service
     *
     * // Tell persistence to store a TimeSeries
     * items.MyItem.persistence.persist(timeSeries);
     * items.MyItem.persistence.persist(timeSeries, 'influxdb'); // using the InfluxDB persistence service
     * ```
     *
     * **Note:** The persistence service will store the state asynchronously in the background, this method will return immediately.
     * When storing the current state, this has the side effect, that if the Item state changes shortly the method call, the new state will be persisted.
     * To work around that side effect, you might add `java.lang.Thread.sleep` to your code:
     * ```js
     * items.MyItem.persistence.persist(); // Tell persistence to store the current Item state
     * java.lang.Thread.sleep(100); // Wait 100 ms to make sure persistence has enough time to store the current Item state
     * items.MyItem.postUpdate(0); // Now set the Item state to a new value
     * ```
     *
     * @param {(time.ZonedDateTime | Date)} [timestamp] the date for the item state to be stored
     * @param {string|number|time.ZonedDateTime|Quantity|HostState} [state] the state to be stored
     * @param {items.TimeSeries} [timeSeries] optional TimeSeries to be stored
     * @param {string} [serviceId] optional persistence service ID, if omitted, the default persistence service will be used
     */
    persist(timestamp?: (time.ZonedDateTime | Date), state?: string | number | time.ZonedDateTime | Quantity | HostState, timeSeries?: items.TimeSeries, serviceId?: string, ...args: any[]): void;
    /**
     * Retrieves the persisted state for a given Item at a certain point in time.
     *
     * @param {(time.ZonedDateTime | Date)} timestamp the point in time for which the persisted item should be retrieved
     * @param {string} [serviceId] optional persistence service ID, if omitted, the default persistence service will be used
     * @returns {(PersistedItem | null)} the {@link items.PersistedItem} at the given point in time, or <code>null</code> if no persisted item could be found
     */
    persistedState(timestamp: (time.ZonedDateTime | Date), serviceId?: string, ...args: any[]): (PersistedItem | null);
    /**
     * Query the last update time of a given Item.
     *
     * @param {string} [serviceId] optional persistence service ID, if omitted, the default persistence service will be used
     * @returns {(time.ZonedDateTime | null)} point in time of the last historic update to Item, or <code>null</code>
                                              if the current state is different from the last persisted state or there are no historic persisted updates
    */
    lastUpdate(serviceId?: string, ...args: any[]): (time.ZonedDateTime | null);
    /**
     * Query the next update time of a given Item.
     *
     * @param {string} [serviceId] optional persistence service ID, if omitted, the default persistence service will be used
     * @returns {(time.ZonedDateTime | null)} point in time of the first future update to Item, or <code>null</code> if there are no future persisted updates
     */
    nextUpdate(serviceId?: string, ...args: any[]): (time.ZonedDateTime | null);
    /**
     * Query the last change time of a given Item.
     *
     * @param {string} [serviceId] optional persistence service ID, if omitted, the default persistence service will be used
     * @returns {(time.ZonedDateTime | null)} point in time of the last historic change to Item, or <code>null</code>
                                              if the current state is different from the last persisted state or there are no historic persisted states
     */
    lastChange(serviceId?: string, ...args: any[]): (time.ZonedDateTime | null);
    /**
     * Query the next change time of a given Item.
     *
     * @param {string} [serviceId] optional persistence service ID, if omitted, the default persistence service will be used
     * @returns {(time.ZonedDateTime | null)} point in time of the first future change to Item, or <code>null</code> if there are no future persisted states
     */
    nextChange(serviceId?: string, ...args: any[]): (time.ZonedDateTime | null);
    /**
     * Returns the previous state of a given Item.
     *
     * @param {boolean} [skipEqual] optional, if true, skips equal state values and searches the first state not equal the current state
     * @param {string} [serviceId] optional persistence service ID, if omitted, the default persistence service will be used
     * @returns {(PersistedItem | null)} the {@link items.PersistedItem} at the given point in time, or <code>null</code> if no persisted item could be found or null
     */
    previousState(skipEqual?: boolean, serviceId?: string, ...args: any[]): (PersistedItem | null);
    /**
     * Returns the next state of a given Item.
     *
     * @param {boolean} [skipEqual] optional, if true, skips equal state values and searches the first state not equal the current state
     * @param {string} [serviceId] optional persistence service ID, if omitted, the default persistence service will be used
     * @returns {(PersistedItem | null)} the {@link items.PersistedItem} at the given point in time, or <code>null</code> if no persisted item could be found or null
     */
    nextState(skipEqual?: boolean, serviceId?: string, ...args: any[]): (PersistedItem | null);
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
     * Checks if the state of a given Item will have been updated until a certain point in time.
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
     * @returns {(PersistedItem | null)} a {@link items.PersistedItem} with the maximum state value since the given point in time,
     *                                   or <code>null</code> if <code>timestamp</code> is in the future
     */
    maximumSince(timestamp: (time.ZonedDateTime | Date), serviceId?: string, ...args: any[]): (PersistedItem | null);
    /**
     * Gets the future Item with the maximum value of a given Item until a certain point in time.
     *
     * @param {(time.ZonedDateTime | Date)} timestamp the point in time to end the check
     * @param {string} [serviceId] optional persistence service ID, if omitted, the default persistence service will be used
     * @returns {(PersistedItem | null)} a {@link items.PersistedItem}m with the maximum state value until the given point in time,
     *                                   or <code>null</code> if <code>timestamp</code> is in the past
     */
    maximumUntil(timestamp: (time.ZonedDateTime | Date), serviceId?: string, ...args: any[]): (PersistedItem | null);
    /**
     * Gets the persisted Item with the maximum value of a given Item between two certain points in time.
     *
     * @param {(time.ZonedDateTime | Date)} begin the point in time to start the check
     * @param {(time.ZonedDateTime | Date)} end the point in time to stop the check
     * @param {string} [serviceId] optional persistence service ID, if omitted, the default persistence service will be used
     * @returns {(PersistedItem | null)} a {@link items.PersistedItem} with the maximum state value between two points in time,
     *                                   or <code>null</code> if <code>begin</code> is after <code>end</end>
     */
    maximumBetween(begin: (time.ZonedDateTime | Date), end: (time.ZonedDateTime | Date), serviceId?: string, ...args: any[]): (PersistedItem | null);
    /**
     * Gets the historic Item with the minimum value of a given Item since a certain point in time.
     *
     * @param {(time.ZonedDateTime | Date)} timestamp the point in time to start the check
     * @param {string} [serviceId] optional persistence service ID, if omitted, the default persistence service will be used
     * @returns {(PersistedItem | null)} a {@link items.PersistedItem} with the minimum state value since the given point in time,
     *                                   or <code>null</code> if <code>timestamp</code> is in the future
     */
    minimumSince(timestamp: (time.ZonedDateTime | Date), serviceId?: string, ...args: any[]): (PersistedItem | null);
    /**
     * Gets the future Item with the minimum value of a given Item until a certain point in time.
     *
     * @param {(time.ZonedDateTime | Date)} timestamp the point in time to end the check
     * @param {string} [serviceId] optional persistence service ID, if omitted, the default persistence service will be used
     * @returns {(PersistedItem | null)} a {@link items.PersistedItem} with the minimum state value until the given point in time,
     *                                   or <code>null</code> if <code>timestamp</code> is in the past
     */
    minimumUntil(timestamp: (time.ZonedDateTime | Date), serviceId?: string, ...args: any[]): (PersistedItem | null);
    /**
     * Gets the state with the minimum value of a given Item between two certain points in time.
     *
     * @param {(time.ZonedDateTime | Date)} begin the point in time to start the check
     * @param {(time.ZonedDateTime | Date)} end the point in time to stop the check
     * @param {string} [serviceId] optional persistence service ID, if omitted, the default persistence service will be used
     * @returns {(PersistedItem | null)} a {@link items.PersistedItem} with the minimum state value between two points in time,
     *                                   or <code>null</code> if <code>begin</code> is after <code>end</end>
     */
    minimumBetween(begin: (time.ZonedDateTime | Date), end: (time.ZonedDateTime | Date), serviceId?: string, ...args: any[]): (PersistedItem | null);
    /**
     * Gets the variance of the state of the given Item since a certain point in time.
     *
     * @param {(time.ZonedDateTime | Date)} timestamp the point in time from which to compute the variance
     * @param {RiemannType} [riemannType] optional Riemann approximation type to calculate the integral approximation
     *                                    (<code>LEFT</code>, <code>RIGHT</code>, <code>TRAPEZOIDAL</code>, <code>MIDPOINT</code>),
     *                                    default <code>LEFT</code>
     * @param {string} [serviceId] optional persistence service ID, if omitted, the default persistence service will be used
     * @returns {(PersistedState | null)} the variance between then and now as {@link items.PersistedState}, or <code>null</code> if
     *                            <code>timestamp</code> is in the future, or if there is no persisted state for the given
     *                            Item at the given <code>timestamp</code>
     */
    varianceSince(timestamp: (time.ZonedDateTime | Date), riemannType?: any, serviceId?: string, ...args: any[]): (PersistedState | null);
    /**
     * Gets the variance of the state of the given Item until a certain point in time.
     *
     * @param {(time.ZonedDateTime | Date)} timestamp the point in time to which to compute the variance
     * @param {RiemannType} [riemannType] optional Riemann approximation type to calculate the integral approximation
     *                                    (<code>LEFT</code>, <code>RIGHT</code>, <code>TRAPEZOIDAL</code>, <code>MIDPOINT</code>),
     *                                    default <code>LEFT</code>
     * @param {string} [serviceId] optional persistence service ID, if omitted, the default persistence service will be used
     * @returns {(PersistedState | null)} the variance between now and then as {@link items.PersistedState}, or <code>null</code> if
     *                            <code>timestamp</code> is in the past, or if there is no persisted state for the given
     *                            Item at the given <code>timestamp</code>
     */
    varianceUntil(timestamp: (time.ZonedDateTime | Date), riemannType?: any, serviceId?: string, ...args: any[]): (PersistedState | null);
    /**
     * Gets the variance of the state of the given Item between two certain points in time.
     *
     * @param {(time.ZonedDateTime | Date)} begin the point in time from which to compute the variance
     * @param {(time.ZonedDateTime | Date)} end the end time for the computation
     * @param {RiemannType} [riemannType] optional Riemann approximation type to calculate the integral approximation
     *                                    (<code>LEFT</code>, <code>RIGHT</code>, <code>TRAPEZOIDAL</code>, <code>MIDPOINT</code>),
     *                                    default <code>LEFT</code>
     * @param {string} [serviceId] optional persistence service ID, if omitted, the default persistence service will be used
     * @returns {(PersistedState | null)} the variance between both points of time as {@link items.PersistedState}, or <code>null</code> if
     *                            <code>begin</code> is after <code>end</code>, or if there is no persisted state for the given
     *                            Item between <code>begin</code> and <code>end</code>
     */
    varianceBetween(begin: (time.ZonedDateTime | Date), end: (time.ZonedDateTime | Date), riemannType?: any, serviceId?: string, ...args: any[]): (PersistedState | null);
    /**
     * Gets the standard deviation of the state of the given Item since a certain point in time.
     *
     * @param {(time.ZonedDateTime | Date)} timestamp the point in time from which to compute the standard deviation
     * @param {RiemannType} [riemannType] optional Riemann approximation type to calculate the integral approximation
     *                                    (<code>LEFT</code>, <code>RIGHT</code>, <code>TRAPEZOIDAL</code>, <code>MIDPOINT</code>),
     *                                    default <code>LEFT</code>
     * @param {string} [serviceId] optional persistence service ID, if omitted, the default persistence service will be used
     * @returns {(PersistedState | null)} the standard deviation between then and now as {@link items.PersistedState}, or <code>null</code>
     *                            if <code>timestamp</code> is in the future, or if there is no persisted state for the given Item
     *                            at the given <code>timestamp</code>
     */
    deviationSince(timestamp: (time.ZonedDateTime | Date), riemannType?: any, serviceId?: string, ...args: any[]): (PersistedState | null);
    /**
     * Gets the standard deviation of the state of the given Item until a certain point in time.
     *
     * @param {(time.ZonedDateTime | Date)} timestamp the point in time to which to compute the standard deviation
     * @param {RiemannType} [riemannType] optional Riemann approximation type to calculate the integral approximation
     *                                    (<code>LEFT</code>, <code>RIGHT</code>, <code>TRAPEZOIDAL</code>, <code>MIDPOINT</code>),
     *                                    default <code>LEFT</code>
     * @param {string} [serviceId] optional persistence service ID, if omitted, the default persistence service will be used
     * @returns {(PersistedState | null)} the standard deviation between now and then as {@link items.PersistedState}, or <code>null</code>
     *                            if <code>timestamp</code> is in the past, or if there is no persisted state for the given Item
     *                            at the given <code>timestamp</code>
     */
    deviationUntil(timestamp: (time.ZonedDateTime | Date), riemannType?: any, serviceId?: string, ...args: any[]): (PersistedState | null);
    /**
     * Gets the standard deviation of the state of the given Item between two certain points in time.
     *
     * @param {(time.ZonedDateTime | Date)} begin the point in time from which to compute
     * @param {(time.ZonedDateTime | Date)} end the end time for the computation
     * @param {RiemannType} [riemannType] optional Riemann approximation type to calculate the integral approximation
     *                                    (<code>LEFT</code>, <code>RIGHT</code>, <code>TRAPEZOIDAL</code>, <code>MIDPOINT</code>),
     *                                    default <code>LEFT</code>
     * @param {string} [serviceId] optional persistence service ID, if omitted, the default persistence service will be used
     * @returns {(PersistedState | null)} the standard deviation between both points of time as {@link items.PersistedState}, or <code>null</code>
     *                            if <code>begin</code> is after <code>end</code>, or if there is no persisted state for the given Item
     *                            between <code>begin</code> and <code>end</code>
     */
    deviationBetween(begin: (time.ZonedDateTime | Date), end: (time.ZonedDateTime | Date), riemannType?: any, serviceId?: string, ...args: any[]): (PersistedState | null);
    /**
     * Gets the average value of the state of a given Item since a certain point in time.
     *
     * @example
     * var yesterday = time.toZDT().minusDays(1);
     * var item = items.getItem('KitchenDimmer');
     * console.log('KitchenDimmer average since yesterday', item.persistence.averageSince(yesterday));
     *
     * @param {(time.ZonedDateTime | Date)} timestamp the point in time from which to search for the average value
     * @param {RiemannType} [riemannType] optional Riemann approximation type to calculate the integral approximation
     *                                    (<code>LEFT</code>, <code>RIGHT</code>, <code>TRAPEZOIDAL</code>, <code>MIDPOINT</code>),
     *                                    default <code>LEFT</code>
     * @param {string} [serviceId] optional persistence service ID, if omitted, the default persistence service will be used
     * @returns {(PersistedState | null)} the average value since <code>timestamp</code> as {@link items.PersistedState} or <code>null</code> if no previous states could be found
     */
    averageSince(timestamp: (time.ZonedDateTime | Date), riemannType?: any, serviceId?: string, ...args: any[]): (PersistedState | null);
    /**
     * Gets the average value of the state of a given Item until a certain point in time.
     *
     * @param {(time.ZonedDateTime | Date)} timestamp the point in time to which to search for the average value
     * @param {RiemannType} [riemannType] optional Riemann approximation type to calculate the integral approximation
     *                                    (<code>LEFT</code>, <code>RIGHT</code>, <code>TRAPEZOIDAL</code>, <code>MIDPOINT</code>),
     *                                    default <code>LEFT</code>
     * @param {string} [serviceId] optional persistence service ID, if omitted, the default persistence service will be used
     * @returns {(PersistedState | null)} the average value until <code>timestamp</code> as {@link items.PersistedState} or <code>null</code> if no future states could be found
     */
    averageUntil(timestamp: (time.ZonedDateTime | Date), riemannType?: any, serviceId?: string, ...args: any[]): (PersistedState | null);
    /**
     * Gets the average value of the state of a given Item between two certain points in time.
     *
     * @param {(time.ZonedDateTime | Date)} begin the point in time from which to start the average
     * @param {(time.ZonedDateTime | Date)} end the point in time to which to start the average
     * @param {RiemannType} [riemannType] optional Riemann approximation type to calculate the integral approximation
     *                                    (<code>LEFT</code>, <code>RIGHT</code>, <code>TRAPEZOIDAL</code>, <code>MIDPOINT</code>),
     *                                    default <code>LEFT</code>
     * @param {string} [serviceId] optional persistence service ID, if omitted, the default persistence service will be used
     * @returns {(PersistedState | null)} the average value between <code>begin</code> and <code>end</code> as {@link items.PersistedState} or <code>null</code> if no states could be found
     */
    averageBetween(begin: (time.ZonedDateTime | Date), end: (time.ZonedDateTime | Date), riemannType?: any, serviceId?: string, ...args: any[]): (PersistedState | null);
    /**
     * Gets the Riemann sum of the states of a given Item since a certain point in time, time is calculated in seconds.
     *
     * @example
     * var yesterday = time.toZDT().minusDays(1);
     * var item = items.getItem('SolarPower');
     * console.log('Solar energy production since yesterday', item.persistence.riemannSumSince(yesterday));
     *
     * @param {(time.ZonedDateTime | Date)} timestamp the point in time from which to search for the Riemann sum
     * @param {RiemannType} [riemannType] optional Riemann approximation type to calculate the integral approximation
     *                                    (<code>LEFT</code>, <code>RIGHT</code>, <code>TRAPEZOIDAL</code>, <code>MIDPOINT</code>),
     *                                    default <code>LEFT</code>
     * @param {string} [serviceId] optional persistence service ID, if omitted, the default persistence service will be used
     * @returns {(PersistedState | null)} the Riemann sum since <code>timestamp</code> as {@link items.PersistedState} or <code>null</code> if no previous states could be found, time is calculated in seconds
     */
    riemannSumSince(timestamp: (time.ZonedDateTime | Date), riemannType?: any, serviceId?: string, ...args: any[]): (PersistedState | null);
    /**
    * Gets the Riemann sum of the states of a given Item until a certain point in time, time is calculated in seconds.
    *
    * @param {(time.ZonedDateTime | Date)} timestamp the point in time to which to search for the Riemann sum
    * @param {RiemannType} [riemannType] optional Riemann approximation type to calculate the integral approximation
    *                                    (<code>LEFT</code>, <code>RIGHT</code>, <code>TRAPEZOIDAL</code>, <code>MIDPOINT</code>),
    *                                    default <code>LEFT</code>
    * @param {string} [serviceId] optional persistence service ID, if omitted, the default persistence service will be used
    * @returns {(PersistedState | null)} the Riemann sum until <code>timestamp</code> as {@link items.PersistedState} or <code>null</code> if no future states could be found, time is calculated in seconds
    */
    riemannSumUntil(timestamp: (time.ZonedDateTime | Date), riemannType?: any, serviceId?: string, ...args: any[]): (PersistedState | null);
    /**
    * Gets the Riemann sum of the states of a given Item between two certain points in time, time is calculated in seconds.
    *
    * @param {(time.ZonedDateTime | Date)} begin the point in time from which to start the Riemann sum
    * @param {(time.ZonedDateTime | Date)} end the point in time to which to start the Riemann sum
    * @param {RiemannType} [riemannType] optional Riemann approximation type to calculate the integral approximation
    *                                    (<code>LEFT</code>, <code>RIGHT</code>, <code>TRAPEZOIDAL</code>, <code>MIDPOINT</code>),
    *                                    default <code>LEFT</code>
    * @param {string} [serviceId] optional persistence service ID, if omitted, the default persistence service will be used
    * @returns {(PersistedState | null)} the Riemann sum between <code>begin</code> and <code>end</code> as {@link items.PersistedState} or <code>null</code> if no states could be found, time is calculated in seconds
    */
    riemannSumBetween(begin: (time.ZonedDateTime | Date), end: (time.ZonedDateTime | Date), riemannType?: any, serviceId?: string, ...args: any[]): (PersistedState | null);
    /**
     * Gets the median value of the state of a given Item since a certain point in time.
     *
     * @example
     * var yesterday = time.toZDT().minusDays(1);
     * var item = items.getItem('KitchenDimmer');
     * console.log('KitchenDimmer median since yesterday', item.persistence.medianSince(yesterday));
     *
     * @param {(time.ZonedDateTime | Date)} timestamp the point in time from which to search for the median value
     * @param {string} [serviceId] optional persistence service ID, if omitted, the default persistence service will be used
     * @returns {(PersistedState | null)} the median value since <code>timestamp</code> as {@link items.PersistedState} or <code>null</code> if no previous states could be found
     */
    medianSince(timestamp: (time.ZonedDateTime | Date), serviceId?: string, ...args: any[]): (PersistedState | null);
    /**
     * Gets the median value of the state of a given Item until a certain point in time.
     *
     * @param {(time.ZonedDateTime | Date)} timestamp the point in time to which to search for the median value
     * @param {string} [serviceId] optional persistence service ID, if omitted, the default persistence service will be used
     * @returns {(PersistedState | null)} the median value until <code>timestamp</code> as {@link items.PersistedState} or <code>null</code> if no future states could be found
     */
    medianUntil(timestamp: (time.ZonedDateTime | Date), serviceId?: string, ...args: any[]): (PersistedState | null);
    /**
     * Gets the median value of the state of a given Item between two certain points in time.
     *
     * @param {(time.ZonedDateTime | Date)} begin the point in time from which to start the median
     * @param {(time.ZonedDateTime | Date)} end the point in time to which to start the median
     * @param {string} [serviceId] optional persistence service ID, if omitted, the default persistence service will be used
     * @returns {(PersistedState | null)} the median value between <code>begin</code> and <code>end</code> as {@link items.PersistedState} or <code>null</code> if no states could be found
     */
    medianBetween(begin: (time.ZonedDateTime | Date), end: (time.ZonedDateTime | Date), serviceId?: string, ...args: any[]): (PersistedState | null);
    /**
     * Gets the sum of the states of a given Item since a certain point in time.
     *
     * @param {(time.ZonedDateTime | Date)} timestamp the point in time from which to start the summation
     * @param {string} [serviceId] optional persistence service ID, if omitted, the default persistence service will be used
     * @returns {(PersistedState | null)} the sum of the state values since <code>timestamp</code> as {@link items.PersistedState}, or null if <code>timestamp</code> is in the future
     */
    sumSince(timestamp: (time.ZonedDateTime | Date), serviceId?: string, ...args: any[]): (PersistedState | null);
    /**
     * Gets the sum of the states of a given Item until a certain point in time.
     *
     * @param {(time.ZonedDateTime | Date)} timestamp the point in time to which to start the summation
     * @param {string} [serviceId] optional persistence service ID, if omitted, the default persistence service will be used
     * @returns {(PersistedState | null)} the sum of the state values until <code>timestamp</code> as {@link items.PersistedState}, or null if <code>timestamp</code> is in the past
     */
    sumUntil(timestamp: (time.ZonedDateTime | Date), serviceId?: string, ...args: any[]): (PersistedState | null);
    /**
     * Gets the sum of the states of a given Item between two certain points in time.
     *
     * @param {(time.ZonedDateTime | Date)} begin the point in time from which to start the summation
     * @param {(time.ZonedDateTime | Date)} end the point in time to which to start the summation
     * @param {string} [serviceId] optional persistence service ID, if omitted, the default persistence service will be used
     * @returns {(PersistedState | null)} the sum of the state values between the given points in time as {@link items.PersistedState},
     *                            or null if <code>begin</code> is after <code>end</code>
     */
    sumBetween(begin: (time.ZonedDateTime | Date), end: (time.ZonedDateTime | Date), serviceId?: string, ...args: any[]): (PersistedState | null);
    /**
     * Gets the difference value of the state of a given Item since a certain point in time.
     *
     * @param {(time.ZonedDateTime | Date)} timestamp the point in time from which to compute the delta
     * @param {string} [serviceId] optional persistence service ID, if omitted, the default persistence service will be used
     * @returns {(PersistedState | null)} the difference between now and then as {@link items.PersistedState}, or <code>null</code>
     *                            if there is no persisted state for the given Item at the given <code>timestamp</code> available
     */
    deltaSince(timestamp: (time.ZonedDateTime | Date), serviceId?: string, ...args: any[]): (PersistedState | null);
    /**
     * Gets the difference value of the state of a given Item until a certain point in time.
     *
     * @param {(time.ZonedDateTime | Date)} timestamp the point in time to which to compute the delta
     * @param {string} [serviceId] optional persistence service ID, if omitted, the default persistence service will be used
     * @returns {(PersistedState | null)} the difference between then and now as {@link items.PersistedState}, or <code>null</code>
     *                            if there is no persisted state for the given Item at the given <code>timestamp</code> available
     */
    deltaUntil(timestamp: (time.ZonedDateTime | Date), serviceId?: string, ...args: any[]): (PersistedState | null);
    /**
     * Gets the difference value of the state of a given Item between two certain points in time.
     *
     * @param {(time.ZonedDateTime | Date)} begin the beginning point in time
     * @param {(time.ZonedDateTime | Date)} end the end point in time
     * @param {string} [serviceId] optional persistence service ID, if omitted, the default persistence service will be used
     * @returns {(PersistedState | null)} the difference between end and begin as {@link items.PersistedState}, or <code>null</code>
     *                            if there is no persisted state for the given Item for the given points in time
     */
    deltaBetween(begin: (time.ZonedDateTime | Date), end: (time.ZonedDateTime | Date), serviceId?: string, ...args: any[]): (PersistedState | null);
    /**
     * Gets the evolution rate of the state of a given Item since a certain point in time.
     *
     * @param {(time.ZonedDateTime | Date)} timestamp the point in time from which to compute the evolution rate
     * @param {string} [serviceId] optional persistence service ID, if omitted, the default persistence service will be used
     * @returns {(number | null)} the evolution rate in percent (positive and negative) between then and now, or <code>null</code>
     *                            if there is no persisted state for the given Item at the given <code>timestamp</code>,
     *                            or if there is a state, but it is zero (which would cause a divide-by-zero error)
     */
    evolutionRateSince(timestamp: (time.ZonedDateTime | Date), serviceId?: string, ...args: any[]): (number | null);
    /**
     * Gets the evolution rate of the state of a given Item until a certain point in time.
     *
     * @param {(time.ZonedDateTime | Date)} timestamp the point in time to which to compute the evolution rate
     * @param {string} [serviceId] optional persistence service ID, if omitted, the default persistence service will be used
     * @returns {(number | null)} the evolution rate in percent (positive and negative) between then and now, or <code>null</code>
     *                            if there is no persisted state for the given Item at the given <code>timestamp</code>,
     *                            or if there is a state, but it is zero (which would cause a divide-by-zero error)
     */
    evolutionRateUntil(timestamp: (time.ZonedDateTime | Date), serviceId?: string, ...args: any[]): (number | null);
    /**
     * Gets the evolution rate of the state of a given Item between two certain points in time.
     *
     * @param {(time.ZonedDateTime | Date)} begin the beginning point in time
     * @param {(time.ZonedDateTime | Date)} end the end point in time
     * @param {string} [serviceId] optional persistence service ID, if omitted, the default persistence service will be used
     * @returns {(number | null)} the evolution rate in percent (positive and negative) in the given interval, or <code>null</code>
     *                            if there are no persisted states for the given Item at the given interval, or if there is a state,
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
     * Gets the number of available future data points of a given Item until a certain point in time.
     *
     * @param {(time.ZonedDateTime | Date)} timestamp the ending point in time
     * @param {string} [serviceId] optional persistence service ID, if omitted, the default persistence service will be used
     * @returns {number} the number of values persisted for this item, <code>null</code> if <code>timestamp</code> is in the past
     */
    countUntil(timestamp: (time.ZonedDateTime | Date), serviceId?: string, ...args: any[]): number;
    /**
     * Gets the number of available persisted data points of a given Item between two certain points in time.
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
     * Gets the number of changes in future data points of a given Item until a certain point in time.
     *
     * @param {(time.ZonedDateTime | Date)} timestamp the ending point in time
     * @param {string} [serviceId] optional persistence service ID, if omitted, the default persistence service will be used
     * @returns {number} the number of state changes for this item
     */
    countStateChangesUntil(timestamp: (time.ZonedDateTime | Date), serviceId?: string, ...args: any[]): number;
    /**
     * Gets the number of changes in persisted data points of a given Item between two certain points in time.
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
     * @returns {PersistedItem[]} the {@link items.PersistedItem}s since the given point in time
     */
    getAllStatesSince(timestamp: (time.ZonedDateTime | Date), serviceId?: string, ...args: any[]): PersistedItem[];
    /**
     * Retrieves the future Items for a given Item until a certain point in time.
     *
     * @param {(time.ZonedDateTime | Date)} timestamp the point in time to which to retrieve the states
     * @param {string} [serviceId] optional persistence service ID, if omitted, the default persistence service will be used
     * @returns {PersistedItem[]} the future {@link items.PersistedItem}s to the given point in time
     */
    getAllStatesUntil(timestamp: (time.ZonedDateTime | Date), serviceId?: string, ...args: any[]): PersistedItem[];
    /**
     * Retrieves the persisted Items for a given Item between two certain points in time.
     *
     * @param {(time.ZonedDateTime | Date)} begin the point in time from which to retrieve the states
     * @param {(time.ZonedDateTime | Date)} end the point in time to which to retrieve the states
     * @param {string} [serviceId] optional persistence service ID, if omitted, the default persistence service will be used
     * @returns {PersistedItem[]} the historic {@link items.PersistedItem}s between the given points in time,
     */
    getAllStatesBetween(begin: (time.ZonedDateTime | Date), end: (time.ZonedDateTime | Date), serviceId?: string, ...args: any[]): PersistedItem[];
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
     * Removes from persistence the persisted items for a given Item between two certain points in time.
     * This will only have effect if the persistence service is a modifiable persistence service.
     *
     * @param {(time.ZonedDateTime | Date)} begin the point in time from which to remove the states
     * @param {(time.ZonedDateTime | Date)} end the point in time to which to remove the states
     * @param {string} [serviceId] optional persistence service ID, if omitted, the default persistence service will be used
     */
    removeAllStatesBetween(begin: (time.ZonedDateTime | Date), end: (time.ZonedDateTime | Date), serviceId?: string, ...args: any[]): any;
    #private;
}
declare namespace ItemPersistence {
    export { Quantity };
}
declare namespace time {
    type ZonedDateTime = import('@js-joda/core').ZonedDateTime;
    type Instant = import('@js-joda/core').Instant;
}
import time = require("../time");
type Quantity = import('../quantity').Quantity;
declare namespace items {
    type TimeSeries = import("./time-series");
}
declare const TimeSeries: any;
/**
 * Class representing an instance of {@link https://www.openhab.org/javadoc/latest/org/openhab/core/persistence/historicitem org.openhab.core.persistence.HistoricItem}.
 * Extends {@link items.PersistedState}.
 *
 * @extends PersistedState
 * @memberof items
 * @hideconstructor
 */
declare class PersistedItem extends PersistedState {
    rawHistoricItem: any;
    /**
     * Timestamp of persisted Item.
     *
     * Consider using {@link instant} for heavy calculations because it is much faster to work with Instant.
     * @type {time.ZonedDateTime}
     */
    get timestamp(): JSJoda.ZonedDateTime;
    /**
     * Timestamp of the persisted Item as Instant.
     * @returns {time.Instant}
     */
    get instant(): JSJoda.Instant;
}
/**
 * @typedef {import('@js-joda/core').ZonedDateTime} time.ZonedDateTime
 * @private
 */
/**
 * @typedef {import('@js-joda/core').Instant} time.Instant
 * @private
 */
/**
 * @typedef {import('../quantity').Quantity} Quantity
 * @private
 */
/**
 * @typedef {import('../items/items').TimeSeries} items.TimeSeries
 * @private
 */
/**
 * Class representing an instance of {@link https://www.openhab.org/javadoc/latest/org/openhab/core/types/state org.openhab.core.types.State}.
 *
 * @memberof items
 * @hideconstructor
 */
declare class PersistedState {
    /**
     * Create an PersistedState, wrapping a native openHAB HistoricState.
     * @param {*} rawHistoricState an instance of {@link https://www.openhab.org/javadoc/latest/org/openhab/core/types/state org.openhab.core.types.State}
     * @hideconstructor
     */
    constructor(rawHistoricState: any);
    rawState: any;
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
    toString(): string;
}
//# sourceMappingURL=item-persistence.d.ts.map