const log = require('../log')('items.ItemPersistence');
const time = require('../time');
const { getQuantity, QuantityError } = require('../quantity');
const { _toOpenhabPrimitiveType, _isTimeSeries } = require('../helpers');

const PersistenceExtensions = Java.type('org.openhab.core.persistence.extensions.PersistenceExtensions');
const TimeSeries = Java.type('org.openhab.core.types.TimeSeries');
const TypeParser = Java.type('org.openhab.core.types.TypeParser');

let RiemannType = null;
try {
  RiemannType = Java.type('org.openhab.core.persistence.extensions.PersistenceExtensions.RiemannType');
} catch (e) {
  // Ignore TypeError due to missing class on older openHAB versions
  if (!(e instanceof TypeError)) throw e;
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
 * Class representing an instance of {@link https://www.openhab.org/javadoc/latest/org/openhab/core/types/state org.openhab.core.types.State}.
 *
 * @memberof items
 * @hideconstructor
 */
class PersistedState {
  /**
   * Create an PersistedState, wrapping a native openHAB HistoricState.
   * @param {*} rawHistoricState an instance of {@link https://www.openhab.org/javadoc/latest/org/openhab/core/types/state org.openhab.core.types.State}
   * @hideconstructor
   */
  constructor (rawHistoricState) {
    this.rawState = rawHistoricState;
  }

  /**
   * String representation of the Item state.
   * @type {string}
   */
  get state () {
    return this.rawState.toString();
  }

  /**
   * Numeric representation of Item state, or `null` if state is not numeric
   * @type {number|null}
   */
  get numericState () {
    const numericState = parseFloat(this.rawState.toString());
    return isNaN(numericState) ? null : numericState;
  }

  /**
   * Item state as {@link Quantity} or `null` if state is not Quantity-compatible or Quantity would be unit-less (without unit)
   * @type {import('../quantity').Quantity|null}
   */
  get quantityState () {
    try {
      const qty = getQuantity(this.rawState.toString());
      return (qty !== null && qty.symbol !== null) ? qty : null;
    } catch (e) {
      if (e instanceof QuantityError) {
        return null;
      } else {
        throw Error('Failed to create "quantityState": ' + e);
      }
    }
  }

  toString () {
    return `PersistedState (State=${this.state})`;
  }
}

/**
 * Class representing an instance of {@link https://www.openhab.org/javadoc/latest/org/openhab/core/persistence/historicitem org.openhab.core.persistence.HistoricItem}.
 * Extends {@link items.PersistedState}.
 *
 * @extends PersistedState
 * @memberof items
 * @hideconstructor
 */
class PersistedItem extends PersistedState {
  /**
   * Create a PersistedItem, wrapping a native openHAB HistoricItem.
   * @param {*} rawHistoricItem {@link https://www.openhab.org/javadoc/latest/org/openhab/core/persistence/historicitem org.openhab.core.persistence.HistoricItem}
   * @hideconstructor
   */
  constructor (rawHistoricItem) {
    super(rawHistoricItem.getState());
    this.rawHistoricItem = rawHistoricItem;
  }

  /**
   * Timestamp of persisted Item.
   *
   * Consider using {@link instant} for heavy calculations because it is much faster to work with Instant.
   * @type {time.ZonedDateTime}
   */
  get timestamp () {
    return time.javaZDTToJsZDT(this.rawHistoricItem.getTimestamp());
  }

  /**
   * Timestamp of the persisted Item as Instant.
   * @returns {time.Instant}
   */
  get instant () {
    return time.javaInstantToJsInstant(this.rawHistoricItem.getInstant());
  }

  toString () {
    return `PersistedItem (Timestamp=${this.timestamp}, State=${this.state})`;
  }
}

function _ZDTOrNull (result) {
  return result === null ? null : time.javaZDTToJsZDT(result);
}

function _decimalOrNull (result) {
  return result === null ? null : result.toBigDecimal();
}

function _persistedStateOrNull (result) {
  return result === null ? null : new PersistedState(result);
}

function _persistedItemOrNull (result) {
  if (result === null) return null;
  return new PersistedItem(result);
}

function _javaIterableOfJavaHistoricItemsToJsArrayOfHistoricItems (result) {
  if (result === null) return null;

  const historicItems = [];
  result.forEach((hi) => {
    const historicItem = _persistedItemOrNull(hi);
    if (historicItem !== null) historicItems.push(historicItem);
  });
  return historicItems;
}

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
class ItemPersistence {
  constructor (rawItem) {
    this.rawItem = rawItem;
  }

  /**
   * Enum of the Riemann approximation types to calculate the integral approximation.
   *
   * @type {RiemannType}
   */
  static get RiemannType () {
    if (RiemannType === null) {
      log.warn('RiemannType is not available on your openHAB version!');
    }
    return RiemannType;
  }

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
   * @param {string|number|time.ZonedDateTime|import('../quantity').Quantity|HostState} [state] the state to be stored
   * @param {import('../items/items').TimeSeries} [timeSeries] optional TimeSeries to be stored
   * @param {string} [serviceId] optional persistence service ID, if omitted, the default persistence service will be used
   */
  persist (timestamp, state, timeSeries, serviceId) {
    switch (arguments.length) {
      // persist the current state
      case 0:
        this.#persistCurrentState();
        break;
      // persist the current state in a given service or persist a TimeSeries
      case 1:
        if (_isTimeSeries(arguments[0])) {
          this.#persistTimeSeries(arguments[0]);
          break;
        }
        this.#persistCurrentState(arguments[0]);
        break;
      // persist a given state at a given timestamp or persist a TimeSeries in a given service
      case 2:
        if (_isTimeSeries(arguments[0])) {
          this.#persistTimeSeries(arguments[0], arguments[1]);
          break;
        }
        this.#persistGivenState(arguments[0], arguments[1]);
        break;
      // persist a given state at a given timestamp in a given service
      case 3:
        this.#persistGivenState(arguments[0], arguments[1], arguments[2]);
        break;
      // default case
      default:
        PersistenceExtensions.persist(this.rawItem, ...arguments);
        break;
    }
  }

  /**
   * Internal method to persist the current state to a optionally given persistence service.
   * @param {string} [serviceId]
   */
  #persistCurrentState (serviceId) {
    log.debug(`Persisting current state of Item ${this.rawItem.getName()}${serviceId ? ' to ' + serviceId : ''} ...`);
    if (serviceId) {
      PersistenceExtensions.persist(this.rawItem, serviceId);
      return;
    }
    PersistenceExtensions.persist(this.rawItem);
  }

  /**
   * Internal method to persist a given state at a given timestamp to a optionally given persistence service.
   * @param {(time.ZonedDateTime | Date)} timestamp
   * @param {string|number|time.ZonedDateTime|import('../quantity').Quantity|HostState} state
   * @param {string} [serviceId]
   */
  #persistGivenState (timestamp, state, serviceId) {
    if (typeof timestamp !== 'object') throw new TypeError('persist(timestamp, state, serviceId): timestamp must be a ZonedDateTime or Date object!');
    log.debug(`Persisting given state ${state} of Item ${this.rawItem.getName()}${serviceId ? ' to ' + serviceId : ''} ...`);
    if (serviceId) {
      PersistenceExtensions.persist(this.rawItem, timestamp, _toOpenhabPrimitiveType(state), serviceId);
      return;
    }
    PersistenceExtensions.persist(this.rawItem, timestamp, _toOpenhabPrimitiveType(state));
  }

  /**
   * Internal method to persist a given TimeSeries to a optionally given persistence service.
   * @param {import('../items/items').TimeSeries} timeSeries
   * @param {string} [serviceId]
   */
  #persistTimeSeries (timeSeries, serviceId) {
    log.debug(`Persisting TimeSeries for Item ${this.rawItem.getName()}${serviceId ? ' to ' + serviceId : ''} ...`);
    // Get accepted data types of the Item to use the TypeParser
    const acceptedDataTypes = this.rawItem.getAcceptedDataTypes();
    // Create a Java TimeSeries object from the JS TimeSeries
    const ts = new TimeSeries(TimeSeries.Policy.valueOf(timeSeries.policy));
    timeSeries.states.forEach(([timestamp, state]) => {
      ts.add(timestamp, TypeParser.parseState(acceptedDataTypes, _toOpenhabPrimitiveType(state)));
    });
    // Persist the Java TimeSeries
    if (serviceId) {
      PersistenceExtensions.persist(this.rawItem, ts, serviceId);
      return;
    }
    PersistenceExtensions.persist(this.rawItem, ts);
  }

  /**
   * Retrieves the persisted state for a given Item at a certain point in time.
   *
   * @param {(time.ZonedDateTime | Date)} timestamp the point in time for which the persisted item should be retrieved
   * @param {string} [serviceId] optional persistence service ID, if omitted, the default persistence service will be used
   * @returns {(PersistedItem | null)} the {@link items.PersistedItem} at the given point in time, or <code>null</code> if no persisted item could be found
   */
  persistedState (timestamp, serviceId) {
    return _persistedItemOrNull(PersistenceExtensions.persistedState(this.rawItem, ...arguments));
  }

  /**
   * Query the last update time of a given Item.
   *
   * @param {string} [serviceId] optional persistence service ID, if omitted, the default persistence service will be used
   * @returns {(time.ZonedDateTime | null)} point in time of the last historic update to Item, or <code>null</code>
                                            if the current state is different from the last persisted state or there are no historic persisted updates
  */
  lastUpdate (serviceId) {
    return _ZDTOrNull(PersistenceExtensions.lastUpdate(this.rawItem, ...arguments));
  }

  /**
   * Query the next update time of a given Item.
   *
   * @param {string} [serviceId] optional persistence service ID, if omitted, the default persistence service will be used
   * @returns {(time.ZonedDateTime | null)} point in time of the first future update to Item, or <code>null</code> if there are no future persisted updates
   */
  nextUpdate (serviceId) {
    return _ZDTOrNull(PersistenceExtensions.nextUpdate(this.rawItem, ...arguments));
  }

  /**
   * Query the last change time of a given Item.
   *
   * @param {string} [serviceId] optional persistence service ID, if omitted, the default persistence service will be used
   * @returns {(time.ZonedDateTime | null)} point in time of the last historic change to Item, or <code>null</code>
                                            if the current state is different from the last persisted state or there are no historic persisted states
   */
  lastChange (serviceId) {
    return _ZDTOrNull(PersistenceExtensions.lastChange(this.rawItem, ...arguments));
  }

  /**
   * Query the next change time of a given Item.
   *
   * @param {string} [serviceId] optional persistence service ID, if omitted, the default persistence service will be used
   * @returns {(time.ZonedDateTime | null)} point in time of the first future change to Item, or <code>null</code> if there are no future persisted states
   */
  nextChange (serviceId) {
    return _ZDTOrNull(PersistenceExtensions.nextChange(this.rawItem, ...arguments));
  }

  /**
   * Returns the previous state of a given Item.
   *
   * @param {boolean} [skipEqual] optional, if true, skips equal state values and searches the first state not equal the current state
   * @param {string} [serviceId] optional persistence service ID, if omitted, the default persistence service will be used
   * @returns {(PersistedItem | null)} the {@link items.PersistedItem} at the given point in time, or <code>null</code> if no persisted item could be found or null
   */
  previousState (skipEqual, serviceId) {
    return _persistedItemOrNull(PersistenceExtensions.previousState(this.rawItem, ...arguments));
  }

  /**
   * Returns the next state of a given Item.
   *
   * @param {boolean} [skipEqual] optional, if true, skips equal state values and searches the first state not equal the current state
   * @param {string} [serviceId] optional persistence service ID, if omitted, the default persistence service will be used
   * @returns {(PersistedItem | null)} the {@link items.PersistedItem} at the given point in time, or <code>null</code> if no persisted item could be found or null
   */
  nextState (skipEqual, serviceId) {
    return _persistedItemOrNull(PersistenceExtensions.nextState(this.rawItem, ...arguments));
  }

  /**
   * Checks if the state of a given Item has changed since a certain point in time.
   *
   * @param {(time.ZonedDateTime | Date)} timestamp the point in time to start the check
   * @param {string} [serviceId] optional persistence service ID, if omitted, the default persistence service will be used
   * @returns {boolean} <code>true</code> if item state has changed, <code>false</code> if it has not changed,
   *                    <code>null</code> if <code>timestamp</code> is in the future
   */
  changedSince (timestamp, serviceId) {
    return PersistenceExtensions.changedSince(this.rawItem, ...arguments);
  }

  /**
   * Checks if the state of a given Item will change by a certain point in time.
   *
   * @param {(time.ZonedDateTime | Date)} timestamp the point in time to end the check
   * @param {string} [serviceId] optional persistence service ID, if omitted, the default persistence service will be used
   * @returns {boolean} <code>true</code> if item state will change, <code>false</code> if it will not change,
   *                    <code>null</code> if <code>timestamp></code> is in the past
   */
  changedUntil (timestamp, serviceId) {
    return PersistenceExtensions.changedUntil(this.rawItem, ...arguments);
  }

  /**
   * Checks if the state of a given Item has changed between two certain points in time.
   *
   * @param {(time.ZonedDateTime | Date)} begin the point in time to start the check
   * @param {(time.ZonedDateTime | Date)} end the point in time to stop the check
   * @param {string} [serviceId] optional persistence service ID, if omitted, the default persistence service will be used
   * @returns {boolean} <code>true</code> if item state changes, <code>false</code> if the item does not change in the given interval,
   *                    <code>null</code> if <code>begin</code> is after <code>end</code>
   */
  changedBetween (begin, end, serviceId) {
    return PersistenceExtensions.changedBetween(this.rawItem, ...arguments);
  }

  /**
   * Checks if the state of a given Item has been updated since a certain point in time.
   *
   * @param {(time.ZonedDateTime | Date)} timestamp the point in time to start the check
   * @param {string} [serviceId] optional persistence service ID, if omitted, the default persistence service will be used
   * @returns {boolean} <code>true</code> if item state was updated, <code>false</code> if the item has not been updated since <code>timestamp</code>,
   *                    <code>null</code> if <code>timestamp</code> is in the future
   */
  updatedSince (timestamp, serviceId) {
    return PersistenceExtensions.updatedSince(this.rawItem, ...arguments);
  }

  /**
   * Checks if the state of a given Item will have been updated until a certain point in time.
   *
   * @param {(time.ZonedDateTime | Date)} timestamp the point in time to end the check
   * @param {string} [serviceId] optional persistence service ID, if omitted, the default persistence service will be used
   * @returns {boolean} <code>true</code> if item state is updated, <code>false</code> if the item is not updated until <code>timestamp</code>,
   *                    <code>null</code> if <code>timestamp</code> is in the past
   */
  updatedUntil (timestamp, serviceId) {
    return PersistenceExtensions.updatedUntil(this.rawItem, ...arguments);
  }

  /**
   * Checks if the state of a given Item has been updated between two certain points in time.
   *
   * @param {(time.ZonedDateTime | Date)} begin the point in time to start the check
   * @param {(time.ZonedDateTime | Date)} end the point in time to stop the check
   * @param {string} [serviceId] optional persistence service ID, if omitted, the default persistence service will be used
   * @returns {boolean} <code>true</code> if item state was updated, <code>false</code> if the item has not been updated in the given interval,
   *                    <code>null</code> if <code>begin</code> is after <code>end</code>
   */
  updatedBetween (begin, end, serviceId) {
    return PersistenceExtensions.updatedBetween(this.rawItem, ...arguments);
  }

  /**
   * Gets the historic Item with the maximum value of a given Item since a certain point in time.
   *
   * @param {(time.ZonedDateTime | Date)} timestamp the point in time to start the check
   * @param {string} [serviceId] optional persistence service ID, if omitted, the default persistence service will be used
   * @returns {(PersistedItem | null)} a {@link items.PersistedItem} with the maximum state value since the given point in time,
   *                                   or <code>null</code> if <code>timestamp</code> is in the future
   */
  maximumSince (timestamp, serviceId) {
    return _persistedItemOrNull(PersistenceExtensions.maximumSince(this.rawItem, ...arguments));
  }

  /**
   * Gets the future Item with the maximum value of a given Item until a certain point in time.
   *
   * @param {(time.ZonedDateTime | Date)} timestamp the point in time to end the check
   * @param {string} [serviceId] optional persistence service ID, if omitted, the default persistence service will be used
   * @returns {(PersistedItem | null)} a {@link items.PersistedItem}m with the maximum state value until the given point in time,
   *                                   or <code>null</code> if <code>timestamp</code> is in the past
   */
  maximumUntil (timestamp, serviceId) {
    return _persistedItemOrNull(PersistenceExtensions.maximumUntil(this.rawItem, ...arguments));
  }

  /**
   * Gets the persisted Item with the maximum value of a given Item between two certain points in time.
   *
   * @param {(time.ZonedDateTime | Date)} begin the point in time to start the check
   * @param {(time.ZonedDateTime | Date)} end the point in time to stop the check
   * @param {string} [serviceId] optional persistence service ID, if omitted, the default persistence service will be used
   * @returns {(PersistedItem | null)} a {@link items.PersistedItem} with the maximum state value between two points in time,
   *                                   or <code>null</code> if <code>begin</code> is after <code>end</end>
   */
  maximumBetween (begin, end, serviceId) {
    return _persistedItemOrNull(PersistenceExtensions.maximumBetween(this.rawItem, ...arguments));
  }

  /**
   * Gets the historic Item with the minimum value of a given Item since a certain point in time.
   *
   * @param {(time.ZonedDateTime | Date)} timestamp the point in time to start the check
   * @param {string} [serviceId] optional persistence service ID, if omitted, the default persistence service will be used
   * @returns {(PersistedItem | null)} a {@link items.PersistedItem} with the minimum state value since the given point in time,
   *                                   or <code>null</code> if <code>timestamp</code> is in the future
   */
  minimumSince (timestamp, serviceId) {
    return _persistedItemOrNull(PersistenceExtensions.minimumSince(this.rawItem, ...arguments));
  }

  /**
   * Gets the future Item with the minimum value of a given Item until a certain point in time.
   *
   * @param {(time.ZonedDateTime | Date)} timestamp the point in time to end the check
   * @param {string} [serviceId] optional persistence service ID, if omitted, the default persistence service will be used
   * @returns {(PersistedItem | null)} a {@link items.PersistedItem} with the minimum state value until the given point in time,
   *                                   or <code>null</code> if <code>timestamp</code> is in the past
   */
  minimumUntil (timestamp, serviceId) {
    return _persistedItemOrNull(PersistenceExtensions.minimumUntil(this.rawItem, ...arguments));
  }

  /**
   * Gets the state with the minimum value of a given Item between two certain points in time.
   *
   * @param {(time.ZonedDateTime | Date)} begin the point in time to start the check
   * @param {(time.ZonedDateTime | Date)} end the point in time to stop the check
   * @param {string} [serviceId] optional persistence service ID, if omitted, the default persistence service will be used
   * @returns {(PersistedItem | null)} a {@link items.PersistedItem} with the minimum state value between two points in time,
   *                                   or <code>null</code> if <code>begin</code> is after <code>end</end>
   */
  minimumBetween (begin, end, serviceId) {
    return _persistedItemOrNull(PersistenceExtensions.minimumBetween(this.rawItem, ...arguments));
  }

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
  varianceSince (timestamp, riemannType, serviceId) {
    return _persistedStateOrNull(PersistenceExtensions.varianceSince(this.rawItem, ...arguments));
  }

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
  varianceUntil (timestamp, riemannType, serviceId) {
    return _persistedStateOrNull(PersistenceExtensions.varianceUntil(this.rawItem, ...arguments));
  }

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
  varianceBetween (begin, end, riemannType, serviceId) {
    return _persistedStateOrNull(PersistenceExtensions.varianceBetween(this.rawItem, ...arguments));
  }

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
  deviationSince (timestamp, riemannType, serviceId) {
    return _persistedStateOrNull(PersistenceExtensions.deviationSince(this.rawItem, ...arguments));
  }

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
  deviationUntil (timestamp, riemannType, serviceId) {
    return _persistedStateOrNull(PersistenceExtensions.deviationUntil(this.rawItem, ...arguments));
  }

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
  deviationBetween (begin, end, riemannType, serviceId) {
    return _persistedStateOrNull(PersistenceExtensions.deviationBetween(this.rawItem, ...arguments));
  }

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
  averageSince (timestamp, riemannType, serviceId) {
    return _persistedStateOrNull(PersistenceExtensions.averageSince(this.rawItem, ...arguments));
  }

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
  averageUntil (timestamp, riemannType, serviceId) {
    return _persistedStateOrNull(PersistenceExtensions.averageUntil(this.rawItem, ...arguments));
  }

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
  averageBetween (begin, end, riemannType, serviceId) {
    return _persistedStateOrNull(PersistenceExtensions.averageBetween(this.rawItem, ...arguments));
  }

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
  riemannSumSince (timestamp, riemannType, serviceId) {
    return _persistedStateOrNull(PersistenceExtensions.riemannSumSince(this.rawItem, ...arguments));
  }

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
  riemannSumUntil (timestamp, riemannType, serviceId) {
    return _persistedStateOrNull(PersistenceExtensions.riemannSumUntil(this.rawItem, ...arguments));
  }

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
  riemannSumBetween (begin, end, riemannType, serviceId) {
    return _persistedStateOrNull(PersistenceExtensions.riemannSumBetween(this.rawItem, ...arguments));
  }

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
  medianSince (timestamp, serviceId) {
    return _persistedStateOrNull(PersistenceExtensions.medianSince(this.rawItem, ...arguments));
  }

  /**
   * Gets the median value of the state of a given Item until a certain point in time.
   *
   * @param {(time.ZonedDateTime | Date)} timestamp the point in time to which to search for the median value
   * @param {string} [serviceId] optional persistence service ID, if omitted, the default persistence service will be used
   * @returns {(PersistedState | null)} the median value until <code>timestamp</code> as {@link items.PersistedState} or <code>null</code> if no future states could be found
   */
  medianUntil (timestamp, serviceId) {
    return _persistedStateOrNull(PersistenceExtensions.medianUntil(this.rawItem, ...arguments));
  }

  /**
   * Gets the median value of the state of a given Item between two certain points in time.
   *
   * @param {(time.ZonedDateTime | Date)} begin the point in time from which to start the median
   * @param {(time.ZonedDateTime | Date)} end the point in time to which to start the median
   * @param {string} [serviceId] optional persistence service ID, if omitted, the default persistence service will be used
   * @returns {(PersistedState | null)} the median value between <code>begin</code> and <code>end</code> as {@link items.PersistedState} or <code>null</code> if no states could be found
   */
  medianBetween (begin, end, serviceId) {
    return _persistedStateOrNull(PersistenceExtensions.medianBetween(this.rawItem, ...arguments));
  }

  /**
   * Gets the sum of the states of a given Item since a certain point in time.
   *
   * @param {(time.ZonedDateTime | Date)} timestamp the point in time from which to start the summation
   * @param {string} [serviceId] optional persistence service ID, if omitted, the default persistence service will be used
   * @returns {(PersistedState | null)} the sum of the state values since <code>timestamp</code> as {@link items.PersistedState}, or null if <code>timestamp</code> is in the future
   */
  sumSince (timestamp, serviceId) {
    return _persistedStateOrNull(PersistenceExtensions.sumSince(this.rawItem, ...arguments));
  }

  /**
   * Gets the sum of the states of a given Item until a certain point in time.
   *
   * @param {(time.ZonedDateTime | Date)} timestamp the point in time to which to start the summation
   * @param {string} [serviceId] optional persistence service ID, if omitted, the default persistence service will be used
   * @returns {(PersistedState | null)} the sum of the state values until <code>timestamp</code> as {@link items.PersistedState}, or null if <code>timestamp</code> is in the past
   */
  sumUntil (timestamp, serviceId) {
    return _persistedStateOrNull(PersistenceExtensions.sumUntil(this.rawItem, ...arguments));
  }

  /**
   * Gets the sum of the states of a given Item between two certain points in time.
   *
   * @param {(time.ZonedDateTime | Date)} begin the point in time from which to start the summation
   * @param {(time.ZonedDateTime | Date)} end the point in time to which to start the summation
   * @param {string} [serviceId] optional persistence service ID, if omitted, the default persistence service will be used
   * @returns {(PersistedState | null)} the sum of the state values between the given points in time as {@link items.PersistedState},
   *                            or null if <code>begin</code> is after <code>end</code>
   */
  sumBetween (begin, end, serviceId) {
    return _persistedStateOrNull(PersistenceExtensions.sumBetween(this.rawItem, ...arguments));
  }

  /**
   * Gets the difference value of the state of a given Item since a certain point in time.
   *
   * @param {(time.ZonedDateTime | Date)} timestamp the point in time from which to compute the delta
   * @param {string} [serviceId] optional persistence service ID, if omitted, the default persistence service will be used
   * @returns {(PersistedState | null)} the difference between now and then as {@link items.PersistedState}, or <code>null</code>
   *                            if there is no persisted state for the given Item at the given <code>timestamp</code> available
   */
  deltaSince (timestamp, serviceId) {
    return _persistedStateOrNull(PersistenceExtensions.deltaSince(this.rawItem, ...arguments));
  }

  /**
   * Gets the difference value of the state of a given Item until a certain point in time.
   *
   * @param {(time.ZonedDateTime | Date)} timestamp the point in time to which to compute the delta
   * @param {string} [serviceId] optional persistence service ID, if omitted, the default persistence service will be used
   * @returns {(PersistedState | null)} the difference between then and now as {@link items.PersistedState}, or <code>null</code>
   *                            if there is no persisted state for the given Item at the given <code>timestamp</code> available
   */
  deltaUntil (timestamp, serviceId) {
    return _persistedStateOrNull(PersistenceExtensions.deltaUntil(this.rawItem, ...arguments));
  }

  /**
   * Gets the difference value of the state of a given Item between two certain points in time.
   *
   * @param {(time.ZonedDateTime | Date)} begin the beginning point in time
   * @param {(time.ZonedDateTime | Date)} end the end point in time
   * @param {string} [serviceId] optional persistence service ID, if omitted, the default persistence service will be used
   * @returns {(PersistedState | null)} the difference between end and begin as {@link items.PersistedState}, or <code>null</code>
   *                            if there is no persisted state for the given Item for the given points in time
   */
  deltaBetween (begin, end, serviceId) {
    return _persistedStateOrNull(PersistenceExtensions.deltaBetween(this.rawItem, ...arguments));
  }

  /**
   * Gets the evolution rate of the state of a given Item since a certain point in time.
   *
   * @param {(time.ZonedDateTime | Date)} timestamp the point in time from which to compute the evolution rate
   * @param {string} [serviceId] optional persistence service ID, if omitted, the default persistence service will be used
   * @returns {(number | null)} the evolution rate in percent (positive and negative) between then and now, or <code>null</code>
   *                            if there is no persisted state for the given Item at the given <code>timestamp</code>,
   *                            or if there is a state, but it is zero (which would cause a divide-by-zero error)
   */
  evolutionRateSince (timestamp, serviceId) {
    return _decimalOrNull(PersistenceExtensions.evolutionRateSince(this.rawItem, ...arguments));
  }

  /**
   * Gets the evolution rate of the state of a given Item until a certain point in time.
   *
   * @param {(time.ZonedDateTime | Date)} timestamp the point in time to which to compute the evolution rate
   * @param {string} [serviceId] optional persistence service ID, if omitted, the default persistence service will be used
   * @returns {(number | null)} the evolution rate in percent (positive and negative) between then and now, or <code>null</code>
   *                            if there is no persisted state for the given Item at the given <code>timestamp</code>,
   *                            or if there is a state, but it is zero (which would cause a divide-by-zero error)
   */
  evolutionRateUntil (timestamp, serviceId) {
    return _decimalOrNull(PersistenceExtensions.evolutionRateUntil(this.rawItem, ...arguments));
  }

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
  evolutionRateBetween (begin, end, serviceId) {
    return _decimalOrNull(PersistenceExtensions.evolutionRateBetween(this.rawItem, ...arguments));
  }

  /**
   * Gets the number of available historic data points of a given Item since a certain point in time.
   *
   * @param {(time.ZonedDateTime | Date)} timestamp the beginning point in time
   * @param {string} [serviceId] optional persistence service ID, if omitted, the default persistence service will be used
   * @returns {number} the number of values persisted for this item, <code>null</code> if <code>timestamp</code> is in the future
   */
  countSince (timestamp, serviceId) {
    return PersistenceExtensions.countSince(this.rawItem, ...arguments);
  }

  /**
   * Gets the number of available future data points of a given Item until a certain point in time.
   *
   * @param {(time.ZonedDateTime | Date)} timestamp the ending point in time
   * @param {string} [serviceId] optional persistence service ID, if omitted, the default persistence service will be used
   * @returns {number} the number of values persisted for this item, <code>null</code> if <code>timestamp</code> is in the past
   */
  countUntil (timestamp, serviceId) {
    return PersistenceExtensions.countUntil(this.rawItem, ...arguments);
  }

  /**
   * Gets the number of available persisted data points of a given Item between two certain points in time.
   *
   * @param {(time.ZonedDateTime | Date)} begin the beginning point in time
   * @param {(time.ZonedDateTime | Date)} end the end point in time
   * @param {string} [serviceId] optional persistence service ID, if omitted, the default persistence service will be used
   * @returns {number} the number of values persisted for this item, <code>null</code> if <code>begin</code> is after <code>end</code>
   */
  countBetween (begin, end, serviceId) {
    return PersistenceExtensions.countBetween(this.rawItem, ...arguments);
  }

  /**
   * Gets the number of changes in historic data points of a given Item since a certain point in time.
   *
   * @param {(time.ZonedDateTime | Date)} timestamp the beginning point in time
   * @param {string} [serviceId] optional persistence service ID, if omitted, the default persistence service will be used
   * @returns {number} the number of state changes for this item
   */
  countStateChangesSince (timestamp, serviceId) {
    return PersistenceExtensions.countStateChangesSince(this.rawItem, ...arguments);
  }

  /**
   * Gets the number of changes in future data points of a given Item until a certain point in time.
   *
   * @param {(time.ZonedDateTime | Date)} timestamp the ending point in time
   * @param {string} [serviceId] optional persistence service ID, if omitted, the default persistence service will be used
   * @returns {number} the number of state changes for this item
   */
  countStateChangesUntil (timestamp, serviceId) {
    return PersistenceExtensions.countStateChangesUntil(this.rawItem, ...arguments);
  }

  /**
   * Gets the number of changes in persisted data points of a given Item between two certain points in time.
   *
   * @param {(time.ZonedDateTime | Date)} begin the beginning point in time
   * @param {(time.ZonedDateTime | Date)} end the end point in time
   * @param {string} [serviceId] optional persistence service ID, if omitted, the default persistence service will be used
   * @returns {number} the number of state changes for this item
   */
  countStateChangesBetween (begin, end, serviceId) {
    return PersistenceExtensions.countStateChangesBetween(this.rawItem, ...arguments);
  }

  /**
   * Retrieves the historic Items for a given Item since a certain point in time.
   *
   * @param {(time.ZonedDateTime | Date)} timestamp the point in time from which to retrieve the states
   * @param {string} [serviceId] optional persistence service ID, if omitted, the default persistence service will be used
   * @returns {PersistedItem[]} the {@link items.PersistedItem}s since the given point in time
   */
  getAllStatesSince (timestamp, serviceId) {
    return _javaIterableOfJavaHistoricItemsToJsArrayOfHistoricItems(PersistenceExtensions.getAllStatesSince(this.rawItem, ...arguments));
  }

  /**
   * Retrieves the future Items for a given Item until a certain point in time.
   *
   * @param {(time.ZonedDateTime | Date)} timestamp the point in time to which to retrieve the states
   * @param {string} [serviceId] optional persistence service ID, if omitted, the default persistence service will be used
   * @returns {PersistedItem[]} the future {@link items.PersistedItem}s to the given point in time
   */
  getAllStatesUntil (timestamp, serviceId) {
    return _javaIterableOfJavaHistoricItemsToJsArrayOfHistoricItems(PersistenceExtensions.getAllStatesUntil(this.rawItem, ...arguments));
  }

  /**
   * Retrieves the persisted Items for a given Item between two certain points in time.
   *
   * @param {(time.ZonedDateTime | Date)} begin the point in time from which to retrieve the states
   * @param {(time.ZonedDateTime | Date)} end the point in time to which to retrieve the states
   * @param {string} [serviceId] optional persistence service ID, if omitted, the default persistence service will be used
   * @returns {PersistedItem[]} the historic {@link items.PersistedItem}s between the given points in time,
   */
  getAllStatesBetween (begin, end, serviceId) {
    return _javaIterableOfJavaHistoricItemsToJsArrayOfHistoricItems(PersistenceExtensions.getAllStatesBetween(this.rawItem, ...arguments));
  }

  /**
   * Removes from persistence the historic items for a given Item since a certain point in time.
   * This will only have effect if the persistence service is a modifiable persistence service.
   *
   * @param {(time.ZonedDateTime | Date)} timestamp the point in time from which to remove the states
   * @param {string} [serviceId] optional persistence service ID, if omitted, the default persistence service will be used
   */
  removeAllStatesSince (timestamp, serviceId) {
    return PersistenceExtensions.removeAllStatesSince(this.rawItem, ...arguments);
  }

  /**
   * Removes from persistence the future items for a given Item until a certain point in time.
   * This will only have effect if the persistence service is a modifiable persistence service.
   *
   * @param {(time.ZonedDateTime | Date)} timestamp the point in time to which to remove the states
   * @param {string} [serviceId] optional persistence service ID, if omitted, the default persistence service will be used
   */
  removeAllStatesUntil (timestamp, serviceId) {
    return PersistenceExtensions.removeAllStatesUntil(this.rawItem, ...arguments);
  }

  /**
   * Removes from persistence the persisted items for a given Item between two certain points in time.
   * This will only have effect if the persistence service is a modifiable persistence service.
   *
   * @param {(time.ZonedDateTime | Date)} begin the point in time from which to remove the states
   * @param {(time.ZonedDateTime | Date)} end the point in time to which to remove the states
   * @param {string} [serviceId] optional persistence service ID, if omitted, the default persistence service will be used
   */
  removeAllStatesBetween (begin, end, serviceId) {
    return PersistenceExtensions.removeAllStatesBetween(this.rawItem, ...arguments);
  }
}

module.exports = ItemPersistence;
