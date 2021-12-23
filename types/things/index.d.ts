/**
 *
 * @param {String} thingTypeUID
 * @param {String} id
 * @param {String} bridgeUID
 * @returns
 */
export function newThingBuilder(thingTypeUID: string, id: string, bridgeUID: string): ThingBuilder;
/**
 *
 * @param {String} thingUID
 * @param {String} channelId
 * @param {String} acceptedItemType
 * @returns
 */
export function newChannelBuilder(thingUID: string, channelId: string, acceptedItemType: string): ChannelBuilder;
/**
 *
 */
export class ThingBuilder {
    constructor(thingTypeUID: any, thingId: any, bridgeUID: any);
    thingTypeUID: any;
    thingId: any;
    thingUID: any;
    rawBuilder: any;
    withChannel(channel: any): ThingBuilder;
    withLabel(label: any): ThingBuilder;
    build(): OHThing;
}
/**
 *
 */
export class ChannelBuilder {
    constructor(thingUID: any, channelId: any, acceptedItemType: any);
    rawBuilder: any;
    withConfiguration(config: any): ChannelBuilder;
    withKind(stateOrTrigger: any): ChannelBuilder;
    withLabel(label: any): ChannelBuilder;
    withType(channelType: any): ChannelBuilder;
    build(): OHChannel;
}
/**
 *
 */
declare class OHThing {
    constructor(rawThing: any);
    rawThing: any;
}
/**
 *
 */
declare class OHChannel {
    constructor(rawChannel: any);
    rawChannel: any;
    get uid(): any;
}
export {};
