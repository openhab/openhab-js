// Helper functions used internally across the library

const utils = require('./utils');
const javaZDT = Java.type('java.time.ZonedDateTime');
const javaDuration = Java.type('java.time.Duration');

function _getItemName (itemOrName) {
  // Somehow instanceof check doesn't work here, so workaround the problem
  if (itemOrName.rawItem !== undefined) return itemOrName.name;
  return itemOrName;
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
  _isItem,
  _isQuantity,
  _isZonedDateTime,
  _isDuration
};
