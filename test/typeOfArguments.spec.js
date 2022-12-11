const typeOfArguments = require('../typeOfArguments');

describe('typeOfArguments.js', () => {
  describe('supports primitive types (without "undefined")', () => {
    const expectedArray = ['string', 'number', 'bigint', 'boolean', 'symbol', 'null'];

    it('does not throw an error if arguments match.', () => {
      expect(() => typeOfArguments(['string', 5, BigInt(5), true, Symbol('foo'), null], expectedArray)).not.toThrowError();
    });

    it('throws TypeError if an argument does not match.', () => {
      expect(() => typeOfArguments([5, BigInt(5), true, Symbol('foo'), null, 'string'], expectedArray)).toThrowError(TypeError);
    });
  });

  it('supports multiple types in expressions using "|".', () => {
    const expectedArray = ['number|string|null'];
    expect(() => typeOfArguments([18], expectedArray)).not.toThrowError();
    expect(() => typeOfArguments(['string'], expectedArray)).not.toThrowError();
    expect(() => typeOfArguments([null], expectedArray)).not.toThrowError();
  });

  it('accepts "object" in expressions.', () => {
    expect(() => typeOfArguments([{}, new Object()], ['object', 'object'])).not.toThrowError(); // eslint-disable-line
  });

  describe('supports classname checking', () => {
    const expectedArray = ['Car', 'Bus'];
    class Car {}
    class Bus {}
    it('does not trow an error if arguments match.', () => {
      expect(() => typeOfArguments([new Car(), new Bus()], expectedArray)).not.toThrowError();
    });
    it('throws TypeError if an argument does not match.', () => {
      expect(() => typeOfArguments([new Bus(), new Car()], expectedArray)).toThrowError(TypeError);
    });
  });
});
