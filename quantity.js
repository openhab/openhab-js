/**
 * {@link https://www.openhab.org/javadoc/latest/org/openhab/core/library/types/quantitytype org.openhab.core.library.types.QuantityType}
 * @private
 */
const QuantityType = Java.type('org.openhab.core.library.types.QuantityType');
/**
 * {@link https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/math/BigDecimal.html java.math.BigDecimal}
 * @private
 */
const BigDecimal = Java.type('java.math.BigDecimal');

/**
 * Takes either a {@link Quantity}, a `string` or a `number` and converts it to a {@link QuantityType} or {@link BigDecimal}.
 * @param {number|string|Quantity} value
 * @returns {BigDecimal|QuantityType}
 * @throws {TypeError} if parameter has the wrong type
 * @throws {Error} if {@link BigDecimal} creation failed
 * @private
 */
const _stringOrNumberOrQtyToQtyType = (value) => {
  if (typeof value === 'number') {
    try {
      value = BigDecimal.valueOf(value);
    } catch (e) {
      throw new QuantityError(`Failed to create BigDecimal from ${value}: ${e}`);
    }
  } else {
    value = _stringOrQtyToQtyType(value, 'Argument of wrong type provided, required number, string or Quantity.');
  }
  return value;
};

/**
 * Takes either a {@link Quantity} or a `string` and converts it to a {@link QuantityType}.
 * @param {string|Quantity} value
 * @param {string} [errorMsg] error message to throw if parameter has wrong type
 * @returns {QuantityType}
 * @throws {TypeError} if parameter has the wrong type
 * @throws {Error} if {@link QuantityType} creation failed
 * @private
 */
const _stringOrQtyToQtyType = (value, errorMsg = 'Argument of wrong type provided, required string or Quantity.') => {
  if (typeof value === 'string') {
    try {
      value = QuantityType.valueOf(value);
    } catch (e) {
      throw new QuantityError(`Failed to create QuantityType from ${value}: ${e}`);
    }
  } else if (value instanceof Quantity) {
    value = value.raw;
  } else {
    throw new TypeError(errorMsg);
  }
  return value;
};

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
 * Throws {@link QuantityError} if Quantity creation or operation failed.
 * Throws {@link TypeError} if wrong argument type is provided.
 *
 * @hideconstructor
 */
class Quantity {
  /**
   * @param {string|Quantity|QuantityType} value either a string consisting of a numeric value and a dimension, e.g. `5.5 m`, a {@link Quantity} or a {@link QuantityType}
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
      this.raw = _stringOrQtyToQtyType(value);
    }
  }

  /**
   * Dimension of this Quantity, e.g. `[L]` for metres or `[L]²` for cubic-metres as `string`
   * @returns {string}
   */
  get dimension () {
    return this.raw.getDimension().toString();
  }

  /**
   * Unit of this Quantity, e.g. `Metre` as `string` or `null` if not available
   * @returns {string|null}
   */
  get unit () {
    const unit = this.raw.getUnit().getName();
    return (unit === null) ? null : unit.toString();
  }

  /**
   * Unit symbol of this Quantitiy, e.g. `m` as `string` or `null` if not available
   * @returns {string|null}
   */
  get symbol () {
    const symbol = this.raw.getUnit().getSymbol();
    return (symbol === null) ? null : symbol.toString();
  }

  /**
   * Float (decimal number) value of this Quantity.
   * @returns {number}
   */
  get float () {
    return parseFloat(this.raw.doubleValue());
  }

  /**
   * Integer (non-decimal number) value of this Quantity.
   * @returns {number}
   */
  get int () {
    return parseInt(this.raw.longValue());
  }

  /**
   * Add the given value to this Quantity.
   * @param {string|Quantity} value
   * @returns {Quantity} this Quantity
   */
  add (value) {
    value = _stringOrQtyToQtyType(value);
    this.raw = this.raw.add(value);
    return this;
  }

  /**
   * Divide this Quantity by the given value.
   * @param {number|string|Quantity} value
   * @returns {Quantity} this Quantity
   */
  divide (value) {
    value = _stringOrNumberOrQtyToQtyType(value);
    this.raw = this.raw.divide(value);
    return this;
  }

  /**
   * Multiply this Quantity by the given value.
   * @param {number|string|Quantity} value
   * @returns {Quantity} this Quantity
   */
  multiply (value) {
    value = _stringOrNumberOrQtyToQtyType(value);
    this.raw = this.raw.multiply(value);
    return this;
  }

  /**
   * Subtract the given value from this Quantity.
   * @param {string|Quantity} value
   * @returns {Quantity} this Quantity
   */
  subtract (value) {
    value = _stringOrQtyToQtyType(value);
    this.raw = this.raw.subtract(value);
    return this;
  }

  /**
   * Convert this Quantity to the given unit.
   * @param {string} unit
   * @returns {Quantity} this with the new unit
   */
  toUnit (unit) {
    try {
      this.raw = this.raw.toUnit(unit);
    } catch (e) {
      throw new QuantityError(`Failed to convert to unit ${unit}: ${e}`);
    }
    return this;
  }

  /**
   * Checks whether this Quantity is equal to the passed in value.
   * @param {string|Quantity} value
   * @returns {boolean}
   */
  equal (value) {
    value = _stringOrQtyToQtyType(value);
    return this.raw.compareTo(value) === 0;
  }

  /**
   * Checks whether this Quantity is larger than the passed in value.
   * @param {string|Quantity} value
   * @returns {boolean}
   */
  largerThan (value) {
    value = _stringOrQtyToQtyType(value);
    return this.raw.compareTo(value) > 0;
  }

  /**
   * Checks whether this Quantity is larger than or equal to the passed in value.
   * @param {string|Quantity} value
   * @returns {boolean}
   */
  largerThanOrEqual (value) {
    value = _stringOrQtyToQtyType(value);
    return this.raw.compareTo(value) >= 0;
  }

  /**
   * Checks whether this Quantity is smaller than the passed in value.
   * @param {string|Quantity} value
   * @returns {boolean}
   */
  smallerThan (value) {
    value = _stringOrQtyToQtyType(value);
    return this.raw.compareTo(value) < 0;
  }

  /**
   * Checks whether this Quantity is smaller than or equal to the passed in value.
   * @param {string|Quantity} value
   * @returns {boolean}
   */
  smallerThanOrEqual (value) {
    value = _stringOrQtyToQtyType(value);
    return this.raw.compareTo(value) <= 0;
  }

  toString () {
    return this.raw.toString();
  }
}

/**
 * The Quantity allows easy Units of Measurement/Quantity handling by wrapping the openHAB {@link QuantityType}.
 *
 * @param {string|Quantity|QuantityType} value either a string consisting of a numeric value and a dimension, e.g. `5.5 m`, a {@link Quantity} or a {@link QuantityType}
 * @returns {Quantity}
 * @throws {QuantityError} if Quantity creation or operation failed
 * @throws {TypeError} if wrong argument type is provided
 */
module.exports = (value) => new Quantity(value);
module.exports.QuantityError = QuantityError;
module.exports._stringOrNumberOrQtyToQtyType = _stringOrNumberOrQtyToQtyType;
module.exports._stringOrQtyToQtyType = _stringOrQtyToQtyType;
