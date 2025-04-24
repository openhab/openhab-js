export type Item = {
    rawItem: HostItem;
    persistence: import("../item-persistence");
    semantics: import("../item-semantics");
    readonly type: string;
    readonly name: string;
    readonly label: string;
    readonly state: string;
    readonly numericState: number;
    readonly quantityState: import("../../quantity").Quantity;
    readonly rawState: HostState;
    readonly previousState: string;
    readonly previousNumericState: number;
    readonly previousQuantityState: import("../../quantity").Quantity;
    readonly previousRawState: HostState;
    readonly lastStateUpdateTimestamp: any;
    readonly lastStateUpdateInstant: any;
    readonly lastStateChangeTimestamp: any;
    readonly lastStateChangeInstant: any;
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
 * Gets a channel link of from an Item.
 *
 * @memberof items.metadata.itemchannellink
 * @param {Item|string} itemOrName {@link Item} or the name of the Item
 * @param {string} channelUID
 * @returns {{itemName: string, configuration: *, channelUID: string}|null} the ItemChannelLink or `null` if none exists
 */
export function getItemChannelLink(itemOrName: Item | string, channelUID: string): {
    itemName: string;
    configuration: any;
    channelUID: string;
};
/**
 * Adds or updates a channel link of an Item.
 *
 * @memberof items.metadata.itemchannellink
 * @param {Item|string} itemOrName {@link Item} or the name of the Item
 * @param {string} channelUID
 * @param {object} [conf] channel configuration
 * @returns {{itemName: string, configuration: object, channelUID: string}|null} the old ItemChannelLink or `null` if it did not exist
 */
export function replaceItemChannelLink(itemOrName: Item | string, channelUID: string, conf?: object): {
    itemName: string;
    configuration: object;
    channelUID: string;
};
/**
 * Removes a channel link from an Item.
 *
 * @memberof items.metadata.itemchannellink
 * @param {Item|string} itemOrName {@link Item} or the name of the Item
 * @param {string} channelUID
 * @returns {{itemName: string, configuration: object, channelUID: string}|null} the removed ItemChannelLink or `null` if none exists
 */
export function removeItemChannelLink(itemOrName: Item | string, channelUID: string): {
    itemName: string;
    configuration: object;
    channelUID: string;
};
/**
 * Removes all channel links from the given Item.
 *
 * @memberof items.metadata.itemchannellink
 * @param {string} itemName the name of the Item
 * @returns {number} number of links removed
 */
export function removeLinksForItem(itemName: string): number;
/**
 * Removes all orphaned (Item or channel missing) links.
 *
 * @memberof items.metadata.itemchannellink
 * @returns {number} number of links removed
 */
export function removeOrphanedItemChannelLinks(): number;
//# sourceMappingURL=itemchannellink.d.ts.map