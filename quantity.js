const QuantityType = Java.type('org.openhab.core.library.types.QuantityType');
/**
 * @type {JavaBigDecimal}
 * @private
 */
const BigDecimal = Java.type('java.math.BigDecimal');

/**
 * @typedef {import('./items/items').Item} Item
 * @private
 */

/**
 * Takes either a {@link Item}, a `string`, a `number` or a {@link Quantity} and converts it to a {@link QuantityType} or {@link BigDecimal}.
 * When the Item state is a DecimalType, it is converted to a {@link BigDecimal}, otherwise to a {@link QuantityType}.
 * @param {Item|string|number|Quantity} value
 * @returns {BigDecimal|QuantityType}
 * @throws {TypeError} when parameter has the wrong type
 * @throws {QuantityError} when {@link BigDecimal} creation failed
 * @private
 */
function _toBigDecimalOrQtyType (value) {
  if (value.constructor && value.constructor.name === 'Item' && value.rawState.getClass().getSimpleName() === 'DecimalType') {
    try {
      value = value.rawState.toBigDecimal();
    } catch (e) {
      throw new QuantityError(`Failed to create BigDecimal from DecimalType Item state ${value.state}: ${e}`);
    }
  } else
  if (typeof value === 'number') {
    try {
      value = BigDecimal.valueOf(value);
    } catch (e) {
      throw new QuantityError(`Failed to create BigDecimal from ${value}: ${e}`);
    }
  } else {
    value = _toQtyType(value, 'Argument of wrong type provided, required number, string or Quantity.');
  }
  return value;
}

/**
 * Takes either a {@link Quantity} or a `string` and converts it to a {@link QuantityType}.
 * @param {Item|string|Quantity} value
 * @param {string} [errorMsg] error message to throw if parameter has wrong type
 * @returns {QuantityType}
 * @throws {TypeError} when parameter has the wrong type
 * @throws {QuantityError} when {@link QuantityType} creation failed
 * @private
 */
function _toQtyType (value, errorMsg = 'Argument of wrong type provided, required string or Quantity.') {
  if (value.constructor && value.constructor.name === 'Item') {
    if (value.rawState.getClass().getSimpleName() === 'QuantityType') {
      value = value.rawState;
    } else {
      try {
        value = QuantityType.valueOf(value.state);
      } catch (e) {
        throw new QuantityError(`Failed to create QuantityType from Item state ${value.state}: ${e}`);
      }
    }
  } else if (typeof value === 'string') {
    try {
      value = QuantityType.valueOf(value);
    } catch (e) {
      throw new QuantityError(`Failed to create QuantityType from ${value}: ${e}`);
    }
  } else if (value instanceof Quantity) {
    value = QuantityType.valueOf(value.raw.toString()); // Avoid referencing the same underlying QuantityType, so "clone" it
  } else {
    throw new TypeError(errorMsg);
  }
  return value;
}

/**
 * QuantityError is thrown when {@link Quantity} creation or operation fails.
 * It is used to wrap the underlying Java Exceptions and add some additional information and a JS stacktrace to it.
 */
class QuantityError extends Error {
  /**
   * @param {string} message
   */
  constructor (message) {
    super(message);
    super.name = 'QuantityError';
  }
}

/**
 * Class allowing easy Units of Measurement/Quantity handling by wrapping the openHAB {@link QuantityType}.
 *
 * Throws {@link QuantityError} when Quantity creation or operation failed due to wrong quantity or unit.
 * Throws {@link TypeError} when wrong argument type is provided.
 *
 * @hideconstructor
 */
class Quantity {
  /**
   * @param {Item|string|Quantity|QuantityType} value
   */
  constructor (value) {
    if (value instanceof QuantityType) {
      /**
       * @type {QuantityType}
       * @private
       */
      this.raw = value;
    } else {
      /**
       * @type {QuantityType}
       * @private
       */
      this.raw = _toQtyType(value);
    }
  }

  /**
   * Dimension of this Quantity, e.g. `[L]` for metres or `[L]²` for cubic-metres
   * @type {string}
   */
  get dimension () {
    return this.raw.getDimension().toString();
  }

  /**
   * Unit of this Quantity, e.g. `Metre`, or `null` if not available
   * @type {string|null}
   */
  get unit () {
    const unit = this.raw.getUnit().getName();
    return (unit === null) ? null : unit.toString();
  }

  /**
   * Unit symbol of this Quantity, e.g. `m`, or `null` if not available
   * @type {string|null}
   */
  get symbol () {
    const str = this.raw.toString();
    const i = str.indexOf(' ');
    return (i !== -1) ? str.substring(i + 1) : null;
  }

  /**
   * Float (decimal number) value of this Quantity
   * @type {number}
   */
  get float () {
    return parseFloat(this.raw.doubleValue());
  }

  /**
   * Integer (non-decimal number) value of this Quantity
   * @type {number}
   */
  get int () {
    return parseInt(this.raw.longValue());
  }

  /**
   * Add the given value to this Quantity.
   *
   * @param {string|Quantity} value `string` consisting of amount and unit or a Quantity
   * @returns {Quantity} result as new Quantity
   */
  add (value) {
    value = _toQtyType(value);
    return new Quantity(this.raw.add(value));
  }

  /**
   * Divide this Quantity by the given value.
   *
   * @example
   * Quantity('20 W').divide(4); // is 5 W
   * Quantity('20 W').divide('4 W') // is 5
   *
   * @param {number|string|Quantity} value usually a number; may also be a `string` consisting of amount and unit or a Quantity, but be careful: 1 W / 5 W = 0.2 which might not be what you want
   * @returns {Quantity} result as new Quantity
   */
  divide (value) {
    value = _toBigDecimalOrQtyType(value);
    return new Quantity(this.raw.divide(value));
  }

  /**
   * Multiply this Quantity by the given value.
   *
   * @example
   * Quantity('20 W').multiply(4); // is 80 W
   * Quantity('20 W').multiply('4 W') // is 80 W^2
   *
   * @param {number|string|Quantity} value usually a number; may also be a `string` consisting of amount and unit or a Quantity, but be careful: 1 W * 5 W = 5 W^2 which might not be what you want
   * @returns {Quantity} result as new Quantity
   */
  multiply (value) {
    value = _toBigDecimalOrQtyType(value);
    return new Quantity(this.raw.multiply(value));
  }

  /**
   * Subtract the given value from this Quantity.
   *
   * @param {string|Quantity} value `string` consisting of amount and unit or a Quantity
   * @returns {Quantity} result as new Quantity
   */
  subtract (value) {
    value = _toQtyType(value);
    return new Quantity(this.raw.subtract(value));
  }

  /**
   * Convert this Quantity to the given unit.
   *
   * @param {string} unit
   * @returns {Quantity|null} a new Quantity with the given unit or `null` if conversion to this unit is not possible
   * @throws {QuantityError} when unit cannot be parsed because it is invalid
   */
  toUnit (unit) {
    let qtyType;
    try {
      qtyType = (this.raw.toUnit(unit));
    } catch (e) {
      throw new QuantityError(`Failed to parse unit ${unit}: ${e}`);
    }
    if (qtyType === null) {
      console.warn(`Failed to convert ${this.raw.toString()} to unit ${unit}.`);
      return null;
    }
    return new Quantity(qtyType);
  }

  /**
   * Checks whether this Quantity is equal to the passed in value.
   *
   * @param {string|Quantity} value
   * @returns {boolean}
   */
  equal (value) {
    value = _toQtyType(value);
    return this.raw.compareTo(value) === 0;
  }

  /**
   * Checks whether this Quantity is larger than the passed in value.
   *
   * @param {string|Quantity} value
   * @returns {boolean}
   */
  greaterThan (value) {
    value = _toQtyType(value);
    return this.raw.compareTo(value) > 0;
  }

  /**
   * Checks whether this Quantity is larger than or equal to the passed in value.
   *
   * @param {string|Quantity} value
   * @returns {boolean}
   */
  greaterThanOrEqual (value) {
    value = _toQtyType(value);
    return this.raw.compareTo(value) >= 0;
  }

  /**
   * Checks whether this Quantity is smaller than the passed in value.
   *
   * @param {string|Quantity} value
   * @returns {boolean}
   */
  lessThan (value) {
    value = _toQtyType(value);
    return this.raw.compareTo(value) < 0;
  }

  /**
   * Checks whether this Quantity is smaller than or equal to the passed in value.
   *
   * @param {string|Quantity} value
   * @returns {boolean}
   */
  lessThanOrEqual (value) {
    value = _toQtyType(value);
    return this.raw.compareTo(value) <= 0;
  }

  toString () {
    return this.raw.toString();
  }
}

/**
 * The Quantity allows easy Units of Measurement/Quantity handling by wrapping the openHAB {@link QuantityType}.
 *
 * @private
 * @param {Item|string|Quantity|QuantityType} value either a Quantity-compatible {@link Item}, a string consisting of a numeric value and a dimension, e.g. `5.5 m`, a {@link Quantity} or a {@link QuantityType}
 * @returns {Quantity}
 * @throws {QuantityError} if Quantity creation or operation failed
 * @throws {TypeError} if wrong argument type is provided
 */
function getQuantity (value) {
  return new Quantity(value);
}
module.exports = {
  getQuantity,
  Quantity,
  QuantityError,
  _toQtyType: _toQtyType,
  _toBigDecimalOrQtyType: _toBigDecimalOrQtyType
};
