/**
 * Gets an ItemChannelLink from the provider.
 *
 * @memberof items.metadata.itemchannellink
 * @param {string} itemName the name of the Item
 * @param {string} channelUID
 * @returns {{itemName: string, configuration: *, channelUID: string}|null} the ItemChannelLink or `null` if none exists
 */
export function getItemChannelLink(itemName: string, channelUID: string): {
    itemName: string;
    configuration: any;
    channelUID: string;
} | null;
/**
 * Adds or updates an ItemChannelLink.
 *
 * @memberof items.metadata.itemchannellink
 * @param {string} itemName the name of the Item
 * @param {string} channelUID
 * @param {object} [conf] channel configuration
 * @returns {boolean} `true` if the channel link was added, `false` if it was updated
 */
export function replaceItemChannelLink(itemName: string, channelUID: string, conf?: object): boolean;
/**
 * Removes an ItemChannelLink from the provider. Therefore, the channel link is removed from the Item.
 *
 * @memberof items.metadata.itemchannellink
 * @param {string} itemName the name of the Item
 * @param {string} channelUID
 * @returns {{itemName: string, configuration: *, channelUID: string}|null} the removed ItemChannelLink or `null` if none exists
 */
export function removeItemChannelLink(itemName: string, channelUID: string): {
    itemName: string;
    configuration: any;
    channelUID: string;
} | null;
//# sourceMappingURL=itemchannellink.d.ts.map