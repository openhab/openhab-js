/**
 * This function will return the Metadata object associated with the
 * specified Item.
 *
 * @memberof metadata
 * @param {String} name of the Item
 * @param {String} namespace name of the namespace
 * @returns {String|null} the metadata as a string, or null
 */
export function getValue(itemName: any, namespace: string): string | null;
export function addValue(itemName: any, namespace: any, value: any): void;
export function updateValue(itemName: any, namespace: any, value: any): any;
/**
 * Adds (inserts) or updates a metadata value.
 *
 * @param {String} itemName the name of the item
 * @param {String} namespace the name of the namespace
 * @param {String} value the value to insert or update
 * @returns {Boolean} true if the value was added, false if it was updated
 */
export function upsertValue(itemName: string, namespace: string, value: string): boolean;
export function createMetadata(itemName: any, namespace: any, value: any): any;
