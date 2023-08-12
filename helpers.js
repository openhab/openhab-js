// Helper functions used internally across the library

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

module.exports = {
  _getItemName,
  _isItem
};
