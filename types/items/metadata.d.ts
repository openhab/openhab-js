export type Item = {
    rawItem: HostItem;
    persistence: import("./item-persistence");
    semantics: import("./item-semantics");
    readonly type: string;
    readonly name: string;
    readonly label: string;
    readonly state: string;
    readonly numericState: number;
    readonly quantityState: import("../quantity").Quantity;
    readonly rawState: HostState;
    readonly previousState: string;
    readonly previousNumericState: number;
    readonly previousQuantityState: import("../quantity").Quantity;
    readonly previousRawState: any;
    readonly lastStateUpdateTimestamp: any;
    readonly lastStateUpdateInstant: any;
    readonly lastStateChangeTimestamp: any;
    readonly lastStateChangeInstant: any;
    readonly members: any[];
    readonly descendents: any[];
    readonly isUninitialized: boolean;
    getMetadata(namespace?: string): ItemMetadata | {
        namespace: ItemMetadata;
    };
    replaceMetadata(namespace: string, value: string, configuration?: any): ItemMetadata;
    removeMetadata(namespace?: string): ItemMetadata;
    sendCommand(value: any, expire?: JSJoda.Duration, onExpire?: any): void;
    sendCommandIfDifferent(value: any): boolean;
    sendIncreaseCommand(value: any): boolean;
    sendDecreaseCommand(value: any): boolean;
    getToggleState(): "PAUSE" | "PLAY" | "OPEN" | "CLOSED" | "ON" | "OFF";
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
 * Adds metadata of a single namespace to an Item.
 *
 * If this is called from file-based scripts, the metadata is registered with the ScriptedMetadataProvider and shares the same lifecycle as the script.
 * You can still persist the metadata permanently in this case by setting the `persist` parameter to `true`.
 * If this is called from UI-based scripts, the metadata is stored to the ManagedMetadataProvider and independent of the script's lifecycle.
 *
 * @memberof items.metadata
 * @param {Item|string} itemOrName {@link Item} or the name of the Item
 * @param {string} namespace name of the metadata
 * @param {string} value value for this metadata
 * @param {object} [configuration] optional metadata configuration
 * @param {boolean} [persist=false] whether to persist the metadata permanently (only respected for file-based scripts)
 * @returns {ItemMetadata} the added metadata
 * @throws {Error} if the Item already has metadata of the given namespace
 */
export function addMetadata(itemOrName: Item | string, namespace: string, value: string, configuration?: object, persist?: boolean): ItemMetadata;
/**
 * Updates or adds metadata of a single namespace to an Item.
 * When using file-based scripts, it is recommended to use {@link items.metadata.addMetadata} instead.
 *
 * If metadata is not provided by this script or the ManagedMetadataProvider, it is not editable and a warning is logged.
 *
 * @see items.Item.replaceMetadata
 * @memberof items.metadata
 * @param {Item|string} itemOrName {@link Item} or the name of the Item
 * @param {string} namespace name of the metadata
 * @param {string} value value for this metadata
 * @param {object} [configuration] optional metadata configuration
 * @returns {ItemMetadata|null} old metadata or `null` if the Item had no metadata with the given name
 */
export function replaceMetadata(itemOrName: Item | string, namespace: string, value: string, configuration?: object): ItemMetadata | null;
/**
 * Removes metadata of a single namespace or of all namespaces from a given Item.
 *
 * @see items.Item.removeMetadata
 * @memberof items.metadata
 * @param {Item|string} itemOrName {@link Item} or the name of the Item
 * @param {string} [namespace] name of the metadata: if provided, only metadata of this namespace is removed, else all metadata is removed
 * @returns {ItemMetadata|null} removed metadata OR `null` if the Item has no metadata under the given namespace, or it cannot be removed or all metadata was removed
 */
export function removeMetadata(itemOrName: Item | string, namespace?: string): ItemMetadata | null;
/**
 * Item metadata namespace.
 * This namespace provides access to Item metadata.
 *
 * @namespace items.metadata
 */
/**
 * @typedef {import('./items').Item} Item
 * @private
 */
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
     * The metadata value.
     * @type {string}
     */
    value: string;
    /**
     * The metadata configuration.
     * @type {object}
     */
    configuration: object;
}
export declare namespace itemChannelLink {
    function get(): typeof import("./itemchannellink");
}
//# sourceMappingURL=metadata.d.ts.map