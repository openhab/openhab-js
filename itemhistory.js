/**
 * Items' history module.
 * This module provides access to historic state of items.
 * 
 * @private
 * @namespace itemshistory
 */

const PersistenceExtensions = Java.type("org.openhab.core.persistence.extensions.PersistenceExtensions");
const DateTime = Java.type('java.time.ZonedDateTime');

let historicState = function (item, timestamp) {
    //todo: check item param
    let history = PersistenceExtensions.historicState(item.rawItem, timestamp);
    
    return history === null ? null : history.state;
};

let previousState = function(item, skipEqual = false) {
    let result = PersistenceExtensions.previousState(item.rawItem, skipEqual)

    return result === null ? null : result.state;
}

let latestState = (item) => historicState(item, DateTime.now());

module.exports = {
    historicState,
    latestState,
    previousState
}
