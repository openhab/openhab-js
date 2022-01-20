const { ZonedDateTime } = require('@js-joda/core');
const time = require('../time');
const PersistenceExtensions = Java.type("org.openhab.core.persistence.extensions.PersistenceExtensions");
const DateTime = Java.type('java.time.ZonedDateTime');

/**
 * Class representing the historic state of an openHAB Item
 * 
 * 
 * @memberOf items
 * @hideconstructor
 */
class ItemHistory {
    constructor(item) {
        this.item = item;
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
    averageSince(timestamp, serviceId) {
        return this._decimalOrNull(PersistenceExtensions.averageSince(this.item, ...arguments));
    }

    /**
     * Checks if the state of a given item has changed since a certain point in time.
     * 
     * @param {(Date | ZoneDateTime)} timestamp 
     * @param {string} [serviceId] optional persistance service ID 
     * @returns {boolean}
     */
    changedSince(timestamp, serviceId) {
        return PersistenceExtensions.changedSince(this.item, ...arguments);
    }

    /**
     * Gets the difference value of the state of a given item since a certain point in time.
     * 
     * @param {(Date | ZoneDateTime)} timestamp 
     * @param {string} [serviceId] optional persistance service ID 
     * @returns {(Number | null)}
     */
    deltaSince(timestamp, serviceId) {
        return this._decimalOrNull(PersistenceExtensions.deltaSince(this.item, ...arguments));
    }

    /**
     * Gets the standard deviation of the state of the given Item since a certain point in time.
     * 
     * @param {(Date | ZoneDateTime)} timestamp 
     * @param {string} [serviceId] optional persistance service ID 
     * @returns {(Number | null)}
     */
    deviationSince(timestamp, serviceId) {
        return this._decimalOrNull(PersistenceExtensions.deviationSince(this.item, ...arguments));
    }

    /**
     * Gets the evolution rate of the state of a given Item since a certain point in time.
     * 
     * @param {(Date | ZoneDateTime)} timestamp 
     * @param {string} [serviceId] optional persistance service ID 
     * @returns {(Number | null)}
     */
    evolutionRate(timestamp, serviceId) {
        return this._decimalOrNull(PersistenceExtensions.evolutionRate(this.item, ...arguments));
    }

    /**
     * Retrieves the historic item state for a given item at a certain point in time.
     * 
     * @param {(Date | ZoneDateTime)} timestamp 
     * @param {string} [serviceId] optional persistance service ID 
     * @returns {*} state
     */
    historicState(timestamp, serviceId) {
        return this._stateOrNull(PersistenceExtensions.historicState(this.item, ...arguments));
    }

    /**
     * Query the last update time of a given item.
     * 
     * @param {string} [serviceId] optional persistance service ID 
     * @returns {(ZonedDateTime | null)}
     */
    lastUpdate(serviceId) {
        return this._dateOrNull(PersistenceExtensions.lastUpdate(this.item, ...arguments));
    }

    /**
     * Gets the historic item with the maximum value of the state of a given item since a certain point in time.
     * 
     * @param {(Date | ZoneDateTime)} timestamp 
     * @param {string} [serviceId] optional persistance service ID 
     * @returns {*} state
     */
    maximumSince(timestamp, serviceId) {
        return this._stateOrNull(PersistenceExtensions.maximumSince(this.item, ...arguments));
    }

    /**
     * Gets the historic item with the minimum value of the state of a given item since a certain point in time.
     * 
     * @param {(Date | ZoneDateTime)} timestamp 
     * @param {string} [serviceId] optional persistance service ID 
     * @returns {*} state
     */
    minimumSince(timestamp, serviceId) {
        return this._stateOrNull(PersistenceExtensions.minimumSince(this.item, ...arguments));
    }

    /**
     * Persists the state of a given item
     * 
     * @param {string} [serviceId] optional persistance service ID 
     */
    persist(serviceId) {
        PersistenceExtensions.persist(this.item, ...arguments);
    }

    /**
     * Returns the previous state of a given item.
     * 
     * @param {boolean} [skipEqual] optional, if true, skips equal state values and searches the first state not equal the current state
     * @param {string} [serviceId] optional persistance service ID 
     * @returns {*} state
     */
    previousState(skipEqual, serviceId) {
        return this._stateOrNull(PersistenceExtensions.previousState(this.item, ...arguments));
    }

    /**
     * Gets the sum of the state of a given item since a certain point in time.
     * 
     * @param {(Date | ZoneDateTime)} timestamp 
     * @param {string} [serviceId] optional persistance service ID 
     * @returns {(Number | null)}
     */
    sumSince(timestamp, serviceId) {
        return this._decimalOrNull(PersistenceExtensions.sumSince(this.item, ...arguments));
    }

    /**
     * Checks if the state of a given item has been updated since a certain point in time.
     * 
     * @param {(Date | ZoneDateTime)} timestamp 
     * @param {string} [serviceId] optional persistance service ID 
     * @returns {boolean}
     */
    updatedSince(timestamp, serviceId) {
        return PersistenceExtensions.updatedSince(this.item, ...arguments);
    }

    /**
     * Gets the variance of the state of the given Item since a certain point in time.
     * 
     * @param {(Date | ZoneDateTime)} timestamp 
     * @param {string} [serviceId] optional persistance service ID 
     * @returns {*} state
     */
    varianceSince(timestamp, serviceId) {
        return this._stateOrNull(PersistenceExtensions.varianceSince(this.item, ...arguments));
    }

    /**
     * Retrieves the historic item state for a given item at the current point in time.
     * @param {string} [serviceId] optional persistance service ID 
     * @returns {*} state
     */
    latestState(serviceId) {
        return this.historicState(DateTime.now(), ...arguments);
    }

    _stateOrNull(result) {
        return result === null ? null : result.state;
    }

    _dateOrNull(result) {
        return result === null ? null : time.ZonedDateTime.parse(result.toString());
    }

    _decimalOrNull(result) {
        return result === null ? null : result.toBigDecimal();
    }
}

module.exports = ItemHistory;
