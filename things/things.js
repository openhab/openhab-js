const osgi = require('../osgi');
const utils = require('../utils');
const log = require('../log')('things'); // eslint-disable-line no-unused-vars

const thingRegistry = osgi.getService('org.openhab.core.thing.ThingRegistry');
const thingMgr = osgi.getService('org.openhab.core.thing.ThingManager');

const JavaThingBuilder = Java.type('org.openhab.core.thing.binding.builder.ThingBuilder');
const ThingTypeUID = Java.type('org.openhab.core.thing.ThingTypeUID');
const JavaChannelBuilder = Java.type('org.openhab.core.thing.binding.builder.ChannelBuilder');
const ChannelUID = Java.type('org.openhab.core.thing.ChannelUID');
const ThingUID = Java.type('org.openhab.core.thing.ThingUID');
const ChannelKind = Java.type('org.openhab.core.thing.type.ChannelKind');
const ChannelTypeUID = Java.type('org.openhab.core.thing.type.ChannelTypeUID');
const Configuration = Java.type('org.openhab.core.config.core.Configuration');

/**
 * Things namespace.
 * This namespace handles querying and editing openHAB Things.
 *
 * @namespace things
 */

class OHThing {
  constructor (rawThing) {
    this.rawThing = rawThing;
  }
}

class OHChannel {
  constructor (rawChannel) {
    this.rawChannel = rawChannel;
  }

  get uid () {
    return this.rawChannel.getUID().toString();
  }
}

class ThingBuilder {
  constructor (thingTypeUID, thingId, bridgeUID) {
    if (typeof thingTypeUID === 'string') {
      thingTypeUID = new ThingTypeUID(...thingTypeUID.split(':'));
    }

    this.thingTypeUID = thingTypeUID;
    this.thingId = thingId;

    if (typeof bridgeUID !== 'undefined') {
      if (typeof bridgeUID === 'string') {
        const [bridgeBindingId, bridgeThingTypeId, bringThingId] = bridgeUID.split(':');
        bridgeUID = new ThingUID(new ThingTypeUID(bridgeBindingId, bridgeThingTypeId), bringThingId);
      }
      this.thingUID = new ThingUID(thingTypeUID, bridgeUID, thingId);
      this.rawBuilder = JavaThingBuilder.create(thingTypeUID, this.thingUID);
      this.rawBuilder.withBridge(bridgeUID);
    } else {
      this.thingUID = new ThingUID(thingTypeUID, thingId);
      this.rawBuilder = JavaThingBuilder.create(thingTypeUID, this.thingUID);
    }
  }

  withChannel (channel) {
    this.rawBuilder.withChannel(channel.rawChannel);
    return this;
  }

  withLabel (label) {
    this.rawBuilder.withLabel(label);
    return this;
  }

  build () {
    return new OHThing(this.rawBuilder.build());
  }
}

class ChannelBuilder {
  constructor (thingUID, channelId, acceptedItemType) {
    const channelUID = new ChannelUID(thingUID, channelId);
    this.rawBuilder = JavaChannelBuilder.create(channelUID, acceptedItemType);
  }

  withConfiguration (config) {
    this.rawBuilder.withConfiguration(new Configuration(config));
    return this;
  }

  withKind (stateOrTrigger) {
    this.rawBuilder.withKind(ChannelKind.parse(stateOrTrigger));
    return this;
  }

  withLabel (label) {
    this.rawBuilder.withLabel(label);
    return this;
  }

  withType (channelType) {
    if (typeof channelType === 'string') {
      channelType = new ChannelTypeUID(channelType);
    }
    this.rawBuilder.withType(channelType);
    return this;
  }

  build () {
    return new OHChannel(this.rawBuilder.build());
  }
}

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
    this.rawThing = rawThing;
  }

  /**
   * Thing's bridge UID as `String`
   */
  get bridgeUID () {
    try {
      return this.rawThing.getBridgeUID().getID();
    } catch (error) {
      // Thing has no bridge
    }
  }

  /**
   * label as `String`
   */
  get label () {
    return this.rawThing.getLabel();
  }

  /**
   * physical location as `String`
   */
  get location () {
    return this.rawThing.getLocation();
  }

  /**
   * status as `String`
   */
  get status () {
    return this.rawThing.getStatus().toString();
  }

  /**
   * status info (more detailed status text) as `String`
   */
  get statusInfo () {
    return this.rawThing.getStatusInfo().toString();
  }

  /**
   * Thing type UID as `String`
   */
  get thingTypeUID () {
    return this.rawThing.getThingTypeUID().toString();
  }

  /**
   * Thing UID as `String`
   */
  get uid () {
    return this.rawThing.getUID().toString();
  }

  /**
   * whether the Thing is enabled or not (`Boolean`)
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
}

/**
 * Gets an openHAB Thing.
 *
 * @memberof things
 * @param {string} uid UID of the thing
 * @param {boolean} [nullIfMissing] whether to return null if the Thing cannot be found (default is to throw an exception)
 * @returns {things.Thing} the Thing
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
 * @returns {things.Thing[]} all Things
 */
const getThings = function () {
  return utils.javaSetToJsArray(thingRegistry.getAll()).map(i => new Thing(i));
};

module.exports = {
  /**
   * Creates a new instance of ThingBuilder.
   *
   * @param {string} thingTypeUID UID of Thing type
   * @param {string} id id for Thing
   * @param {string} bridgeUID UID of Thing's bridge
   * @returns {ThingBuilder}
   */
  newThingBuilder: (thingTypeUID, id, bridgeUID) => new ThingBuilder(thingTypeUID, id, bridgeUID),
  /**
   * Creates a new instance of ChannelBuilder.
   *
   * @param {string} thingUID UID of the Thing
   * @param {string} channelId ID of the channel
   * @param {string} acceptedItemType accepted Item type, e.g. Switch`
   * @returns {ThingBuilder}
   */
  newChannelBuilder: (thingUID, channelId, acceptedItemType) => new ChannelBuilder(thingUID, channelId, acceptedItemType),
  Thing,
  getThing,
  getThings
};
