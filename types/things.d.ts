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
     * Create a Thing, wrapping a native Java openHAB Thing. Don't use this constructor, instead call {@link getThing}.
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
     * @type {string|null}
     */
    get bridgeUID(): string;
    /**
     * Thing's label
     * @type {string}
     */
    get label(): string;
    /**
     * Physical location
     * @type {string}
     */
    get location(): string;
    /**
     * Thing stattus
     * @type {string}
     */
    get status(): string;
    /**
     * Thing status info (more detailed status text)
     * @type {string}
     */
    get statusInfo(): string;
    /**
     * Thing type UID
     * @type {string}
     */
    get thingTypeUID(): string;
    /**
     * Thing UID
     * @type {string}
     */
    get uid(): string;
    /**
     * Whether the Thing is enabled or not
     * @type {boolean}
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
 * Returns `null` if no Thing with the given UID exists.
 *
 * @memberof things
 * @param {string} uid UID of the thing
 * @returns {Thing} {@link things.Thing}
 */
export function getThing(uid: string): Thing;
/**
 * Gets all openHAB Things.
 *
 * @memberof things
 * @returns {Thing[]} {@link things.Thing}[]: all Things
 */
export function getThings(): Thing[];
//# sourceMappingURL=things.d.ts.map