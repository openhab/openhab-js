/**
 * Gets metadata with the given name from the given Item.
 *
 * @memberOf items.metadata
 * @param {string} itemName the name of the Item
 * @param {string} namespace name of the metadata
 * @returns {{configuration: *, value: string}|null} metadata or `null` if the Item has no metadata with the given name
 */
export function getMetadata(itemName: string, namespace: string): {
    configuration: any;
    value: string;
} | null;
/**
 * Updates or adds the given metadata to an Item.
 *
 * @memberof items.metadata
 * @param {string} itemName the name of the Item
 * @param {string} namespace name of the metadata
 * @param {string} value value for this metadata
 * @param {object} [configuration] optional metadata configuration
 * @returns {{configuration: *, value: string}|null} old metadata or `null` if the Item has no metadata with the given name
 */
export function replaceMetadata(itemName: string, namespace: string, value: string, configuration?: object): {
    configuration: any;
    value: string;
} | null;
/**
 * Removes metadata with a given name from a given Item.
 *
 * @memberof items.metadata
 * @param {string} itemName the name of the Item
 * @param {string} namespace name of the metadata
 * @returns {{configuration: *, value: string}|null} removed metadata or `null` if the Item has no metadata with the given name
 */
export function removeMetadata(itemName: string, namespace: string): {
    configuration: any;
    value: string;
} | null;
export declare const itemchannellink: typeof import("./itemchannellink");
//# sourceMappingURL=metadata.d.ts.map