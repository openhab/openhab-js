const Semantics = Java.type('org.openhab.core.model.script.actions.Semantics');

/**
 * Class representing the Semantic features of an openHAB Item.
 *
 * @memberof items
 * @hideconstructor
 */
class ItemSemantics {
  constructor(rawItem) {
    this.rawItem = rawItem;
  }

  /**
   * The type of the semantic equipment or `null` if none is set.
   * @type {string|null}
   */
  get equipmentType() {
    try {
      return Java.typeName(Semantics.getEquipmentType(this.rawItem)).replace('org.openhab.core.semantics.model.equipment.', '');
    } catch {
      return null;
    }
  }

  /**
   * The type of the semantic location or `null` if none is set.
   * @type {string|null}
   */
  get locationType() {
    try {
      return Java.typeName(Semantics.getLocationType(this.rawItem)).replace('org.openhab.core.semantics.model.location.', '');
    } catch (error) {
      return null;
    }
  }

  /**
   * The type of the semantic point or `null` if none is set.
   * @type {string|null}
   */
  get pointType() {
    try {
      return Java.typeName(Semantics.getPointType(this.rawItem)).replace('org.openhab.core.semantics.model.point.', '');
    } catch {
      return null;
    }
  }

  /**
   * The type of the semantic property or `null` if none is set.
   * @type {string|null}
   */
  get propertyType() {
    try {
      return Java.typeName(Semantics.getPropertyType(this.rawItem)).replace('org.openhab.core.semantics.model.property.', '');
    } catch {
      return null;
    }
  }

  /**
   * Determines the semantic type (i.e. a subtype of Location, Equipment or Point) or `null` if no semantics are set.
   * @type {string|null}
   */
  get semanticType() {
    if (Semantics.isEquipment(this.rawItem)) {
      return 'Equipment';
    } else if (Semantics.isLocation(this.rawItem)) {
      return 'Location';
    } else if (Semantics.isPoint(this.rawItem)) {
      return 'Point';
    } else {
      return null;
    }
  }

  /**
   * True if the Item is a Location
   * @type {boolean}
   */
  get isLocation() {
    return Semantics.isLocation(this.rawItem);
  }

  /**
   * True if the Item is an Equipment
   * @type {boolean}
   */
  get isEquipment() {
    return Semantics.isEquipment(this.rawItem);
  }

  /**
   * True if the Item is a Point
   * @type {boolean}
   */
  get isPoint() {
    return Semantics.isPoint(this.rawItem);
  }

  /**
   * The Location Item where this Item is situated or `null` if it's not in a Location.
   * @type {Item|null}
   */
  get location() {
    const rawLoc = Semantics.getLocation(this.rawItem);
    return (rawLoc) ? items[rawLoc.name] : null;
  }

  /**
   * The Equipment Item where this Item is situated or `null` if it's not in an Equipment.
   * @type {Item|null}
   */
  get equipment() {
    const rawEqu = Semantics.getEquipment(this.rawItem);
    return (rawLoc) ? items[rawEqu.name] : null;
  }
}

module.exports = ItemSemantics;
