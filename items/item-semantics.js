const Semantics = Java.type('org.openhab.core.model.script.actions.Semantics');

/**
 * Class representing the Semantic features of an openHAB Item.
 *
 * @memberof items
 * @hideconstructor
 */
class ItemSemantics {
  constructor (rawItem) {
    this.rawItem = rawItem;
  }

  /**
   * The type of the semantic equipment.
   * @returns {string|null} equipment type or null if no equipment is set
   */
  get equipmentType () {
    try {
      return Java.typeName(Semantics.getEquipmentType(this.rawItem)).replace('org.openhab.core.semantics.model.equipment.', '');
    } catch {
      return null;
    }
  }

  /**
   * The type of the semantic location.
   * @returns {string|null} location type of null if no location is set
   */
  get locationType () {
    try {
      return Java.typeName(Semantics.getLocationType(this.rawItem)).replace('org.openhab.core.semantics.model.location.', '');
    } catch (error) {
      return null;
    }
  }

  /**
   * The type of the semantic point.
   * @return {string|null} point type or null if no point is set
   */
  get pointType () {
    try {
      return Java.typeName(Semantics.getPointType(this.rawItem)).replace('org.openhab.core.semantics.model.point.', '');
    } catch {
      return null;
    }
  }

  /**
   * The type of the semantic property.
   * @return {string|null} property type or null if no property is set
   */
  get propertyType () {
    try {
      return Java.typeName(Semantics.getPropertyType(this.rawItem)).replace('org.openhab.core.semantics.model.property.', '');
    } catch {
      return null;
    }
  }

  /**
   * Determines the semantic type (i.e. a sub-type of Location, Equipment or Point).
   * @returns {string|null} semantic type or null if no semantics is set
   */
  get semanticType () {
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
}

module.exports = ItemSemantics;
