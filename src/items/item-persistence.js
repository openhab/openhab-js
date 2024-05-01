/**
 * @typedef {import('@js-joda/core').ZonedDateTime} time.ZonedDateTime
 * @private
 */
const time = require('../time');
const utils = require('../utils');
/**
 * @typedef {import('../quantity').Quantity} Quantity
 * @private
 */
const { getQuantity, QuantityError } = require('../quantity');
const PersistenceExtensions = Java.type('org.openhab.core.persistence.extensions.PersistenceExtensions');

/**
 * Class representing an openHAB HistoricItem
 *
 * @memberof items
 * @hideconstructor
 */
class HistoricItem {
  /**
   * @param {*} rawHistoricItem {@link https://www.openhab.org/javadoc/latest/org/openhab/core/persistence/historicitem org.openhab.core.persistence.HistoricItem}
   */
  constructor (rawHistoricItem) {
    this.rawHistoricItem = rawHistoricItem;
    /**
     * Raw Java Item state
     * @type {HostState}
     */
    this.rawState = rawHistoricItem.getState();
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
   * @type {Quantity|null}
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

  /**
   * Timestamp of persisted Item.
   * @type {time.ZonedDateTime}
   */
  get timestamp () {
    return utils.javaZDTToJsZDT(this.rawHistoricItem.getTimestamp());
  }
}

function _ZDTOrNull (result) {
  return result === null ? null : time.ZonedDateTime.parse(result.toString());
}

function _decimalOrNull (result) {
  return result === null ? null : result.toBigDecimal();
}

function _stateOrNull (result) {
  return result === null ? null : result.toString();
}

function _historicItemOrNull (result) {
  if (result === null) return null;
  return new HistoricItem(result);
}

function _javaIterableOfJavaHistoricItemsToJsArrayOfHistoricItems (result) {
  if (result === null) return null;

  const historicItems = [];
  result.forEach((hi) => {
    const historicItem = _historicItemOrNull(hi);
    if (historicItem !== null) historicItems.push(historicItem);
  });
  return historicItems;
}

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
class ItemPersistence {
  constructor (rawItem) {
    this.rawItem = rawItem;
  }

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
  persist (timestamp, state, serviceId) {
    PersistenceExtensions.persist(this.rawItem, ...arguments);
  }

  // TODO: Add persist for TimeSeries

  /**
   * Retrieves the persisted state for a given Item at a certain point in time.
   *
   * @param {(time.ZonedDateTime | Date)} timestamp the point in time for which the persisted item should be retrieved
   * @param {string} [serviceId] optional persistence service ID, if omitted, the default persistence service will be used
   * @returns {(HistoricItem | null)} the persisted item at the given point in time, or <code>null</code> if no persisted item could be found
   */
  persistedState (timestamp, serviceId) {
    return _historicItemOrNull(PersistenceExtensions.persistedState(this.rawItem, ...arguments));
  }

  /**
   * Query the last update time of a given Item.
   *
   * @param {string} [serviceId] optional persistence service ID, if omitted, the default persistence service will be used
   * @returns {(time.ZonedDateTime | null)} point in time of the last historic update to <code>item</code>, or <code>null</code> if there are no historic persisted updates
   */
  lastUpdate (serviceId) {
    return _ZDTOrNull(PersistenceExtensions.lastUpdate(this.rawItem, ...arguments));
  }

  /**
   * Query the next update time of a given Item.
   *
   * @param {string} [serviceId] optional persistence service ID, if omitted, the default persistence service will be used
   * @returns {(time.ZonedDateTime | null)} point in time of the first future update to <code>item</code>, or <code>null</code> if there are no future persisted updates
   */
  nextUpdate (serviceId) {
    return _ZDTOrNull(PersistenceExtensions.nextUpdate(this.rawItem, ...arguments));
  }

  /**
   * Returns the previous state of a given Item.
   *
   * @param {boolean} [skipEqual] optional, if true, skips equal state values and searches the first state not equal the current state
   * @param {string} [serviceId] optional persistence service ID, if omitted, the default persistence service will be used
   * @returns {(HistoricItem | null)} the persisted item at the given point in time, or <code>null</code> if no persisted item could be found or null
   */
  previousState (skipEqual, serviceId) {
    return _historicItemOrNull(PersistenceExtensions.previousState(this.rawItem, ...arguments));
  }

  /**
   * Returns the next state of a given Item.
   *
   * @param {boolean} [skipEqual] optional, if true, skips equal state values and searches the first state not equal the current state
   * @param {string} [serviceId] optional persistence service ID, if omitted, the default persistence service will be used
   * @returns {(HistoricItem | null)} the persisted item at the given point in time, or <code>null</code> if no persisted item could be found or null
   */
  nextState (skipEqual, serviceId) {
    return _historicItemOrNull(PersistenceExtensions.nextState(this.rawItem, ...arguments));
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
   * Checks if the state of a given Item will be updated until a certain point in time.
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
   * @returns {(HistoricItem | null)} a historic item with the maximum state value since the given point in time, a
   *                                  {@link HistoricItem} constructed from the <code>item</code>'s state if <code>item</code>'s state
   *                                  is the maximum value, <code>null</code> if <code>timestamp</code> is in the future
   */
  maximumSince (timestamp, serviceId) {
    return _historicItemOrNull(PersistenceExtensions.maximumSince(this.rawItem, ...arguments));
  }

  /**
   * Gets the historic Item with the maximum value of a given Item until a certain point in time.
   *
   * @param {(time.ZonedDateTime | Date)} timestamp the point in time to end the check
   * @param {string} [serviceId] optional persistence service ID, if omitted, the default persistence service will be used
   * @returns {(HistoricItem | null)} a historic item with the maximum state value until the given point in time, a
   *                                  {@link HistoricItem} constructed from the <code>item</code>'s state if <code>item</code>'s state
   *                                  is the maximum value, <code>null</code> if <code>timestamp</code> is in the past
   */
  maximumUntil (timestamp, serviceId) {
    return _historicItemOrNull(PersistenceExtensions.maximumUntil(this.rawItem, ...arguments));
  }

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
  maximumBetween (begin, end, serviceId) {
    return _historicItemOrNull(PersistenceExtensions.maximumBetween(this.rawItem, ...arguments));
  }

  /**
   * Gets the historic Item with the minimum value of a given Item since a certain point in time.
   *
   * @param {(time.ZonedDateTime | Date)} timestamp the point in time to start the check
   * @param {string} [serviceId] optional persistence service ID, if omitted, the default persistence service will be used
   * @returns {(HistoricItem | null)} a historic item with the minimum state value since the given point in time, a
   *                                  {@link HistoricItem} constructed from the <code>item</code>'s state if <code>item</code>'s state
   *                                  is the maximum value, <code>null</code> if <code>timestamp</code> is in the future
   */
  minimumSince (timestamp, serviceId) {
    return _historicItemOrNull(PersistenceExtensions.minimumSince(this.rawItem, ...arguments));
  }

  /**
   * Gets the historic Item with the minimum value of a given Item until a certain point in time.
   *
   * @param {(time.ZonedDateTime | Date)} timestamp the point in time to end the check
   * @param {string} [serviceId] optional persistence service ID, if omitted, the default persistence service will be used
   * @returns {(HistoricItem | null)} a historic item with the minimum state value until the given point in time, a
   *                                  {@link HistoricItem} constructed from the <code>item</code>'s state if <code>item</code>'s state
   *                                  is the maximum value, <code>null</code> if <code>timestamp</code> is in the past
   */
  minimumUntil (timestamp, serviceId) {
    return _historicItemOrNull(PersistenceExtensions.minimumUntil(this.rawItem, ...arguments));
  }

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
  minimumBetween (begin, end, serviceId) {
    return _historicItemOrNull(PersistenceExtensions.minimumBetween(this.rawItem, ...arguments));
  }

  /**
   * Gets the variance of the state of the given Item since a certain point in time.
   *
   * @param {(time.ZonedDateTime | Date)} timestamp the point in time from which to compute the variance
   * @param {string} [serviceId] optional persistence service ID, if omitted, the default persistence service will be used
   * @returns {(string | null)} the variance between then and now, or <code>null</code> if <code>timestamp</code> is in the future,
   *                            or if there is no persisted state for the given <code>item</code> at the given <code>timestamp</code>
   */
  varianceSince (timestamp, serviceId) {
    return _stateOrNull(PersistenceExtensions.varianceSince(this.rawItem, ...arguments));
  }

  /**
   * Gets the variance of the state of the given Item until a certain point in time.
   *
   * @param {(time.ZonedDateTime | Date)} timestamp the point in time to which to compute the variance
   * @param {string} [serviceId] optional persistence service ID, if omitted, the default persistence service will be used
   * @returns {(string | null)} the variance between now and then, or <code>null</code> if <code>timestamp</code> is in the past,
   *                            or if there is no persisted state for the given <code>item</code> at the given <code>timestamp</code>
   */
  varianceUntil (timestamp, serviceId) {
    return _stateOrNull(PersistenceExtensions.varianceUntil(this.rawItem, ...arguments));
  }

  /**
   * Gets the variance of the state of the given Item between two certain points in time.
   *
   * @param {(time.ZonedDateTime | Date)} begin the point in time from which to compute the variance
   * @param {(time.ZonedDateTime | Date)} end the end time for the computation
   * @param {string} [serviceId] optional persistence service ID, if omitted, the default persistence service will be used
   * @returns {(string | null)} the variance between both points of time, or <code>null</code> if <code>begin</code> is after <code>end</code>,
   *                            or if there is no persisted state for the given <code>item</code> between <code>begin</code> and <code>end</code>
   */
  varianceBetween (begin, end, serviceId) {
    return _stateOrNull(PersistenceExtensions.varianceBetween(this.rawItem, ...arguments));
  }

  /**
   * Gets the standard deviation of the state of the given Item since a certain point in time.
   *
   * @param {(time.ZonedDateTime | Date)} timestamp the point in time from which to compute the standard deviation
   * @param {string} [serviceId] optional persistence service ID, if omitted, the default persistence service will be used
   * @returns {(string | null)} the standard deviation between then and now, or <code>null</code> if <code>timestamp</code> is in the future,
   *                            or if there is no persisted state for the given <code>item</code> at the given <code>timestamp</code>
   */
  deviationSince (timestamp, serviceId) {
    return _stateOrNull(PersistenceExtensions.deviationSince(this.rawItem, ...arguments));
  }

  /**
   * Gets the standard deviation of the state of the given Item until a certain point in time.
   *
   * @param {(time.ZonedDateTime | Date)} timestamp the point in time to which to compute the standard deviation
   * @param {string} [serviceId] optional persistence service ID, if omitted, the default persistence service will be used
   * @returns {(string | null)} the standard deviation between now and then, or <code>null</code> if <code>timestamp</code> is in the past,
   *                            or if there is no persisted state for the given <code>item</code> at the given <code>timestamp</code>
   */
  deviationUntil (timestamp, serviceId) {
    return _stateOrNull(PersistenceExtensions.deviationUntil(this.rawItem, ...arguments));
  }

  /**
   * Gets the standard deviation of the state of the given Item between two certain points in time.
   *
   * @param {(time.ZonedDateTime | Date)} begin the point in time from which to compute
   * @param {(time.ZonedDateTime | Date)} end the end time for the computation
   * @param {string} [serviceId] optional persistence service ID, if omitted, the default persistence service will be used
   * @returns {(string | null)} the standard deviation between both points of time, or <code>null</code> if <code>begin</code> is after
   *                            <code>end</code>, or if there is no persisted state for the given <code>item</code> between <code>begin</code> and <code>end</code>
   */
  deviationBetween (begin, end, serviceId) {
    return _stateOrNull(PersistenceExtensions.deviationBetween(this.rawItem, ...arguments));
  }

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
  averageSince (timestamp, serviceId) {
    return _stateOrNull(PersistenceExtensions.averageSince(this.rawItem, ...arguments));
  }

  /**
   * Gets the average value of the state of a given Item until a certain point in time.
   *
   * @param {(time.ZonedDateTime | Date)} timestamp the point in time to which to search for the average value
   * @param {string} [serviceId] optional persistence service ID, if omitted, the default persistence service will be used
   * @returns {(string | null)} the average value until <code>timestamp</code> or <code>null</code> if no future states could be found
   */
  averageUntil (timestamp, serviceId) {
    return _stateOrNull(PersistenceExtensions.averageUntil(this.rawItem, ...arguments));
  }

  /**
   * Gets the average value of the state of a given Item between two certain points in time.
   *
   * @param {(time.ZonedDateTime | Date)} begin the point in time from which to start the average
   * @param {(time.ZonedDateTime | Date)} end the point in time to which to start the average
   * @param {string} [serviceId] optional persistence service ID, if omitted, the default persistence service will be used
   * @returns {(string | null)} the average value between <code>begin</code> and <code>end</code> or <code>null</code> if no states could be found
   */
  averageBetween (begin, end, serviceId) {
    return _stateOrNull(PersistenceExtensions.averageBetween(this.rawItem, ...arguments));
  }

  /**
   * Gets the sum of the states of a given Item since a certain point in time.
   *
   * @param {(time.ZonedDateTime | Date)} timestamp the point in time from which to start the summation
   * @param {string} [serviceId] optional persistence service ID, if omitted, the default persistence service will be used
   * @returns {(string | null)} the sum of the state values since <code>timestamp</code>, or null if <code>timestamp</code> is in the future
   */
  sumSince (timestamp, serviceId) {
    return _stateOrNull(PersistenceExtensions.sumSince(this.rawItem, ...arguments));
  }

  /**
   * Gets the sum of the states of a given Item until a certain point in time.
   *
   * @param {(time.ZonedDateTime | Date)} timestamp the point in time to which to start the summation
   * @param {string} [serviceId] optional persistence service ID, if omitted, the default persistence service will be used
   * @returns {(string | null)} the sum of the state values until <code>timestamp</code>, or null if <code>timestamp</code> is in the past
   */
  sumUntil (timestamp, serviceId) {
    return _stateOrNull(PersistenceExtensions.sumUntil(this.rawItem, ...arguments));
  }

  /**
   * Gets the sum of the states of a given Item between two certain points in time.
   *
   * @param {(time.ZonedDateTime | Date)} begin the point in time from which to start the summation
   * @param {(time.ZonedDateTime | Date)} end the point in time to which to start the summation
   * @param {string} [serviceId] optional persistence service ID, if omitted, the default persistence service will be used
   * @returns {(string | null)} the sum of the state values between the given points in time, or null if <code>begin</code> is after <code>end</code>
   */
  sumBetween (begin, end, serviceId) {
    return _stateOrNull(PersistenceExtensions.sumBetween(this.rawItem, ...arguments));
  }

  /**
   * Gets the difference value of the state of a given Item since a certain point in time.
   *
   * @param {(time.ZonedDateTime | Date)} timestamp the point in time from which to compute the delta
   * @param {string} [serviceId] optional persistence service ID, if omitted, the default persistence service will be used
   * @returns {(string | null)} the difference between now and then, or <code>null</code> if there is no persisted state for
   *                            the given <code>item</code> at the given <code>timestamp</code> available
   */
  deltaSince (timestamp, serviceId) {
    return _stateOrNull(PersistenceExtensions.deltaSince(this.rawItem, ...arguments));
  }

  /**
   * Gets the difference value of the state of a given Item until a certain point in time.
   *
   * @param {(time.ZonedDateTime | Date)} timestamp the point in time to which to compute the delta
   * @param {string} [serviceId] optional persistence service ID, if omitted, the default persistence service will be used
   * @returns {(string | null)} the difference between then and now, or <code>null</code> if there is no persisted state
   *                            for the given <code>item</code> at the given <code>timestamp</code> available
   */
  deltaUntil (timestamp, serviceId) {
    return _stateOrNull(PersistenceExtensions.deltaUntil(this.rawItem, ...arguments));
  }

  /**
   * Gets the difference value of the state of a given Item between two certain points in time.
   *
   * @param {(time.ZonedDateTime | Date)} begin the beginning point in time
   * @param {(time.ZonedDateTime | Date)} end the end point in time
   * @param {string} [serviceId] optional persistence service ID, if omitted, the default persistence service will be used
   * @returns {(string | null)} the difference between end and begin, or <code>null</code> if there is no persisted state for
   *                            the given <code>item</code> for the given points in time
   */
  deltaBetween (begin, end, serviceId) {
    return _stateOrNull(PersistenceExtensions.deltaBetween(this.rawItem, ...arguments));
  }

  /**
   * Gets the evolution rate of the state of a given Item since a certain point in time.
   *
   * @param {(time.ZonedDateTime | Date)} timestamp the point in time from which to compute the evolution rate
   * @param {string} [serviceId] optional persistence service ID, if omitted, the default persistence service will be used
   * @returns {(number | null)} the evolution rate in percent (positive and negative) between then and now, or <code>null</code>
   *                            if there is no persisted state for the given <code>item</code> at the given <code>timestamp</code>,
   *                            or if there is a state but it is zero (which would cause a divide-by-zero error)
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
   *                            if there is no persisted state for the given <code>item</code> at the given <code>timestamp</code>,
   *                            or if there is a state but it is zero (which would cause a divide-by-zero error)
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
   *                            if there are no persisted states for the given Item at the given interval, or if there is a state #
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
   * Gets the number of available data points of a given Item until a certain point in time.
   *
   * @param {(time.ZonedDateTime | Date)} timestamp the ending point in time
   * @param {string} [serviceId] optional persistence service ID, if omitted, the default persistence service will be used
   * @returns {number} the number of values persisted for this item, <code>null</code> if <code>timestamp</code> is in the past
   */
  countUntil (timestamp, serviceId) {
    return PersistenceExtensions.countUntil(this.rawItem, ...arguments);
  }

  /**
   * Gets the number of available data points of a given Item between two certain points in time.
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
   * Gets the number of changes in data points of a given Item until a certain point in time.
   *
   * @param {(time.ZonedDateTime | Date)} timestamp the ending point in time
   * @param {string} [serviceId] optional persistence service ID, if omitted, the default persistence service will be used
   * @returns {number} the number of state changes for this item
   */
  countStateChangesUntil (timestamp, serviceId) {
    return PersistenceExtensions.countStateChangesUntil(this.rawItem, ...arguments);
  }

  /**
   * Gets the number of changes in data points of a given Item between two certain points in time.
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
   * @returns {HistoricItem[]} the historic items since the given point in time
   */
  getAllStatesSince (timestamp, serviceId) {
    return _javaIterableOfJavaHistoricItemsToJsArrayOfHistoricItems(PersistenceExtensions.getAllStatesSince(this.rawItem, ...arguments));
  }

  /**
   * Retrieves the future Items for a given Item until a certain point in time.
   *
   * @param {(time.ZonedDateTime | Date)} timestamp the point in time to which to retrieve the states
   * @param {string} [serviceId] optional persistence service ID, if omitted, the default persistence service will be used
   * @returns {HistoricItem[]} the future items to the given point in time
   */
  getAllStatesUntil (timestamp, serviceId) {
    return _javaIterableOfJavaHistoricItemsToJsArrayOfHistoricItems(PersistenceExtensions.getAllStatesUntil(this.rawItem, ...arguments));
  }

  /**
   * Retrieves the historic Items for a given Item between two certain points in time.
   *
   * @param {(time.ZonedDateTime | Date)} begin the point in time from which to retrieve the states
   * @param {(time.ZonedDateTime | Date)} end the point in time to which to retrieve the states
   * @param {string} [serviceId] optional persistence service ID, if omitted, the default persistence service will be used
   * @returns {HistoricItem[]} the historic items between the given points in time,
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
   * Removes from persistence the historic items for a given Item between two certain points in time.
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

module.exports = {
  ItemPersistence,
  HistoricItem
};
