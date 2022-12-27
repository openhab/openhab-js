const osgi = require('./osgi');
const utils = require('./utils');
const log = require('./log')('things'); // eslint-disable-line no-unused-vars

const thingRegistry = osgi.getService('org.openhab.core.thing.ThingRegistry');
const thingMgr = osgi.getService('org.openhab.core.thing.ThingManager');

const ThingUID = Java.type('org.openhab.core.thing.ThingUID');

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
class Thing {
  /**
     * Create an Thing, wrapping a native Java openHAB Thing. Don't use this constructor, instead call {@link getThing}.
     * @param {HostThing} rawThing Java Thing from Host
     * @hideconstructor
     */
  constructor (rawThing) {
    if (typeof rawThing === 'undefined') {
      throw Error('Supplied Thing is undefined');
    }
    /**
     * raw Java Thing
     * @type {HostThing}
     */
    this.rawThing = rawThing;
  }

  /**
   * Thing's bridge UID as `string` or `null` if the Thing has no bridge
   * @returns {string|null}
   */
  get bridgeUID () {
    try {
      return this.rawThing.getBridgeUID().toString();
    } catch (error) {
      // Thing has no bridge
      return null;
    }
  }

  /**
   * label as `string`
   * @returns {string}
   */
  get label () {
    return this.rawThing.getLabel();
  }

  /**
   * physical location as `string`
   * @returns {string}
   */
  get location () {
    return this.rawThing.getLocation();
  }

  /**
   * status as `string`
   * @returns {string}
   */
  get status () {
    return this.rawThing.getStatus().toString();
  }

  /**
   * status info (more detailed status text) as `string`
   * @returns {string}
   */
  get statusInfo () {
    return this.rawThing.getStatusInfo().toString();
  }

  /**
   * Thing type UID as `string`
   * @returns {string}
   */
  get thingTypeUID () {
    return this.rawThing.getThingTypeUID().toString();
  }

  /**
   * Thing UID as `string`
   * @returns {string}
   */
  get uid () {
    return this.rawThing.getUID().toString();
  }

  /**
   * whether the Thing is enabled or not (`boolean`)
   * @returns {boolean}
   */
  get isEnabled () {
    return this.rawThing.isEnabled();
  }

  /**
   * Set the label.
   * @param {string} label Thing label
   */
  setLabel (label) {
    this.rawThing.setLabel(label);
  }

  /**
   * Sets the physical location.
   * @param {string} location physical location of the Thing
   */
  setLocation (location) {
    this.rawThing.setLocation(location);
  }

  /**
   * Sets the property value for the property identified by the given name.
   * @param {string} name name of the property
   * @param {string} value value for the property
   */
  setProperty (name, value) {
    this.rawThing.setProperty(name, value);
  }

  /**
   * Sets the enabled status of the Thing.
   * @param {boolean} enabled whether the Thing is enabled or not
   */
  setEnabled (enabled) {
    thingMgr.setEnabled(this.rawThing.getUID(), enabled);
  }

  toString () {
    return this.rawThing.toString();
  }
}

/**
 * Gets an openHAB Thing.
 *
 * @memberof things
 * @param {string} uid UID of the thing
 * @param {boolean} [nullIfMissing] whether to return null if the Thing cannot be found (default is to throw an exception)
 * @returns {Thing} {@link things.Thing}
 */
const getThing = function (uid, nullIfMissing) {
  try {
    if (typeof uid === 'string' || uid instanceof String) {
      return new Thing(thingRegistry.get(new ThingUID(uid)));
    }
  } catch (e) {
    if (nullIfMissing) {
      return null;
    } else {
      throw e;
    }
  }
};

/**
 * Gets all openHAB Things.
 *
 * @memberof things
 * @returns {Thing[]} {@link things.Thing}[]: all Things
 */
const getThings = function () {
  return utils.javaSetToJsArray(thingRegistry.getAll()).map(i => new Thing(i));
};

module.exports = {
  Thing,
  getThing,
  getThings
};
