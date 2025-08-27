// Helper functions used internally across the items namespace

const { UnDefType, PercentType } = require('@runtime');

const { getQuantity, QuantityError } = require('../quantity');

/**
 * Check if a value is `null`, `undefined` or an instance of {@link https://www.openhab.org/javadoc/latest/org/openhab/core/types/undeftype `UnDefType`}.
 *
 * @private
 * @param {*} value
 * @returns {boolean}
 */
function _isNullOrUndefined (value) {
  return value === null || value === undefined || value instanceof UnDefType;
}

/**
 * Return a string representation of a state.
 *
 * @private
 * @param {HostState|null} rawState the state
 * @returns {string|null} string representation or `null` if `rawState` was `null`
 */
function _stateOrNull (rawState) {
  if (rawState === null) return null; // check for passed in null only, allows returning NULL or UNDEF
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
  if (_isNullOrUndefined(rawState)) return null;
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
  if (_isNullOrUndefined(rawState)) return null;
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
  _isNullOrUndefined,
  _stateOrNull,
  _numericStateOrNull,
  _quantityStateOrNull
};
