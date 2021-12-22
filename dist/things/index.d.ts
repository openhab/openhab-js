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
export class ChannelBuilder {
    constructor(thingUID: any, channelId: any, acceptedItemType: any);
    rawBuilder: any;
    withConfiguration(config: any): ChannelBuilder;
    withKind(stateOrTrigger: any): ChannelBuilder;
    withLabel(label: any): ChannelBuilder;
    withType(channelType: any): ChannelBuilder;
    build(): OHChannel;
}
declare class OHThing {
    constructor(rawThing: any);
    rawThing: any;
}
declare class OHChannel {
    constructor(rawChannel: any);
    rawChannel: any;
    get uid(): any;
}
export declare function newThingBuilder(thingTypeUID: any, id: any, bridgeUID: any): ThingBuilder;
export declare function newChannelBuilder(thingUID: any, channelId: any, acceptedItemType: any): ChannelBuilder;
export {};
