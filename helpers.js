// Helper functions used internally across the library

const _getItemName = function (itemOrName) {
  // Somehow instanceof check doesn't work here, so workaround the problem
  if (itemOrName.rawItem !== undefined) return itemOrName.name;
  return itemOrName;
};

module.exports = {
  _getItemName
};
