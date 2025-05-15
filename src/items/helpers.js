// Helper functions used internally across the items namespace

const { PercentType } = require('@runtime');

const { getQuantity, QuantityError } = require('../quantity');

/**
 * Return a string representation of a state.
 *
 * @private
 * @param {HostState|null} rawState the state
 * @returns {string|null} string representation or `null` if `rawState` was `null`
 */
function _stateOrNull (rawState) {
  if (rawState === null) return null;
  return rawState.toString();
}

/**
 * Return a numeric representation of a state.
 *
 * @private
 * @param {HostState|null} rawState the state
 * @param {string} [type] the type of the Item
 * @returns {number|null} numeric representation or `null` if `rawState` was `null`
 */
function _numericStateOrNull (rawState, type) {
  if (rawState === null) return null;
  let state = rawState.toString();
  if (type === 'Color') state = rawState.as(PercentType).toString();
  const numericState = parseFloat(state);
  return isNaN(numericState) ? null : numericState;
}

/**
 * Return a Quantity representation of a state.
 *
 * @private
 * @param {HostState} rawState the state
 * @returns {Quantity|null} Quantity representation, or `null` if `rawState` was `null` or not Quantity-compatible, Quantity would be unit-less (without unit) or not available
 * @throws failed to create quantityState
 */
function _quantityStateOrNull (rawState) {
  if (rawState === null) return null;
  try {
    const qty = getQuantity(rawState);
    return (qty !== null && qty.symbol !== null) ? qty : null;
  } catch (e) {
    if (e instanceof QuantityError) {
      return null;
    } else {
      throw Error('Failed to create "quantityState": ' + e);
    }
  }
}

module.exports = {
  _stateOrNull,
  _numericStateOrNull,
  _quantityStateOrNull
};
