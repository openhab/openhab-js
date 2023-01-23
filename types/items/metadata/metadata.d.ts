export type Item = import('../items').Item;
/**
 * Gets metadata with the given name from the given Item.
 *
 * @memberOf items.metadata
 * @param {Item|string} itemOrName {@link Item} or the name of the Item
 * @param {string} namespace name of the metadata
 * @returns {{configuration: object, value: string}|null} metadata or `null` if the Item has no metadata with the given name
 */
export function getMetadata(itemOrName: Item | string, namespace: string): {
    configuration: object;
    value: string;
} | null;
/**
 * Updates or adds the given metadata to an Item.
 *
 * @memberof items.metadata
 * @param {Item|string} itemOrName {@link Item} or the name of the Item * @param {string} namespace name of the metadata
 * @param {string} value value for this metadata
 * @param {object} [configuration] optional metadata configuration
 * @returns {{configuration: object, value: string}|null} old metadata or `null` if the Item has no metadata with the given name
 */
export function replaceMetadata(itemOrName: Item | string, namespace: string, value: string, configuration?: object): {
    configuration: object;
    value: string;
} | null;
/**
 * Removes metadata with a given name from a given Item.
 *
 * @memberof items.metadata
 * @param {Item|string} itemOrName {@link Item} or the name of the Item
 * @param {string} namespace name of the metadata
 * @returns {{configuration: object, value: string}|null} removed metadata or `null` if the Item has no metadata with the given name
 */
export function removeMetadata(itemOrName: Item | string, namespace: string): {
    configuration: object;
    value: string;
} | null;
export declare const itemchannellink: typeof import("./itemchannellink");
//# sourceMappingURL=metadata.d.ts.map