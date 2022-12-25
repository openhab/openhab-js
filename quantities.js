const QuantityType = Java.type('org.openhab.core.library.types.QuantityType');
const BigDecimal = Java.type('java.math.BigDecimal');

class Quantity {
  constructor (value) {
    if (typeof value !== 'string') throw new TypeError('Wrong argument provided to factory, provide a string!');
    this.raw = new QuantityType(value);
  }

  get dimension () {
    return this.raw.getDimension().toString();
  }

  get unit () {
    return this.raw.getUnit().getName().toString();
  }

  get symbol () {
    return this.raw.getUnit().getSymbol().toString();
  }

  get float () {
    return parseFloat(this.raw.doubleValue());
  }

  get int () {
    return parseInt(this.raw.longValue());
  }

  add (value) {
    value = this._valueIsStringOrQty(value);
    this.raw = this.raw.add(value);
    return this;
  }

  divide (value) {
    value = this._valueIsStringOrNumberOrQty(value);
    this.raw = this.raw.divide(value);
    return this;
  }

  multiply (value) {
    value = this._valueIsStringOrNumberOrQty(value);
    this.raw = this.raw.multiply(value);
    return this;
  }

  subtract (value) {
    value = this._valueIsStringOrQty(value);
    this.raw = this.raw.subtract(value);
    return this;
  }

  equals (value) {
    value = this._valueIsStringOrQty(value);
    return this.raw.compareTo(value) === 0;
  }

  larger (value) {
    value = this._valueIsStringOrQty(value);
    return this.raw.compareTo(value) > 0;
  }

  largerOrEqual (value) {
    value = this._valueIsStringOrQty(value);
    return this.raw.compareTo(value) >= 0;
  }

  smaller (value) {
    value = this._valueIsStringOrQty(value);
    return this.raw.compareTo(value) < 0;
  }

  smallerOrEqual (value) {
    value = this._valueIsStringOrQty(value);
    return this.raw.compareTo(value) <= 0;
  }

  toUnit (unit) {
    this.raw = this.raw.toUnit(unit);
    return this;
  }

  toString () {
    return this.raw.toString();
  }

  _valueIsStringOrNumberOrQty (value) {
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

  _valueIsStringOrQty (value) {
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

module.exports = (value) => new Quantity(value);
