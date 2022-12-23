/**
 * {@link TypeOfArguments} validates the arguments' types passed to a function.
 *
 * It's functionality was inspired by the typeof-arguments npm package (https://www.npmjs.com/package/typeof-arguments).
 * @private
 */
class TypeOfArguments {
  constructor (givenArray, expectedArray) {
    if (!(givenArray instanceof Array)) throw new TypeError('TypeOfArguments: The [0] argument must be the given arguments array.');
    if (!(expectedArray instanceof Array)) throw new TypeError('TypeOfArguments: The [1] argument must be the expected argument types Array');
    for (let i = 0; i < expectedArray.length; i++) {
      const givenArgument = givenArray[i];
      const actualType = this._getActualType(givenArgument);
      let actualClass;
      if (givenArgument !== undefined && givenArgument !== null && givenArgument.constructor && givenArgument.constructor.name) actualClass = givenArgument.constructor.name.toString();
      const expectedTypes = this._getExpectedTypes(expectedArray[i]);
      let matchesType = false;
      for (const element of expectedTypes) {
        if (actualType === element) matchesType = true;
        if (actualClass !== undefined && actualClass === element) matchesType = true;
        if (element === 'null' && givenArgument === null) matchesType = true;
        if (matchesType === true) break;
      }
      if (matchesType !== true) throw new TypeError(`Invalid argument [${i}]. An argument of type "${actualType}" ${actualClass !== undefined ? `and class "${actualClass}"` : ''} has been passed, while a argument matching expression "${expectedArray[i]}" is expected."`);
    }
  }

  _getActualType (value) {
    return typeof value;
  }

  _getExpectedTypes (expected) {
    return expected.split('|');
  }
}

/**
 * {@link TypeOfArguments} validates the arguments' types passed to a function.
 *
 * A type expression accepts the following:
 *   - primitive types (`string`, `number`, `bigint`,`boolean`, `symbol`, `undefined`, `null`)
 *   - `object`
 *   - classnames (retrieved by getting constructor.name) (e.g. `Item`)
 * Type expressions are case-sensitive, it is possible to allow multiple types by using the `|` symbol.
 *
 * @private
 * @param {Array} givenArray Array of the passed in arguments
 * @param {Array} expectedArray Array of the expected argument types. The index should match the index of the passed in argument. Each element is a type expression and defines the required type of the matching argument.
 * @returns {TypeOfArguments}
 */
function typeOfArguments (givenArray, expectedArray) { return new TypeOfArguments(givenArray, expectedArray); }

module.exports = typeOfArguments;
