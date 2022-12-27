/**
 * Things namespace.
 * This namespace handles querying and editing openHAB Things.
 *
 * @namespace things
 */
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
    /**
     * raw Java Thing
     * @type {HostThing}
     */
    rawThing: HostThing;
    /**
     * Thing's bridge UID as `string` or `null` if the Thing has no bridge
     * @returns {string|null}
     */
    get bridgeUID(): string;
    /**
     * label as `string`
     * @returns {string}
     */
    get label(): string;
    /**
     * physical location as `string`
     * @returns {string}
     */
    get location(): string;
    /**
     * status as `string`
     * @returns {string}
     */
    get status(): string;
    /**
     * status info (more detailed status text) as `string`
     * @returns {string}
     */
    get statusInfo(): string;
    /**
     * Thing type UID as `string`
     * @returns {string}
     */
    get thingTypeUID(): string;
    /**
     * Thing UID as `string`
     * @returns {string}
     */
    get uid(): string;
    /**
     * whether the Thing is enabled or not (`boolean`)
     * @returns {boolean}
     */
    get isEnabled(): boolean;
    /**
     * Set the label.
     * @param {string} label Thing label
     */
    setLabel(label: string): void;
    /**
     * Sets the physical location.
     * @param {string} location physical location of the Thing
     */
    setLocation(location: string): void;
    /**
     * Sets the property value for the property identified by the given name.
     * @param {string} name name of the property
     * @param {string} value value for the property
     */
    setProperty(name: string, value: string): void;
    /**
     * Sets the enabled status of the Thing.
     * @param {boolean} enabled whether the Thing is enabled or not
     */
    setEnabled(enabled: boolean): void;
    toString(): any;
}
/**
 * Gets an openHAB Thing.
 *
 * @memberof things
 * @param {string} uid UID of the thing
 * @param {boolean} [nullIfMissing] whether to return null if the Thing cannot be found (default is to throw an exception)
 * @returns {Thing} {@link things.Thing}
 */
export function getThing(uid: string, nullIfMissing?: boolean): Thing;
/**
 * Gets all openHAB Things.
 *
 * @memberof things
 * @returns {Thing[]} {@link things.Thing}[]: all Things
 */
export function getThings(): Thing[];
//# sourceMappingURL=things.d.ts.map