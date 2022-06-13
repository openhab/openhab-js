declare class ThingBuilder {
    constructor(thingTypeUID: any, thingId: any, bridgeUID: any);
    thingTypeUID: any;
    thingId: any;
    thingUID: any;
    rawBuilder: any;
    withChannel(channel: any): ThingBuilder;
    withLabel(label: any): ThingBuilder;
    build(): OHThing;
}
declare class ChannelBuilder {
    constructor(thingUID: any, channelId: any, acceptedItemType: any);
    rawBuilder: any;
    withConfiguration(config: any): ChannelBuilder;
    withKind(stateOrTrigger: any): ChannelBuilder;
    withLabel(label: any): ChannelBuilder;
    withType(channelType: any): ChannelBuilder;
    build(): OHChannel;
}
/**
 * Class representing an openHAB Thing
 *
 * @memberof things
 */
export class Thing {
    /**
       * Create an Thing, wrapping a native Java openHAB Thing. Don't use this constructor, instead call {@link getThing}.
       * @param {HostThing} rawThing Java Thing from Host
       * @hideconstructor
       */
    constructor(rawThing: HostThing);
    rawThing: HostThing;
    /**
     * Thing's bridge UID as `String`
     */
    get bridgeUID(): any;
    /**
     * label as `String`
     */
    get label(): any;
    /**
     * physical location as `String`
     */
    get location(): any;
    /**
     * status as `String`
     */
    get status(): any;
    /**
     * status info (more detailed status text) as `String`
     */
    get statusInfo(): any;
    /**
     * Thing type UID as `String`
     */
    get thingTypeUID(): any;
    /**
     * Thing UID as `String`
     */
    get uid(): any;
    /**
     * whether the Thing is enabled or not (`Boolean`)
     */
    get isEnabled(): any;
    /**
     * Set the label.
     * @param {String} label Thing label
     */
    setLabel(label: string): void;
    /**
     * Sets the physical location.
     * @param {String} location physical location of the Thing
     */
    setLocation(location: string): void;
    /**
     * Sets the property value for the property identified by the given name.
     * @param {String} name name of the property
     * @param {String} value value for the property
     */
    setProperty(name: string, value: string): void;
    /**
     * Sets the enabled status of the Thing.
     * @param {Boolean} enabled whether the Thing is enabled or not
     */
    setEnabled(enabled: boolean): void;
}
/**
 * Gets an openHAB Thing.
 *
 * @memberof things
 * @param {String} uid UID of the thing
 * @param {Boolean} [nullIfMissing] whether to return null if the Thing cannot be found (default is to throw an exception)
 * @returns {things.Thing} the Thing
 */
export function getThing(uid: string, nullIfMissing?: boolean): things.Thing;
/**
 * Gets all openHAB Things.
 *
 * @memberof things
 * @returns {things.Thing[]} all Things
 */
export function getThings(): things.Thing[];
/**
 * Things namespace.
 * This namespace handles querying and editing openHAB Things.
 *
 * @namespace things
 */
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
//# sourceMappingURL=things.d.ts.map