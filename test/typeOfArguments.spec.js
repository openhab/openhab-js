const typeOfArguments = require('../typeOfArguments');

describe('typeOfArguments.js', () => {
  describe('supports primitive types', () => {
    const expectedArray = ['string', 'number', 'bigint', 'boolean', 'symbol', 'null', 'undefined'];

    it('does not throw an error if arguments match.', () => {
      expect(() => typeOfArguments(['string', 5, BigInt(5), true, Symbol('foo'), null, undefined], expectedArray)).not.toThrowError();
    });

    it('throws TypeError if an argument does not match.', () => {
      expect(() => typeOfArguments([5, BigInt(5), true, Symbol('foo'), null, undefined, 'string'], expectedArray)).toThrowError(TypeError);
    });
  });

  describe('supports classname checking', () => {
    const expectedArray = ['Car', 'Bus'];
    class Car {}
    class Bus {}
    it('does not throw an error if arguments match.', () => {
      expect(() => typeOfArguments([new Car(), new Bus()], expectedArray)).not.toThrowError();
    });
    it('throws TypeError if an argument does not match.', () => {
      expect(() => typeOfArguments([new Bus(), new Car()], expectedArray)).toThrowError(TypeError);
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

  it('throws TypeError if a required argument is missing.', () => {
    function testFn (x, y) {
      typeOfArguments([x, y], ['string', 'string']);
    }
    expect(() => testFn()).toThrowError(TypeError);
  });
});
