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
     * The type of the semantic equipment.
     * @returns {string|null} equipment type or null if no equipment is set
     */
    get equipmentType(): string;
    /**
     * The type of the semantic location.
     * @returns {string|null} location type of null if no location is set
     */
    get locationType(): string;
    /**
     * The type of the semantic point.
     * @return {string|null} point type or null if no point is set
     */
    get pointType(): string;
    /**
     * The type of the semantic property.
     * @return {string|null} property type or null if no property is set
     */
    get propertyType(): string;
    /**
     * Determines the semantic type (i.e. a sub-type of Location, Equipment or Point).
     * @returns {string|null} semantic type or null if no semantics is set
     */
    get semanticType(): string;
}
//# sourceMappingURL=item-semantics.d.ts.map