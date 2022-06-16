/**
 * This function will return the Metadata object associated with the specified Item.
 *
 * @memberof metadata
 * @param {string} itemName name of the Item
 * @param {string} namespace name of the namespace
 * @returns {String|null} the metadata as a string, or null
 */
export function getValue(itemName: string, namespace: string): string | null;
export function addValue(itemName: any, namespace: any, value: any, config: any): void;
export function updateValue(itemName: any, namespace: any, value: any, config: any): any;
/**
 * Adds (inserts) or updates a metadata value.
 *
 * @memberof metadata
 * @param {string} itemName the name of the Item
 * @param {string} namespace the name of the namespace
 * @param {string} value the value to insert or update
 * @param {Map<String, String>} [config] configuration of namespace
 * @returns {boolean} true if the value was added, false if it was updated
 */
export function upsertValue(itemName: string, namespace: string, value: string, config?: Map<string, string>): boolean;
export declare const provider: typeof import("./metadata-provider");
export declare const itemchannellink: typeof import("./itemchannellink");
//# sourceMappingURL=metadata.d.ts.map