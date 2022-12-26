/** {@link https://www.openhab.org/javadoc/latest/org/openhab/core/library/types/quantitytype org.openhab.core.library.types.QuantityType} */
const QuantityType = Java.type('org.openhab.core.library.types.QuantityType');
/** {@link https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/math/BigDecimal.html java.math.BigDecimal} */
const BigDecimal = Java.type('java.math.BigDecimal');

/**
 * Class allowing easy Units of Measurement/Quantity handling by wrapping the openHAB {@link QuantityType}.
 *
 * @hideconstructor
 */
class Quantity {
  /**
   * @param {string} value a string consisting of a numeric value and a dimension, e.g. `5.5 m`
   */
  constructor (value) {
    if (typeof value !== 'string') throw new TypeError('Wrong argument provided to factory, provide a string!');
    /**
     * @type {QuantityType}
     * @private
     */
    this.raw = new QuantityType(value);
  }

  /**
   * Dimension of this Quantity, e.g. `[L]` for metres or `[L]²` for cubic-metres.
   * @returns {string}
   */
  get dimension () {
    return this.raw.getDimension().toString();
  }

  /**
   * Unit of this Quantity, e.g. `Metre`.
   * @returns {string|null}
   */
  get unit () {
    const unit = this.raw.getUnit().getName();
    return (unit === null) ? null : unit.toString();
  }

  /**
   * Unit symbol of this Quantitiy, e.g. `m`.
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
    value = this._stringOrQtyToQtyType(value);
    this.raw = this.raw.add(value);
    return this;
  }

  /**
   * Divide this Quantity by the given value.
   * @param {number|string|Quantity} value
   * @returns {Quantity} this Quantity
   */
  divide (value) {
    value = this._stringOrNumberOrQtyToQtyType(value);
    this.raw = this.raw.divide(value);
    return this;
  }

  /**
   * Multiply this Quantity by the given value.
   * @param {number|string|Quantity} value
   * @returns {Quantity} this Quantity
   */
  multiply (value) {
    value = this._stringOrNumberOrQtyToQtyType(value);
    this.raw = this.raw.multiply(value);
    return this;
  }

  /**
   * Subtract the given value from this Quantity.
   * @param {string|Quantity} value
   * @returns {Quantity} this Quantity
   */
  subtract (value) {
    value = this._stringOrQtyToQtyType(value);
    this.raw = this.raw.subtract(value);
    return this;
  }

  /**
   * Convert this Quantity to the given unit.
   * @param {string} unit
   * @returns {Quantity} this with the new unit
   */
  toUnit (unit) {
    this.raw = this.raw.toUnit(unit);
    return this;
  }

  /**
   * Checks whether this Quantity is equal to the passed in value.
   * @param {string|Quantity} value
   * @returns {boolean}
   */
  equal (value) {
    value = this._stringOrQtyToQtyType(value);
    return this.raw.compareTo(value) === 0;
  }

  /**
   * Checks whether this Quantity is larger than the passed in value.
   * @param {string|Quantity} value
   * @returns {boolean}
   */
  largerThan (value) {
    value = this._stringOrQtyToQtyType(value);
    return this.raw.compareTo(value) > 0;
  }

  /**
   * Checks whether this Quantity is larger than or equal to the passed in value.
   * @param {string|Quantity} value
   * @returns {boolean}
   */
  largerThanOrEqual (value) {
    value = this._stringOrQtyToQtyType(value);
    return this.raw.compareTo(value) >= 0;
  }

  /**
   * Checks whether this Quantity is smaller than the passed in value.
   * @param {string|Quantity} value
   * @returns {boolean}
   */
  smallerThan (value) {
    value = this._stringOrQtyToQtyType(value);
    return this.raw.compareTo(value) < 0;
  }

  /**
   * Checks whether this Quantity is smaller than or equal to the passed in value.
   * @param {string|Quantity} value
   * @returns {boolean}
   */
  smallerThanOrEqual (value) {
    value = this._stringOrQtyToQtyType(value);
    return this.raw.compareTo(value) <= 0;
  }

  toString () {
    return this.raw.toString();
  }

  /**
     * Takes either a {@link Quantity}, a `string` or a `number` and converts it to a {@link QuantityType} or {@link BigDecimal}.
     * @param {number|string|Quantity} value
     * @returns {BigDecimal|QuantityType}
     * @throws {TypeError} if parameter has the wrong type
     * @private
     */
  _stringOrNumberOrQtyToQtyType (value) {
    if (typeof value === 'number') {
      value = new BigDecimal(value);
    } else if (typeof value === 'string') {
      value = new QuantityType(value);
    } else if (value instanceof Quantity) {
      value = value.raw;
    } else {
      throw new TypeError('Wrong argument type provided, please provide a number or string or Quantity.');
    }
    return value;
  }

  /**
     * Takes either a {@link Quantity} or a `string` and converts it to a {@link QuantityType}.
     * @param {string|Quantity} value
     * @returns {QuantityType}
     * @throws {TypeError} if parameter has the wrong type
     * @private
     */
  _stringOrQtyToQtyType (value) {
    if (typeof value === 'string') {
      value = new QuantityType(value);
    } else if (value instanceof Quantity) {
      value = value.raw;
    } else {
      throw new TypeError('Wrong argument type provided, please provide a string or Quantity.');
    }
    return value;
  }
}

/**
 * The Quantity allows easy Units of Measurement/Quantity handling by wrapping the openHAB {@link QuantityType}.
 *
 * @param {string} value a string consisting of a numeric value and a dimension, e.g. `5.5 m`
 * @returns {Quantity}
 */
module.exports = (value) => new Quantity(value);
