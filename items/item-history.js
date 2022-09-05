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
   * Gets the average value of the state of a given Item between two certain points in time.
   *
   * @param {ZoneDateTime} begin begin
   * @param {ZoneDateTime} end end
   * @param {string} [serviceId] optional persistance service ID
   * @returns {(number | null)}
   */
  averageBetween (begin, end, serviceId) {
    return this._decimalOrNull(PersistenceExtensions.averageBetween(this.rawItem, ...arguments));
  }

  /**
     * Gets the average value of the state of a given Item since a certain point in time.
     *
     * @param {ZoneDateTime} timestamp
     * @param {string} [serviceId] optional persistance service ID
     * @returns {(number | null)}
     */
  averageSince (timestamp, serviceId) {
    return this._decimalOrNull(PersistenceExtensions.averageSince(this.rawItem, ...arguments));
  }

  /**
   * Checks if the state of a given Item has changed between two certain points in time.
   *
   * @param {ZoneDateTime} begin begin
   * @param {ZoneDateTime} end end
   * @param {string} [serviceId] optional persistance service ID
   * @returns {boolean}
   */
  changedBetween (begin, end, serviceId) {
    return PersistenceExtensions.changedBetween(this.rawItem, ...arguments);
  }

  /**
     * Checks if the state of a given Item has changed since a certain point in time.
     *
     * @param {ZoneDateTime} timestamp
     * @param {string} [serviceId] optional persistance service ID
     * @returns {boolean}
     */
  changedSince (timestamp, serviceId) {
    return PersistenceExtensions.changedSince(this.rawItem, ...arguments);
  }

  /**
   * Gets the difference value of the state of a given Item between two certain points in time.
   *
   * @param {ZoneDateTime} begin begin
   * @param {ZoneDateTime} end end
   * @param {string} [serviceId] optional persistance service ID
   * @returns {(number | null)}
   */
  deltaBetween (begin, end, serviceId) {
    return this._decimalOrNull(PersistenceExtensions.deltaBetween(this.rawItem, ...arguments));
  }

  /**
     * Gets the difference value of the state of a given Item since a certain point in time.
     *
     * @param {ZoneDateTime} timestamp
     * @param {string} [serviceId] optional persistance service ID
     * @returns {(number | null)}
     */
  deltaSince (timestamp, serviceId) {
    return this._decimalOrNull(PersistenceExtensions.deltaSince(this.rawItem, ...arguments));
  }

  /**
   * Gets the standard deviation of the state of the given Item between two certain points in time.
   *
   * @param {ZoneDateTime} begin begin
   * @param {ZoneDateTime} end end
   * @param {string} [serviceId] optional persistance service ID
   * @returns {(number | null)}
   */
  deviationBetween (begin, end, serviceId) {
    return this._decimalOrNull(PersistenceExtensions.deviationBetween(this.rawItem, ...arguments));
  }

  /**
     * Gets the standard deviation of the state of the given Item since a certain point in time.
     *
     * @param {ZoneDateTime} timestamp
     * @param {string} [serviceId] optional persistance service ID
     * @returns {(number | null)}
     */
  deviationSince (timestamp, serviceId) {
    return this._decimalOrNull(PersistenceExtensions.deviationSince(this.rawItem, ...arguments));
  }

  /**
     * Gets the evolution rate of the state of a given Item since a certain point in time.
     *
     * @param {ZoneDateTime} timestamp
     * @param {string} [serviceId] optional persistance service ID
     * @returns {(number | null)}
     */
  evolutionRate (timestamp, serviceId) {
    return this._decimalOrNull(PersistenceExtensions.evolutionRate(this.rawItem, ...arguments));
  }

  /**
     * Retrieves the historic state for a given Item at a certain point in time.
     *
     * @param {ZoneDateTime} timestamp
     * @param {string} [serviceId] optional persistance service ID
     * @returns {*} state
     */
  historicState (timestamp, serviceId) {
    return this._stateOrNull(PersistenceExtensions.historicState(this.rawItem, ...arguments));
  }

  /**
   * Query the last update time of a given Item.
   *
   * @param {string} [serviceId] optional persistance service ID
   * @returns {(ZonedDateTime | null)}
   */
  lastUpdate (serviceId) {
    return this._dateOrNull(PersistenceExtensions.lastUpdate(this.rawItem, ...arguments));
  }

  /**
   * Gets the maximum value of the historic state of a given Item between two certain points in time.
   *
   * @param {ZoneDateTime} begin begin
   * @param {ZoneDateTime} end end
   * @param {string} [serviceId] optional persistance service ID
   * @returns {(string | null)} state or null
   */
  maximumBetween (begin, end, serviceId) {
    return this._stateOrNull(PersistenceExtensions.maximumBetween(this.rawItem, ...arguments));
  }

  /**
   * Gets the maximum value of the historic state of a given Item since a certain point in time.
   *
   * @param {ZoneDateTime} timestamp
   * @param {string} [serviceId] optional persistance service ID
   * @returns {(string | null)} state or null
   */
  maximumSince (timestamp, serviceId) {
    return this._stateOrNull(PersistenceExtensions.maximumSince(this.rawItem, ...arguments));
  }

  /**
   * Gets the minimum value of the historic state of a given Item between two certain points in time.
   *
   * @param {ZoneDateTime} begin begin
   * @param {ZoneDateTime} end end
   * @param {string} [serviceId] optional persistance service ID
   * @returns {(string | null)} state or null
   */
  minimumBetween (begin, end, serviceId) {
    return this._stateOrNull(PersistenceExtensions.minimumBetween(this.rawItem, ...arguments));
  }

  /**
   * Gets the minimum value of the historic state of a given Item since a certain point in time.
   *
   * @param {ZoneDateTime} timestamp
   * @param {string} [serviceId] optional persistance service ID
   * @returns {(string | null)} state or null
   */
  minimumSince (timestamp, serviceId) {
    return this._stateOrNull(PersistenceExtensions.minimumSince(this.rawItem, ...arguments));
  }

  /**
   * Persists the state of a given Item.
   *
   * @param {string} [serviceId] optional persistance service ID
   */
  persist (serviceId) {
    PersistenceExtensions.persist(this.rawItem, ...arguments);
  }

  /**
   * Returns the previous state of a given Item.
   *
   * @param {boolean} [skipEqual] optional, if true, skips equal state values and searches the first state not equal the current state
   * @param {string} [serviceId] optional persistance service ID
   * @returns {(string | null)} state or null
   */
  previousState (skipEqual, serviceId) {
    return this._stateOrNull(PersistenceExtensions.previousState(this.rawItem, ...arguments));
  }

  /**
   * Gets the sum of the states of a given Item between two certain points in time.
   *
   * @param {ZoneDateTime} begin begin
   * @param {ZoneDateTime} end end
   * @param {string} [serviceId] optional persistance service ID
   * @returns {(number | null)}
   */
  sumBetween (begin, end, serviceId) {
    return this._decimalOrNull(PersistenceExtensions.sumBetween(this.rawItem, ...arguments));
  }

  /**
   * Gets the sum of the states of a given Item since a certain point in time.
   *
   * @param {ZoneDateTime} timestamp
   * @param {string} [serviceId] optional persistance service ID
   * @returns {(number | null)}
   */
  sumSince (timestamp, serviceId) {
    return this._decimalOrNull(PersistenceExtensions.sumSince(this.rawItem, ...arguments));
  }

  /**
   * Checks if the state of a given Item has been updated between two certain points in time.
   *
   * @param {ZoneDateTime} begin begin
   * @param {ZoneDateTime} end end
   * @param {string} [serviceId] optional persistance service ID
   * @returns {boolean}
   */
  updatedBetween (begin, end, serviceId) {
    return PersistenceExtensions.updatedBetween(this.rawItem, ...arguments);
  }

  /**
   * Checks if the state of a given Item has been updated since a certain point in time.
   *
   * @param {ZoneDateTime} timestamp
   * @param {string} [serviceId] optional persistance service ID
   * @returns {boolean}
   */
  updatedSince (timestamp, serviceId) {
    return PersistenceExtensions.updatedSince(this.rawItem, ...arguments);
  }

  /**
   * Gets the variance of the state of the given Item between two certain points in time.
   *
   * @param {ZoneDateTime} begin begin
   * @param {ZoneDateTime} end end
   * @param {string} [serviceId] optional persistance service ID
   * @returns {(number | null)}
   */
  varianceBetween (begin, end, serviceId) {
    return this._decimalOrNull(PersistenceExtensions.varianceBetween(this.rawItem, ...arguments));
  }

  /**
   * Gets the variance of the state of the given Item since a certain point in time.
   *
   * @param {ZoneDateTime} timestamp
   * @param {string} [serviceId] optional persistance service ID
   * @returns {(number | null)}
   */
  varianceSince (timestamp, serviceId) {
    return this._decimalOrNull(PersistenceExtensions.varianceSince(this.rawItem, ...arguments));
  }

  /**
   * Retrieves the historic item state for a given Item at the current point in time.
   *
   * @param {string} [serviceId] optional persistance service ID
   * @returns {(string | null)} state
   */
  latestState (serviceId) {
    return this.historicState(DateTime.now(), ...arguments);
  }

  /**
   * @private
   */
  _stateOrNull (result) {
    return result === null ? null : result.state.toString();
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
