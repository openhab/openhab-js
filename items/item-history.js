// const { ZonedDateTime } = require('@js-joda/core');
const time = require('../time');
const PersistenceExtensions = Java.type('org.openhab.core.persistence.extensions.PersistenceExtensions');
const DateTime = Java.type('java.time.ZonedDateTime');

/**
 * Class representing the historic state of an openHAB Item
 *
 *
 * @memberOf items
 * @hideconstructor
 */
class ItemHistory {
  constructor (rawItem) {
    this.rawItem = rawItem;
  }

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
  averageSince (timestamp, serviceId) {
    return this._decimalOrNull(PersistenceExtensions.averageSince(this.rawItem, ...arguments));
  }

  /**
     * Checks if the state of a given item has changed since a certain point in time.
     *
     * @param {(Date | ZoneDateTime)} timestamp
     * @param {string} [serviceId] optional persistance service ID
     * @returns {boolean}
     */
  changedSince (timestamp, serviceId) {
    return PersistenceExtensions.changedSince(this.rawItem, ...arguments);
  }

  /**
     * Gets the difference value of the state of a given item since a certain point in time.
     *
     * @param {(Date | ZoneDateTime)} timestamp
     * @param {string} [serviceId] optional persistance service ID
     * @returns {(Number | null)}
     */
  deltaSince (timestamp, serviceId) {
    return this._decimalOrNull(PersistenceExtensions.deltaSince(this.rawItem, ...arguments));
  }

  /**
     * Gets the standard deviation of the state of the given Item since a certain point in time.
     *
     * @param {(Date | ZoneDateTime)} timestamp
     * @param {string} [serviceId] optional persistance service ID
     * @returns {(Number | null)}
     */
  deviationSince (timestamp, serviceId) {
    return this._decimalOrNull(PersistenceExtensions.deviationSince(this.rawItem, ...arguments));
  }

  /**
     * Gets the evolution rate of the state of a given Item since a certain point in time.
     *
     * @param {(Date | ZoneDateTime)} timestamp
     * @param {string} [serviceId] optional persistance service ID
     * @returns {(Number | null)}
     */
  evolutionRate (timestamp, serviceId) {
    return this._decimalOrNull(PersistenceExtensions.evolutionRate(this.rawItem, ...arguments));
  }

  /**
     * Retrieves the historic item state for a given item at a certain point in time.
     *
     * @param {(Date | ZoneDateTime)} timestamp
     * @param {string} [serviceId] optional persistance service ID
     * @returns {*} state
     */
  historicState (timestamp, serviceId) {
    return this._stateOrNull(PersistenceExtensions.historicState(this.rawItem, ...arguments));
  }

  /**
     * Query the last update time of a given item.
     *
     * @param {string} [serviceId] optional persistance service ID
     * @returns {(ZonedDateTime | null)}
     */
  lastUpdate (serviceId) {
    return this._dateOrNull(PersistenceExtensions.lastUpdate(this.rawItem, ...arguments));
  }

  /**
     * Gets the historic item with the maximum value of the state of a given item since a certain point in time.
     *
     * @param {(Date | ZoneDateTime)} timestamp
     * @param {string} [serviceId] optional persistance service ID
     * @returns {*} state
     */
  maximumSince (timestamp, serviceId) {
    return this._stateOrNull(PersistenceExtensions.maximumSince(this.rawItem, ...arguments));
  }

  /**
     * Gets the historic item with the minimum value of the state of a given item since a certain point in time.
     *
     * @param {(Date | ZoneDateTime)} timestamp
     * @param {string} [serviceId] optional persistance service ID
     * @returns {*} state
     */
  minimumSince (timestamp, serviceId) {
    return this._stateOrNull(PersistenceExtensions.minimumSince(this.rawItem, ...arguments));
  }

  /**
     * Persists the state of a given item
     *
     * @param {string} [serviceId] optional persistance service ID
     */
  persist (serviceId) {
    PersistenceExtensions.persist(this.rawItem, ...arguments);
  }

  /**
     * Returns the previous state of a given item.
     *
     * @param {boolean} [skipEqual] optional, if true, skips equal state values and searches the first state not equal the current state
     * @param {string} [serviceId] optional persistance service ID
     * @returns {*} state
     */
  previousState (skipEqual, serviceId) {
    return this._stateOrNull(PersistenceExtensions.previousState(this.rawItem, ...arguments));
  }

  /**
     * Gets the sum of the state of a given item since a certain point in time.
     *
     * @param {(Date | ZoneDateTime)} timestamp
     * @param {string} [serviceId] optional persistance service ID
     * @returns {(Number | null)}
     */
  sumSince (timestamp, serviceId) {
    return this._decimalOrNull(PersistenceExtensions.sumSince(this.rawItem, ...arguments));
  }

  /**
     * Checks if the state of a given item has been updated since a certain point in time.
     *
     * @param {(Date | ZoneDateTime)} timestamp
     * @param {string} [serviceId] optional persistance service ID
     * @returns {boolean}
     */
  updatedSince (timestamp, serviceId) {
    return PersistenceExtensions.updatedSince(this.rawItem, ...arguments);
  }

  /**
     * Gets the variance of the state of the given Item since a certain point in time.
     *
     * @param {(Date | ZoneDateTime)} timestamp
     * @param {string} [serviceId] optional persistance service ID
     * @returns {*} state
     */
  varianceSince (timestamp, serviceId) {
    return this._stateOrNull(PersistenceExtensions.varianceSince(this.rawItem, ...arguments));
  }

  /**
     * Retrieves the historic item state for a given item at the current point in time.
     * @param {string} [serviceId] optional persistance service ID
     * @returns {*} state
     */
  latestState (serviceId) {
    return this.historicState(DateTime.now(), ...arguments);
  }

  /**
   * @private
   */
  _stateOrNull (result) {
    return result === null ? null : result.state;
  }

  /**
   * @private
   */
  _dateOrNull (result) {
    return result === null ? null : time.ZonedDateTime.parse(result.toString());
  }

  /**
   * @private
   */
  _decimalOrNull (result) {
    return result === null ? null : result.toBigDecimal();
  }
}

module.exports = ItemHistory;
