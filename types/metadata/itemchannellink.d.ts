/**
 * Adds (inserts) or updates an Item channel link.
 *
 * @memberof metadata
 * @param {String} itemName the name of the Item
 * @param {String} channel channelUID as string
 * @param {Map<String, String>} [conf] Map of channel configuration
 * @returns true if the channel link was added, false if it was updated
 */
export function upsertItemChannelLink(itemName: string, channel: string, conf?: Map<string, string>): boolean;
/**
 * Removes an ItemChannelLink from the provider. Therefore, the channel link is removed from the Item.
 *
 * @memberof metadata
 * @param {String} itemName the name of the Item
 * @param {String} channel channelUID as string
 * @returns {ItemChannelLink} the removed ItemChannelLink
 */
export function removeItemChannelLink(itemName: string, channel: string): any;
//# sourceMappingURL=itemchannellink.d.ts.map