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
 * @memberOf items
 * @hideconstructor
 */
class ItemHistory {
  constructor (rawItem) {
    this.rawItem = rawItem;
  }

  /**
   * Gets the average value of the state of a given Item between two certain points in time.
   *
   * @param {(time.ZonedDateTime | Date)} begin begin
   * @param {(time.ZonedDateTime | Date)} end end
   * @param {string} [serviceId] Optional persistence service ID, if omitted, the default persistence service will be used.
   * @returns {(number | null)}
   */
  averageBetween (begin, end, serviceId) {
    return _decimalOrNull(PersistenceExtensions.averageBetween(this.rawItem, ...arguments));
  }

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
  averageSince (timestamp, serviceId) {
    return _decimalOrNull(PersistenceExtensions.averageSince(this.rawItem, ...arguments));
  }

  /**
   * Checks if the state of a given Item has changed between two certain points in time.
   *
   * @param {(time.ZonedDateTime | Date)} begin begin
   * @param {(time.ZonedDateTime | Date)} end end
   * @param {string} [serviceId] Optional persistence service ID, if omitted, the default persistence service will be used.
   * @returns {boolean}
   */
  changedBetween (begin, end, serviceId) {
    return PersistenceExtensions.changedBetween(this.rawItem, ...arguments);
  }

  /**
   * Checks if the state of a given Item has changed since a certain point in time.
   *
   * @param {(time.ZonedDateTime | Date)} timestamp
   * @param {string} [serviceId] Optional persistence service ID, if omitted, the default persistence service will be used.
   * @returns {boolean}
   */
  changedSince (timestamp, serviceId) {
    return PersistenceExtensions.changedSince(this.rawItem, ...arguments);
  }

  /**
   * Gets the number of available historic data points of a given Item between two certain points in time.
   *
   * @param {(time.ZonedDateTime | Date)} begin begin
   * @param {(time.ZonedDateTime | Date)} end end
   * @param {string} [serviceId] Optional persistence service ID, if omitted, the default persistence service will be used.
   * @returns {number}
   */
  countBetween (begin, end, serviceId) {
    return PersistenceExtensions.countBetween(this.rawItem, ...arguments);
  }

  /**
   * Gets the number of available historic data points of a given Item since a certain point in time.
   *
   * @param {(time.ZonedDateTime | Date)} timestamp
   * @param {string} [serviceId] Optional persistence service ID, if omitted, the default persistence service will be used.
   * @returns {number}
   */
  countSince (timestamp, serviceId) {
    return PersistenceExtensions.countSince(this.rawItem, ...arguments);
  }

  /**
   * Gets the number of changes in historic data points of a given Item between two certain points in time.
   *
   * @param {(time.ZonedDateTime | Date)} begin begin
   * @param {(time.ZonedDateTime | Date)} end end
   * @param {string} [serviceId] Optional persistence service ID, if omitted, the default persistence service will be used.
   * @returns {number}
   */
  countStateChangesBetween (begin, end, serviceId) {
    return PersistenceExtensions.countStateChangesBetween(this.rawItem, ...arguments);
  }

  /**
   * Gets the number of changes in historic data points of a given Item since a certain point in time.
   *
   * @param {(time.ZonedDateTime | Date)} timestamp
   * @param {string} [serviceId] Optional persistence service ID, if omitted, the default persistence service will be used.
   * @returns {number}
   */
  countStateChangesSince (timestamp, serviceId) {
    return PersistenceExtensions.countStateChangesSince(this.rawItem, ...arguments);
  }

  /**
   * Gets the difference value of the state of a given Item between two certain points in time.
   *
   * @param {(time.ZonedDateTime | Date)} begin begin
   * @param {(time.ZonedDateTime | Date)} end end
   * @param {string} [serviceId] Optional persistence service ID, if omitted, the default persistence service will be used.
   * @returns {(number | null)}
   */
  deltaBetween (begin, end, serviceId) {
    return _decimalOrNull(PersistenceExtensions.deltaBetween(this.rawItem, ...arguments));
  }

  /**
   * Gets the difference value of the state of a given Item since a certain point in time.
   *
   * @param {(time.ZonedDateTime | Date)} timestamp
   * @param {string} [serviceId] Optional persistence service ID, if omitted, the default persistence service will be used.
   * @returns {(number | null)}
   */
  deltaSince (timestamp, serviceId) {
    return _decimalOrNull(PersistenceExtensions.deltaSince(this.rawItem, ...arguments));
  }

  /**
   * Gets the standard deviation of the state of the given Item between two certain points in time.
   *
   * @param {(time.ZonedDateTime | Date)} begin begin
   * @param {(time.ZonedDateTime | Date)} end end
   * @param {string} [serviceId] Optional persistence service ID, if omitted, the default persistence service will be used.
   * @returns {(number | null)}
   */
  deviationBetween (begin, end, serviceId) {
    return _decimalOrNull(PersistenceExtensions.deviationBetween(this.rawItem, ...arguments));
  }

  /**
   * Gets the standard deviation of the state of the given Item since a certain point in time.
   *
   * @param {(time.ZonedDateTime | Date)} timestamp
   * @param {string} [serviceId] Optional persistence service ID, if omitted, the default persistence service will be used.
   * @returns {(number | null)}
   */
  deviationSince (timestamp, serviceId) {
    return _decimalOrNull(PersistenceExtensions.deviationSince(this.rawItem, ...arguments));
  }

  /**
   * Gets the evolution rate of the state of a given Item since a certain point in time.
   *
   * @deprecated Replaced by evolutionRateSince and evolutionRateBetween.
   * @param {(time.ZonedDateTime | Date)} timestamp
   * @param {string} [serviceId] Optional persistence service ID, if omitted, the default persistence service will be used.
   * @returns {(number | null)}
   */
  evolutionRate (timestamp, serviceId) {
    console.warn('"evolutionRate" is deprecated and will be removed in the future. Use "evolutionRateSince" instead.');
    return _decimalOrNull(PersistenceExtensions.evolutionRate(this.rawItem, ...arguments));
  }

  /**
   * Gets the evolution rate of the state of a given Item between two certain points in time.
   *
   * @param {(time.ZonedDateTime | Date)} begin begin
   * @param {(time.ZonedDateTime | Date)} end end
   * @param {string} [serviceId] Optional persistence service ID, if omitted, the default persistence service will be used.
   * @returns {(number | null)}
   */
  evolutionRateBetween (begin, end, serviceId) {
    return _decimalOrNull(PersistenceExtensions.evolutionRate(this.rawItem, ...arguments));
  }

  /**
   * Gets the evolution rate of the state of a given Item since a certain point in time.
   *
   * @param {(time.ZonedDateTime | Date)} timestamp
   * @param {string} [serviceId] Optional persistence service ID, if omitted, the default persistence service will be used.
   * @returns {(number | null)}
   */
  evolutionRateSince (timestamp, serviceId) {
    return _decimalOrNull(PersistenceExtensions.evolutionRate(this.rawItem, ...arguments));
  }

  /**
   * Retrieves the {@link HistoricItems} for for a given Item between two certain points in time.
   *
   * @param {(time.ZonedDateTime | Date)} begin begin
   * @param {(time.ZonedDateTime | Date)} end end
   * @param {string} [serviceId] Optional persistence service ID, if omitted, the default persistence service will be used.
   * @returns {HistoricItem[]}
   */
  getAllStatesBetween (begin, end, serviceId) {
    return _javaIterableOfJavaHistoricItemsToJsArrayOfHistoricItems(PersistenceExtensions.getAllStatesBetween(this.rawItem, ...arguments));
  }

  /**
   * Retrieves the {@link HistoricItems} for for a given Item since a certain point in time.
   *
   * @param {(time.ZonedDateTime | Date)} timestamp
   * @param {string} [serviceId] Optional persistence service ID, if omitted, the default persistence service will be used.
   * @returns {HistoricItem[]}
   */
  getAllStatesSince (timestamp, serviceId) {
    return _javaIterableOfJavaHistoricItemsToJsArrayOfHistoricItems(PersistenceExtensions.getAllStatesSince(this.rawItem, ...arguments));
  }

  /**
   * Retrieves the historic state for a given Item at a certain point in time.
   *
   * @param {(time.ZonedDateTime | Date)} timestamp
   * @param {string} [serviceId] Optional persistence service ID, if omitted, the default persistence service will be used.
   * @returns {(HistoricItem | null)} historic item
   */
  historicState (timestamp, serviceId) {
    return _historicItemOrNull(PersistenceExtensions.historicState(this.rawItem, ...arguments));
  }

  /**
   * Query the last update time of a given Item.
   *
   * @param {string} [serviceId] Optional persistence service ID, if omitted, the default persistence service will be used.
   * @returns {(time.ZonedDateTime | null)}
   */
  lastUpdate (serviceId) {
    return _ZDTOrNull(PersistenceExtensions.lastUpdate(this.rawItem, ...arguments));
  }

  /**
   * Retrieves the historic Item state for a given Item at the current point in time.
   *
   * @param {string} [serviceId] Optional persistence service ID, if omitted, the default persistence service will be used.
   * @returns {(string | null)} state
   */
  latestState (serviceId) {
    const result = this.historicState(time.ZonedDateTime.now(), ...arguments);
    return (result === null) ? null : result.state;
  }

  /**
   * Gets the state with the maximum value of a given Item between two certain points in time.
   *
   * @param {(time.ZonedDateTime | Date)} begin begin
   * @param {(time.ZonedDateTime | Date)} end end
   * @param {string} [serviceId] Optional persistence service ID, if omitted, the default persistence service will be used.
   * @returns {(HistoricItem | null)} historic item or null
   */
  maximumBetween (begin, end, serviceId) {
    return _historicItemOrNull(PersistenceExtensions.maximumBetween(this.rawItem, ...arguments));
  }

  /**
   * Gets the state with the maximum value of a given Item since a certain point in time.
   *
   * @param {(time.ZonedDateTime | Date)} timestamp
   * @param {string} [serviceId] Optional persistence service ID, if omitted, the default persistence service will be used.
   * @returns {(HistoricItem | null)} historic item or null
   */
  maximumSince (timestamp, serviceId) {
    return _historicItemOrNull(PersistenceExtensions.maximumSince(this.rawItem, ...arguments));
  }

  /**
   * Gets the state with the minimum value of a given Item between two certain points in time.
   *
   * @param {(time.ZonedDateTime | Date)} begin begin
   * @param {(time.ZonedDateTime | Date)} end end
   * @param {string} [serviceId] Optional persistence service ID, if omitted, the default persistence service will be used.
   * @returns {(HistoricItem | null)} historic item or null
   */
  minimumBetween (begin, end, serviceId) {
    return _historicItemOrNull(PersistenceExtensions.minimumBetween(this.rawItem, ...arguments));
  }

  /**
   * Gets the state with the minimum value of a given Item since a certain point in time.
   *
   * @param {(time.ZonedDateTime | Date)} timestamp
   * @param {string} [serviceId] Optional persistence service ID, if omitted, the default persistence service will be used.
   * @returns {(HistoricItem | null)} historic item or null
   */
  minimumSince (timestamp, serviceId) {
    return _historicItemOrNull(PersistenceExtensions.minimumSince(this.rawItem, ...arguments));
  }

  /**
   * Persists the state of a given Item.
   *
   * @param {string} [serviceId] Optional persistence service ID, if omitted, the default persistence service will be used.
   */
  persist (serviceId) {
    PersistenceExtensions.persist(this.rawItem, ...arguments);
  }

  /**
   * Returns the previous state of a given Item.
   *
   * @param {boolean} [skipEqual] optional, if true, skips equal state values and searches the first state not equal the current state
   * @param {string} [serviceId] Optional persistence service ID, if omitted, the default persistence service will be used.
   * @returns {(HistoricItem | null)} historic item or null
   */
  previousState (skipEqual, serviceId) {
    return _historicItemOrNull(PersistenceExtensions.previousState(this.rawItem, ...arguments));
  }

  /**
   * Gets the sum of the states of a given Item between two certain points in time.
   *
   * @param {(time.ZonedDateTime | Date)} begin begin
   * @param {(time.ZonedDateTime | Date)} end end
   * @param {string} [serviceId] Optional persistence service ID, if omitted, the default persistence service will be used.
   * @returns {(number | null)}
   */
  sumBetween (begin, end, serviceId) {
    return _decimalOrNull(PersistenceExtensions.sumBetween(this.rawItem, ...arguments));
  }

  /**
   * Gets the sum of the states of a given Item since a certain point in time.
   *
   * @param {(time.ZonedDateTime | Date)} timestamp
   * @param {string} [serviceId] Optional persistence service ID, if omitted, the default persistence service will be used.
   * @returns {(number | null)}
   */
  sumSince (timestamp, serviceId) {
    return _decimalOrNull(PersistenceExtensions.sumSince(this.rawItem, ...arguments));
  }

  /**
   * Checks if the state of a given Item has been updated between two certain points in time.
   *
   * @param {(time.ZonedDateTime | Date)} begin begin
   * @param {(time.ZonedDateTime | Date)} end end
   * @param {string} [serviceId] Optional persistence service ID, if omitted, the default persistence service will be used.
   * @returns {boolean}
   */
  updatedBetween (begin, end, serviceId) {
    return PersistenceExtensions.updatedBetween(this.rawItem, ...arguments);
  }

  /**
   * Checks if the state of a given Item has been updated since a certain point in time.
   *
   * @param {(time.ZonedDateTime | Date)} timestamp
   * @param {string} [serviceId] Optional persistence service ID, if omitted, the default persistence service will be used.
   * @returns {boolean}
   */
  updatedSince (timestamp, serviceId) {
    return PersistenceExtensions.updatedSince(this.rawItem, ...arguments);
  }

  /**
   * Gets the variance of the state of the given Item between two certain points in time.
   *
   * @param {(time.ZonedDateTime | Date)} begin begin
   * @param {(time.ZonedDateTime | Date)} end end
   * @param {string} [serviceId] Optional persistence service ID, if omitted, the default persistence service will be used.
   * @returns {(number | null)}
   */
  varianceBetween (begin, end, serviceId) {
    return _decimalOrNull(PersistenceExtensions.varianceBetween(this.rawItem, ...arguments));
  }

  /**
   * Gets the variance of the state of the given Item since a certain point in time.
   *
   * @param {(time.ZonedDateTime | Date)} timestamp
   * @param {string} [serviceId] Optional persistence service ID, if omitted, the default persistence service will be used.
   * @returns {(number | null)}
   */
  varianceSince (timestamp, serviceId) {
    return _decimalOrNull(PersistenceExtensions.varianceSince(this.rawItem, ...arguments));
  }
}

module.exports = {
  ItemHistory,
  HistoricItem
};
