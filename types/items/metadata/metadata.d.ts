export type Item = import('../items').Item;
/**
 * Gets metadata of a single namespace or of all namespaces from a given Item.
 *
 * @example
 * // Get metadata of ALL namespaces
 * var meta = items.metadata.getMetadata(items.Hallway_Light);
 * var namespaces = Object.keys(meta); // Get metadata namespaces
 * // Get metadata of a single namespace
 * meta = items.metadata.getMetadata(items.Hallway_Light, 'expire');
 *
 * @see items.Item.getMetadata
 * @memberOf items.metadata
 * @param {Item|string} itemOrName {@link Item} or the name of the Item
 * @param {string} [namespace] name of the metadata: if provided, only metadata of this namespace is returned, else all metadata is returned
 * @returns {{ namespace: ItemMetadata }|ItemMetadata|null} all metadata as an object with the namespaces as properties OR metadata of a single namespace or `null` if that namespace doesn't exist; the metadata itself is of type {@link ItemMetadata}
 */
export function getMetadata(itemOrName: Item | string, namespace?: string): {
    namespace: ItemMetadata;
} | ItemMetadata | null;
/**
 * Updates or adds metadata of a single namespace to an Item.
 *
 * @see items.Item.replaceMetadata
 * @memberof items.metadata
 * @param {Item|string} itemOrName {@link Item} or the name of the Item * @param {string} namespace name of the metadata
 * @param {string} namespace name of the metadata
 * @param {string} value value for this metadata
 * @param {object} [configuration] optional metadata configuration
 * @returns {ItemMetadata|null} old metadata or `null` if the Item has no metadata with the given name
 */
export function replaceMetadata(itemOrName: Item | string, namespace: string, value: string, configuration?: object): ItemMetadata | null;
/**
 * Removes metadata of a single namespace or of all namespaces from a given Item.
 *
 * @see items.Item.removeMetadata
 * @memberof items.metadata
 * @param {Item|string} itemOrName {@link Item} or the name of the Item
 * @param {string} [namespace] name of the metadata: if provided, only metadata of this namespace is removed, else all metadata is removed
 * @returns {ItemMetadata|null} removed metadata OR `null` if the Item has no metadata under the given namespace or all metadata was removed
 */
export function removeMetadata(itemOrName: Item | string, namespace?: string): ItemMetadata | null;
/**
 * Class representing an openHAB Item metadata namespace
 *
 * @memberof items.metadata
 * @hideconstructor
 */
export class ItemMetadata {
    /**
     * @param {*} rawMetadata {@link https://www.openhab.org/javadoc/latest/org/openhab/core/items/metadata org.openhab.core.items.Metadata}
     */
    constructor(rawMetadata: any);
    /**
     * metadata namespace's value
     * @type {string}
     */
    value: string;
    /**
     * metadata namespace's configuration
     * @type {object}
     */
    configuration: object;
}
export declare const itemchannellink: typeof import("./itemchannellink");
//# sourceMappingURL=metadata.d.ts.map