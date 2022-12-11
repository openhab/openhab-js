export = typeOfArguments;
/**
 * {@link TypeOfArguments} validates the arguments' types passed to a function.
 *
 * A type expression accepts the following:
 *   - primitive types (`string`, `number`, `bigint`,`boolean`, `symbol`, `null`) except `undefined`
 *   - `object`
 *   - classnames (retrieved by getting constructor.name) (e.g. `Item`)
 * Type expressions are case-sensitive, it is possible to allow multiple types by using the `|` symbol.
 *
 * @private
 * @param {Array} givenArray Array of the passed in arguments
 * @param {Array} expectedArray Array of the expected argument types. The index should match the index of the passed in argument. Each element is a type expression and defines the required type of the matching argument.
 * @returns {TypeOfArguments}
 */
declare function typeOfArguments(givenArray: any[], expectedArray: any[]): TypeOfArguments;
/**
 * {@link TypeOfArguments} validates the arguments' types passed to a function.
 *
 * @private
 * It's functionality was inspired by the typeof-arguments npm package (https://www.npmjs.com/package/typeof-arguments).
 */
declare class TypeOfArguments {
    constructor(givenArray: any, expectedArray: any);
    _getActualType(value: any): "string" | "number" | "bigint" | "boolean" | "symbol" | "undefined" | "object" | "function";
    _getExpectedTypes(expected: any): any;
}
//# sourceMappingURL=typeOfArguments.d.ts.map