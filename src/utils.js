/**
 * openHAB JavaScript library version
 *
 * @deprecated use {@link environment.OPENHAB_JS_VERSION} instead
 * @memberof utils
 * @name OPENHAB_JS_VERSION
 * @type {string}
 */
const OPENHAB_JS_VERSION = require('../package.json').version;
const log = require('./log')('utils');
const { _isZonedDateTime, _isInstant, _isDuration } = require('./helpers');
const time = require('@js-joda/core');

const JSet = Java.type('java.util.Set');
const HashSet = Java.type('java.util.HashSet');
const JList = Java.type('java.util.List');
const ArrayList = Java.type('java.util.ArrayList');
const JMap = Java.type('java.util.Map');
const LinkedHashMap = Java.type('java.util.LinkedHashMap');
const LinkedHashSet = Java.type('java.util.LinkedHashSet');

const ZonedDateTime = Java.type('java.time.ZonedDateTime');
const Instant = Java.type('java.time.Instant');
const Duration = Java.type('java.time.Duration');
const LocalDate = Java.type('java.time.LocalDate');
const LocalDateTime = Java.type('java.time.LocalDateTime');

/**
 * Utils namespace.
 * This namespace handles utilities, especially for conversion from and to Java data types.
 *
 * @namespace utils
 */

function _getAllPropertyNames (obj) {
  const proto = Object.getPrototypeOf(obj);
  const inherited = (proto) ? _getAllPropertyNames(proto) : [];
  return [...new Set(Object.getOwnPropertyNames(obj).concat(inherited))];
}

/**
 * Convert JavaScript Set to Java Set.
 *
 * @memberOf utils
 * @param {Set} set JavaScript Set
 * @returns {JavaSet} Java Set
 */
function jsSetToJavaSet (set) {
  const rv = new HashSet();
  set.forEach(e => rv.add(e));
  return rv;
}

/**
 * Convert JavaScript Array to Java Set.
 *
 * @memberOf utils
 * @param {Array} arr
 * @returns {JavaSet} Java Set
 */
function jsArrayToJavaSet (arr) {
  const set = new HashSet();
  for (const i of arr) {
    set.add(i);
  }
  return set;
}

/**
 * Convert JavaScript Array to Java List.
 *
 * @memberOf utils
 * @param {Array} arr JavaScript Array
 * @returns {JavaList}
 */
function jsArrayToJavaList (arr) {
  const list = new ArrayList();
  for (const i of arr) {
    list.add(i);
  }
  return list;
}

/**
 * Convert Java List to JavaScript Array.
 *
 * @memberOf utils
 * @param {JavaList} list
 * @returns {Array} JavaScript Array
 */
function javaListToJsArray (list) {
  return Java.from(list);
}

/**
 * Convert Java Set to JavaScript Array.
 *
 * @memberOf utils
 * @param {JavaSet} set
 * @returns {Array} JavaScript Array
 */
function javaSetToJsArray (set) {
  return Java.from(new ArrayList(set));
}

/**
 * Convert Java Map to JavaScript Map.
 *
 * @memberof utils
 * @param {JavaMap} map
 * @returns {Map} JavaScript Map
 */
function javaMapToJsMap (map) {
  const js = new Map();
  javaSetToJsSet(map.keySet()).forEach((key) => js.set(key, map.get(key)));
  return js;
}

/**
 * Convert Java Map to JavaScript Object.
 *
 * @memberof utils
 * @param {JavaMap} map
 * @returns {Record} JavaScript Object
 */
function javaMapToJsObj (map) {
  const obj = {};
  map.forEach((key, val) => { obj[key] = val; });
  return obj;
}

/**
 * Convert Java Set to JavaScript Set.
 *
 * @memberOf utils
 * @param {JavaSet} set Java Set ({@link https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/util/Set.html})
 * @returns {Set} JavaScript Set Object ({@link https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Global_Objects/Set})
 */
function javaSetToJsSet (set) {
  return new Set(javaSetToJsArray(set));
}

/**
 * Recursively convert any value, array or object to use Java types. Functions are not supported.
 *
 * @memberOf utils
 * @param {*} val the value to convert
 * @returns {*} The value converted to using Java types.
 */
function javaify (val) {
  if (val === null || val === undefined) {
    return null;
  }

  if (Java.isJavaObject(val)) {
    return val;
  }

  if (typeof val === 'function') {
    throw new Error('Functions aren\'t allowed');
  }

  if (typeof val !== 'object') {
    return val;
  }

  // Convert JS-Joda objects
  if (_isZonedDateTime(val)) {
    return ZonedDateTime.parse(val.toString());
  }
  if (_isInstant(val)) {
    return Instant.ofEpochMilli(val.toEpochMilli());
  }
  if (_isDuration(val)) {
    return Duration.ofNanos(val.toNanos());
  }

  if (val.constructor && val.constructor.name) {
    const typeName = val.constructor.name;
    if (typeName === 'LocalDate') {
      return LocalDate.parse(val.toString());
    }
    if (typeName === 'LocalDateTime') {
      return LocalDateTime.parse(val.toString());
    }
  }

  // Convert JavaScript Date
  if (val instanceof Date) {
    return Instant.ofEpochMilli(val.getTime());
  }

  // Convert arrays
  if (Array.isArray(val)) {
    const list = new ArrayList();
    for (const element of val) {
      list.add(javaify(element));
    }
    return list;
  }

  // Convert JS Maps
  if (val instanceof Map) {
    const javaMap = new LinkedHashMap();
    val.forEach((value, key) => {
      javaMap.put(key, javaify(value));
    });
    return javaMap;
  }

  // Convert JS Sets
  if (val instanceof Set) {
    const javaSet = new LinkedHashSet();
    val.forEach((value) => {
      javaSet.add(javaify(value));
    });
    return javaSet;
  }

  // Convert JS objects
  const map = new LinkedHashMap();
  for (const key of Object.keys(val)) {
    map.put(key, javaify(val[key]));
  }
  return map;
}

/**
 * Recursively convert Java Lists, Sets, and Maps and their entries/values to their JS counterparts.
 * `java.time.*` objects are not automatically converted.
 *
 * @memberOf utils
 * @param {*} val the value to convert
 * @return {*} The value converted to using JavaScript types.
 */
function jsify (val) {
  if (val === null || val === undefined) {
    return null;
  }

  if (!Java.isJavaObject(val)) {
    return val;
  }

  if (val instanceof ZonedDateTime) {
    const epoch = val.toInstant().toEpochMilli();
    const instant = time.Instant.ofEpochMilli(epoch);
    const zone = time.ZoneId.of(val.getZone().toString());
    return time.ZonedDateTime.ofInstant(instant, zone);
  }
  if (val instanceof Instant) {
    return time.Instant.ofEpochMilli(val.toEpochMilli());
  }
  if (val instanceof Duration) {
    return time.Duration.ofNanos(val.toNanos());
  }
  if (val instanceof LocalDate) {
    return time.LocalDate.parse(val.toString());
  }
  if (val instanceof LocalDateTime) {
    return time.LocalDateTime.parse(val.toString());
  }

  // Convert Java List to JS array
  if (val instanceof JList) {
    const arr = [];
    val.forEach((element) => {
      arr.push(jsify(element));
    });
    return arr;
  }

  // Convert Java Set to JS Set
  if (val instanceof JSet) {
    const set = new Set();
    val.forEach((element) => {
      set.add(jsify(element));
    });
    return set;
  }

  // Convert Java Map to JS object
  if (val instanceof JMap) {
    const obj = {};
    val.forEach((key, value) => {
      obj[key] = jsify(value);
    });
    return obj;
  }

  return val;
}

/**
 * Generate a random UUID.
 *
 * @memberOf utils
 * @returns {string} random UUID
 */
const randomUUID = () => Java.type('java.util.UUID').randomUUID().toString();

/**
 * Outputs all members and properties of an object and whether it is a JS or a Java Object to the log.
 *
 * @memberOf utils
 * @param {*} obj object
 * @param {boolean} [dumpProps=false] whether properties also should be dumped
 */
function dumpObject (obj, dumpProps = false) {
  try {
    log.info('Dumping object...');
    log.info('  typeof obj = {}', (typeof obj));
    const isJavaObject = Java.isJavaObject(obj);
    log.info('  Java.isJavaObject(obj) = {}', isJavaObject);
    const isJavaType = Java.isType(obj);
    log.info('  Java.isType(obj) = {}', isJavaType);
    if (isJavaObject) {
      if (isJavaType) {
        log.info('  Java.typeName(obj) = {}', Java.typeName(obj));
      } else {
        log.info('  Java.typeName(obj.getClass()) = {}', Java.typeName(obj.getClass()));
        if (Java.typeName(obj.getClass()) === 'java.util.HashMap') {
          log.info('Dumping contents...');
          const keys = obj.keySet().toArray();
          for (const key in keys) {
            log.info('{}({}) = {}({})', keys[key], typeof keys[key], obj.get(keys[key]), typeof obj.get(keys[key]));
            if (typeof keys[key] === 'object') {
              log.info('Dumping key {} ...', keys[key]);
              dumpObject(keys[key]);
            }
          }
        }
      }
    } else if (typeof obj === 'string') {
      log.info('  string value = ' + obj);
    } else if (typeof obj === 'boolean') {
      log.info('  boolean value = ' + obj);
    } else if (typeof obj === 'number') {
      log.info('  number value = ' + obj);
    } else if (typeof obj === 'object' && obj != null) {
      const keys = Object.keys(obj);
      log.info('  getOwnPropertyNames(obj) = {}', keys.toString());
      log.info('  getAllPropertyNames(obj) = {}', _getAllPropertyNames(obj).toString());
      // log.info("obj.toString() = {}", obj.toString());
      // log.info("JSON.stringify(obj) = {}", JSON.stringify(obj));
      if (dumpProps === true) {
        for (const key in keys) {
          log.info('Dumping property {} ...', keys[key]);
          dumpObject(obj[keys[key]]);
        }
      }
    } else {
      log.info('  value = ' + obj);
    }
  } catch (e) {
    log.info('Failed to dump object: ' + e.message);
  }
}

module.exports = {
  jsSetToJavaSet,
  jsArrayToJavaSet,
  jsArrayToJavaList,
  javaListToJsArray,
  javaSetToJsArray,
  javaSetToJsSet,
  javaMapToJsMap,
  javaMapToJsObj,
  javaify,
  jsify,
  randomUUID,
  dumpObject,
  OPENHAB_JS_VERSION
};
