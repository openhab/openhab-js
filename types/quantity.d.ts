declare function _exports(value: string | Quantity | any): Quantity;
declare namespace _exports {
    export { Quantity as QuantityClass };
    export { QuantityError };
    export { _stringOrNumberOrQtyToQtyType };
    export { _stringOrQtyToQtyType };
}
export = _exports;
/**
 * Class allowing easy Units of Measurement/Quantity handling by wrapping the openHAB {@link QuantityType}.
 *
 * Throws {@link QuantityError} if Quantity creation or operation failed.
 * Throws {@link TypeError} if wrong argument type is provided.
 *
 * @hideconstructor
 */
declare class Quantity {
    /**
     * @param {string|Quantity|QuantityType} value either a string consisting of a numeric value and a dimension, e.g. `5.5 m`, a {@link Quantity} or a {@link QuantityType}
     */
    constructor(value: string | Quantity | any);
    /**
     * @type {QuantityType}
     * @private
     */
    private raw;
    /**
     * Dimension of this Quantity, e.g. `[L]` for metres or `[L]²` for cubic-metres as `string`
     * @returns {string}
     */
    get dimension(): string;
    /**
     * Unit of this Quantity, e.g. `Metre` as `string` or `null` if not available
     * @returns {string|null}
     */
    get unit(): string;
    /**
     * Unit symbol of this Quantitiy, e.g. `m` as `string` or `null` if not available
     * @returns {string|null}
     */
    get symbol(): string;
    /**
     * Float (decimal number) value of this Quantity.
     * @returns {number}
     */
    get float(): number;
    /**
     * Integer (non-decimal number) value of this Quantity.
     * @returns {number}
     */
    get int(): number;
    /**
     * Add the given value to this Quantity.
     * @param {string|Quantity} value `string` consisting of amount and unit or a Quantity
     * @returns {Quantity} result as new Quantity
     */
    add(value: string | Quantity): Quantity;
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
    divide(value: number | string | Quantity): Quantity;
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
    multiply(value: number | string | Quantity): Quantity;
    /**
     * Subtract the given value from this Quantity.
     * @param {string|Quantity} value `string` consisting of amount and unit or a Quantity
     * @returns {Quantity} result as new Quantity
     */
    subtract(value: string | Quantity): Quantity;
    /**
     * Convert this Quantity to the given unit.
     * @param {string} unit
     * @returns {Quantity|null} a new Quantity with the given unit or `null` if conversion to this unit is not possible
     */
    toUnit(unit: string): Quantity | null;
    /**
     * Checks whether this Quantity is equal to the passed in value.
     * @param {string|Quantity} value
     * @returns {boolean}
     */
    equal(value: string | Quantity): boolean;
    /**
     * Checks whether this Quantity is larger than the passed in value.
     * @param {string|Quantity} value
     * @returns {boolean}
     */
    greaterThan(value: string | Quantity): boolean;
    /**
     * Checks whether this Quantity is larger than or equal to the passed in value.
     * @param {string|Quantity} value
     * @returns {boolean}
     */
    greaterThanOrEqual(value: string | Quantity): boolean;
    /**
     * Checks whether this Quantity is smaller than the passed in value.
     * @param {string|Quantity} value
     * @returns {boolean}
     */
    lessThan(value: string | Quantity): boolean;
    /**
     * Checks whether this Quantity is smaller than or equal to the passed in value.
     * @param {string|Quantity} value
     * @returns {boolean}
     */
    lessThanOrEqual(value: string | Quantity): boolean;
    toString(): any;
}
/**
 * QuantityError is thrown when {@link Quantity} creation or operation fails.
 * It is used to wrap the underlying Java Exceptions and add some additional information and a JS stacktrace to it.
 */
declare class QuantityError extends Error {
    /**
     * @param {string} message
     */
    constructor(message: string);
}
/**
 * Takes either a {@link Quantity}, a `string` or a `number` and converts it to a {@link QuantityType} or {@link BigDecimal}.
 * @param {number|string|Quantity} value
 * @returns {BigDecimal|QuantityType}
 * @throws {TypeError} if parameter has the wrong type
 * @throws {Error} if {@link BigDecimal} creation failed
 * @private
 */
declare function _stringOrNumberOrQtyToQtyType(value: number | string | Quantity): any | any;
/**
 * Takes either a {@link Quantity} or a `string` and converts it to a {@link QuantityType}.
 * @param {string|Quantity} value
 * @param {string} [errorMsg] error message to throw if parameter has wrong type
 * @returns {QuantityType}
 * @throws {TypeError} if parameter has the wrong type
 * @throws {Error} if {@link QuantityType} creation failed
 * @private
 */
declare function _stringOrQtyToQtyType(value: string | Quantity, errorMsg?: string): any;
//# sourceMappingURL=quantity.d.ts.map