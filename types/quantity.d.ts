export type Item = {
    rawItem: HostItem;
    persistence: import("./items/item-persistence");
    /**
     * QuantityError is thrown when {@link Quantity} creation or operation fails.
     * It is used to wrap the underlying Java Exceptions and add some additional information and a JS stacktrace to it.
     */
    semantics: import("./items/item-semantics");
    readonly type: string;
    readonly name: string;
    readonly label: string;
    readonly state: string;
    readonly numericState: number;
    readonly quantityState: Quantity;
    readonly rawState: HostState;
    readonly members: any[];
    readonly descendents: any[];
    readonly isUninitialized: boolean;
    getMetadata(namespace?: string): {
        value: string;
        configuration: any;
    } | {
        namespace: {
            value: string;
            configuration: any;
        };
    };
    replaceMetadata(namespace: string, value: string, configuration?: any): {
        configuration: any;
        value: string;
    };
    removeMetadata(namespace?: string): {
        value: string;
        configuration: any;
    };
    sendCommand(value: any): void;
    sendCommandIfDifferent(value: any): boolean;
    sendIncreaseCommand(value: any): boolean;
    sendDecreaseCommand(value: any): boolean;
    "__#6@#getToggleState"(): "PAUSE" | "PLAY" | "OPEN" | "CLOSED" | "ON" | "OFF";
    sendToggleCommand(): void;
    postToggleUpdate(): void;
    postUpdate(value: any): void;
    readonly groupNames: string[];
    addGroups(...groupNamesOrItems: any[]): void;
    removeGroups(...groupNamesOrItems: any[]): void;
    readonly tags: string[];
    addTags(...tagNames: string[]): void;
    removeTags(...tagNames: string[]): void;
    toString(): any;
};
/**
 * The Quantity allows easy Units of Measurement/Quantity handling by wrapping the openHAB {@link QuantityType}.
 *
 * @private
 * @param {Item|string|Quantity|QuantityType} value either a Quantity-compatible {@link Item}, a string consisting of a numeric value and a dimension, e.g. `5.5 m`, a {@link Quantity} or a {@link QuantityType}
 * @returns {Quantity}
 * @throws {QuantityError} if Quantity creation or operation failed
 * @throws {TypeError} if wrong argument type is provided
 */
export function getQuantity(value: Item | string | Quantity | any): Quantity;
/**
 * Class allowing easy Units of Measurement/Quantity handling by wrapping the openHAB {@link QuantityType}.
 *
 * Throws {@link QuantityError} when Quantity creation or operation failed due to wrong quantity or unit.
 * Throws {@link TypeError} when wrong argument type is provided.
 *
 * @hideconstructor
 */
export class Quantity {
    /**
     * @param {Item|string|Quantity|QuantityType} value
     */
    constructor(value: Item | string | Quantity | any);
    /**
     * @type {QuantityType}
     * @private
     */
    private rawQtyType;
    /**
     * Dimension of this Quantity, e.g. `[L]` for metres or `[L]²` for cubic-metres
     * @type {string}
     */
    get dimension(): string;
    /**
     * Unit of this Quantity, e.g. `Metre`, or `null` if not available
     * @type {string|null}
     */
    get unit(): string;
    /**
     * Unit symbol of this Quantity, e.g. `m`, or `null` if not available
     * @type {string|null}
     */
    get symbol(): string;
    /**
     * Float (decimal number) value of this Quantity
     * @type {number}
     */
    get float(): number;
    /**
     * Integer (non-decimal number) value of this Quantity
     * @type {number}
     */
    get int(): number;
    /**
     * Add the given value to this Quantity.
     *
     * @param {Item|string|Quantity} value Quantity-compatible {@link Item}, `string` consisting of amount and unit or a {@link Quantity}
     * @returns {Quantity} result as new Quantity
     */
    add(value: Item | string | Quantity): Quantity;
    /**
     * Divide this Quantity by the given value.
     *
     * @example
     * Quantity('20 W').divide(4); // is 5 W
     * Quantity('20 W').divide('4 W') // is 5
     *
     * @param {Item|number|string|Quantity} value usually a number; may also be an {@link Item} which is either Quantity-compatible or holds a number, a `string` consisting of amount and unit or a {@link Quantity}, but be careful: 1 W / 5 W = 0.2 which might not be what you want
     * @returns {Quantity} result as new Quantity
     */
    divide(value: Item | number | string | Quantity): Quantity;
    /**
     * Multiply this Quantity by the given value.
     *
     * @example
     * Quantity('20 W').multiply(4); // is 80 W
     * Quantity('20 W').multiply('4 W') // is 80 W^2
     *
     * @param {Item|number|string|Quantity} value usually a number; may also be an {@link Item} which is either Quantity-compatible or holds a number, a `string` consisting of amount and unit or a {@link Quantity}, but be careful: 1 W * 5 W = 5 W^2 which might not be what you want
     * @returns {Quantity} result as new Quantity
     */
    multiply(value: Item | number | string | Quantity): Quantity;
    /**
     * Subtract the given value from this Quantity.
     *
     * @param {Item|string|Quantity} value Quantity-compatible {@link Item}, `string` consisting of amount and unit or a {@link Quantity}
     * @returns {Quantity} result as new Quantity
     */
    subtract(value: Item | string | Quantity): Quantity;
    /**
     * Convert this Quantity to the given unit.
     *
     * @param {string} unit
     * @returns {Quantity|null} a new Quantity with the given unit or `null` if conversion to this unit is not possible
     * @throws {QuantityError} when unit cannot be parsed because it is invalid
     */
    toUnit(unit: string): Quantity | null;
    /**
     * Checks whether this Quantity is equal to the passed in value.
     *
     * @param {Item|string|Quantity} value Quantity-compatible {@link Item}, `string` consisting of amount and unit or a {@link Quantity}
     * @returns {boolean}
     */
    equal(value: Item | string | Quantity): boolean;
    /**
     * Checks whether this Quantity is larger than the passed in value.
     *
     * @param {Item|string|Quantity} value Quantity-compatible {@link Item}, `string` consisting of amount and unit or a {@link Quantity}
     * @returns {boolean}
     */
    greaterThan(value: Item | string | Quantity): boolean;
    /**
     * Checks whether this Quantity is larger than or equal to the passed in value.
     *
     * @param {Item|string|Quantity} value Quantity-compatible {@link Item}, `string` consisting of amount and unit or a {@link Quantity}
     * @returns {boolean}
     */
    greaterThanOrEqual(value: Item | string | Quantity): boolean;
    /**
     * Checks whether this Quantity is smaller than the passed in value.
     *
     * @param {Item|string|Quantity} value Quantity-compatible {@link Item}, `string` consisting of amount and unit or a {@link Quantity}
     * @returns {boolean}
     */
    lessThan(value: Item | string | Quantity): boolean;
    /**
     * Checks whether this Quantity is smaller than or equal to the passed in value.
     *
     * @param {Item|string|Quantity} value Quantity-compatible {@link Item}, `string` consisting of amount and unit or a {@link Quantity}
     * @returns {boolean}
     */
    lessThanOrEqual(value: Item | string | Quantity): boolean;
    toString(): any;
}
/**
 * QuantityError is thrown when {@link Quantity} creation or operation fails.
 * It is used to wrap the underlying Java Exceptions and add some additional information and a JS stacktrace to it.
 */
export class QuantityError extends Error {
    /**
     * @param {string} message
     */
    constructor(message: string);
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
export function _toQtyType(value: Item | string | Quantity, errorMsg?: string): any;
/**
 * @typedef {import('./items/items').Item} Item
 * @private
 */
/**
 * Takes either an {@link Item}, a `string`, a `number` or a {@link Quantity} and converts it to a {@link QuantityType} or {@link BigDecimal}.
 * When the Item state is a DecimalType, it is converted to a {@link BigDecimal}, otherwise to a {@link QuantityType}.
 * @param {Item|string|number|Quantity} value
 * @returns {BigDecimal|QuantityType}
 * @throws {TypeError} when parameter has the wrong type
 * @throws {QuantityError} when {@link BigDecimal} creation failed
 * @private
 */
export function _toBigDecimalOrQtyType(value: Item | string | number | Quantity): JavaBigDecimal | any;
//# sourceMappingURL=quantity.d.ts.map