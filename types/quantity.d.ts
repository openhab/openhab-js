declare function _exports(value: string): Quantity;
export = _exports;
/**
 * Class allowing easy Units of Measurement/Quantity handling by wrapping the openHAB {@link QuantityType}.
 *
 * @hideconstructor
 */
declare class Quantity {
    /**
     * @param {string} value a string consisting of a numeric value and a dimension, e.g. `5.5 m`
     */
    constructor(value: string);
    /**
     * @type {QuantityType}
     * @private
     */
    private raw;
    /**
     * Dimension of this Quantity, e.g. `[L]` for metres or `[L]²` for cubic-metres.
     * @returns {string}
     */
    get dimension(): string;
    /**
     * Unit of this Quantity, e.g. `Metre`.
     * @returns {string|null}
     */
    get unit(): string;
    /**
     * Unit symbol of this Quantitiy, e.g. `m`.
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
     * @param {string|Quantity} value
     * @returns {Quantity} this Quantity
     */
    add(value: string | Quantity): Quantity;
    /**
     * Divide this Quantity by the given value.
     * @param {number|string|Quantity} value
     * @returns {Quantity} this Quantity
     */
    divide(value: number | string | Quantity): Quantity;
    /**
     * Multiply this Quantity by the given value.
     * @param {number|string|Quantity} value
     * @returns {Quantity} this Quantity
     */
    multiply(value: number | string | Quantity): Quantity;
    /**
     * Subtract the given value from this Quantity.
     * @param {string|Quantity} value
     * @returns {Quantity} this Quantity
     */
    subtract(value: string | Quantity): Quantity;
    /**
     * Convert this Quantity to the given unit.
     * @param {string} unit
     * @returns {Quantity} this with the new unit
     */
    toUnit(unit: string): Quantity;
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
    largerThan(value: string | Quantity): boolean;
    /**
     * Checks whether this Quantity is larger than or equal to the passed in value.
     * @param {string|Quantity} value
     * @returns {boolean}
     */
    largerThanOrEqual(value: string | Quantity): boolean;
    /**
     * Checks whether this Quantity is smaller than the passed in value.
     * @param {string|Quantity} value
     * @returns {boolean}
     */
    smallerThan(value: string | Quantity): boolean;
    /**
     * Checks whether this Quantity is smaller than or equal to the passed in value.
     * @param {string|Quantity} value
     * @returns {boolean}
     */
    smallerThanOrEqual(value: string | Quantity): boolean;
    toString(): any;
    /**
       * Takes either a {@link Quantity}, a `string` or a `number` and converts it to a {@link QuantityType} or {@link BigDecimal}.
       * @param {number|string|Quantity} value
       * @returns {BigDecimal|QuantityType}
       * @throws {TypeError} if parameter has the wrong type
       * @private
       */
    private _stringOrNumberOrQtyToQtyType;
    /**
       * Takes either a {@link Quantity} or a `string` and converts it to a {@link QuantityType}.
       * @param {string|Quantity} value
       * @returns {QuantityType}
       * @throws {TypeError} if parameter has the wrong type
       * @private
       */
    private _stringOrQtyToQtyType;
}
//# sourceMappingURL=quantity.d.ts.map