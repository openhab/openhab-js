// Helper functions used internally across the library

const utils = require('./utils');
const javaZDT = Java.type('java.time.ZonedDateTime');
const javaDuration = Java.type('java.time.Duration');

/**
 * @typedef { import("./items/items").Item } Item
 * @private
 */

/**
 * Returns the name of a given Item or relays the passed in Item name.
 *
 * @param {Item|string} itemOrName Item or Item name
 * @returns {string} the Item name
 * @private
 */
function _getItemName (itemOrName) {
  if (_isItem(itemOrName)) return itemOrName.name;
  return itemOrName;
}

/**
 * Helper function to convert JS types to a
 * {@link https://www.openhab.org/javadoc/latest/org/openhab/core/types/type org.openhab.core.types.Type} or a valid string representation of a type.
 *
 * Number and string are passed through.
 * Other objects should implement <code>toOpenHabString</code> (prioritized) or <code>toString</code> to return an openHAB compatible representation.
 *
 * @private
 * @param {*} value
 * @returns {*}
 */
function _toOpenhabType (value) {
  if (value === null) return 'NULL';
  if (value === undefined) return 'UNDEF';
  if (typeof value === 'number' || typeof value === 'string') {
    return value;
  } else if (typeof value.toOpenHabString === 'function') {
    return value.toOpenHabString();
  } else if (typeof value.toString === 'function') {
    return value.toString();
  }
  return value;
}

/**
 * Checks whether the given object is an instance of {@link items.Item}.
 *
 * To be used when instanceof checks don't work because of circular dependencies.
 * Checks constructor name or unique properties, because constructor name does not work for the webpacked globals injection.
 *
 * @param o {*}
 * @returns {boolean}
 * @private
 */
function _isItem (o) {
  return ((o.constructor && o.constructor.name === 'Item') || typeof o.rawItem === 'object');
}

/**
 * Checks whether the given object is an instance of {@link Quantity}.
 *
 * To be used when instanceof checks don't work because of circular dependencies.
 * Checks constructor name or unique properties, because constructor name does not work for the webpacked globals injection.
 *
 * @param o {*}
 * @returns {boolean}
 * @private
 */
function _isQuantity (o) {
  return ((o.constructor && o.constructor.name === 'Quantity') || typeof o.rawQtyType === 'object');
}

/**
 * Checks whether the given object is an instance of {@link time.ZonedDateTime}.
 *
 * To be used when instanceof checks don't work because of circular dependencies.
 * Checks constructor name or unique properties, because constructor name does not work for the webpacked globals injection.
 *
 * @param o {*}
 * @returns {boolean}
 * @private
 */
function _isZonedDateTime (o) {
  return (((o.constructor && o.constructor.name === 'ZonedDateTime')) ||
    (!utils.isJsInstanceOfJavaType(o, javaZDT) && typeof o.withFixedOffsetZone === 'function')
  );
}

/**
 * Checks whether the given object is an instance of {@link time.Duration}.
 *
 * To be used when instanceof checks don't work because of circular dependencies.
 * Checks constructor name or unique properties, because constructor name does not work for the webpacked globals injection.
 *
 * @param o {*}
 * @returns {boolean}
 * @private
 */
function _isDuration (o) {
  return (((o.constructor && o.constructor.name === 'Duration')) ||
    (!utils.isJsInstanceOfJavaType(o, javaDuration) && typeof o.minusDuration === 'function' && typeof o.toNanos === 'function')
  );
}

module.exports = {
  _getItemName,
  _toOpenhabType,
  _isItem,
  _isQuantity,
  _isZonedDateTime,
  _isDuration
};
