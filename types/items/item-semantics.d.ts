export = ItemSemantics;
/**
 * Class representing the Semantic features of an openHAB Item.
 *
 * @memberof items
 * @hideconstructor
 */
declare class ItemSemantics {
    constructor(rawItem: any);
    rawItem: any;
    /**
     * The type of the semantic equipment or `null` if none is set.
     * @type {string|null}
     */
    get equipmentType(): string;
    /**
     * The type of the semantic location or `null` if none is set.
     * @type {string|null}
     */
    get locationType(): string;
    /**
     * The type of the semantic point or `null` if none is set.
     * @type {string|null}
     */
    get pointType(): string;
    /**
     * The type of the semantic property or `null` if none is set.
     * @type {string|null}
     */
    get propertyType(): string;
    /**
     * Determines the semantic type (i.e. a subtype of Location, Equipment or Point) or `null` if no semantics are set.
     * @type {string|null}
     */
    get semanticType(): string;
    /**
     * Whether the Item is a Location
     * @type {boolean}
     */
    get isLocation(): boolean;
    /**
     * Whether the Item is an Equipment
     * @type {boolean}
     */
    get isEquipment(): boolean;
    /**
     * Whether the Item is a Point
     * @type {boolean}
     */
    get isPoint(): boolean;
    /**
     * The Location Item where this Item is situated or `null` if it's not in a Location.
     * @type {Item|null}
     */
    get location(): any;
    /**
     * The Equipment Item where this Item is situated or `null` if it's not in an Equipment.
     * @type {Item|null}
     */
    get equipment(): any;
}
//# sourceMappingURL=item-semantics.d.ts.map