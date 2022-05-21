
const log = require('./log')('utils');

const HashSet = Java.type('java.util.HashSet');
const ArrayList = Java.type('java.util.ArrayList');

/**
 * Utils namespace.
 * This namespace handles utilities, especially for conversion from and to Java data types.
 *
 * @namespace utils
 */

function getAllPropertyNames (obj) {
  const proto = Object.getPrototypeOf(obj);
  const inherited = (proto) ? getAllPropertyNames(proto) : [];
  return [...new Set(Object.getOwnPropertyNames(obj).concat(inherited))];
}

/**
 * Convert JavaScript Set to Java Set.
 *
 * @memberOf utils
 * @param {Set} set JavaScript Set Object ({@link https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Global_Objects/Set})
 * @returns {java.util.Set} Java Set ({@link https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/util/Set.html})
 */
const jsSetToJavaSet = function (set) {
  const rv = new HashSet();

  set.forEach(e => rv.add(e));

  return rv;
};

/**
 * Convert JavaScript Array to Java Set.
 *
 * @memberOf utils
 * @param {Array} arr JavaScript Array
 * @returns {java.util.Set} Java Set ({@link https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/util/Set.html})
 */
const jsArrayToJavaSet = function (arr) {
  const set = new HashSet();

  for (const i of arr) {
    set.add(i);
  }

  return set;
};

/**
 * Convert JavaScript Array to Java List.
 *
 * @memberOf utils
 * @param {Array} arr JavaScript Array
 * @returns {java.util.List} Java List ({@link https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/util/List.html})
 */
const jsArrayToJavaList = function (arr) {
  const list = new ArrayList();

  for (const i of arr) {
    list.add(i);
  }

  return list;
};

/**
 * Convert Java List to JavaScript Array.
 *
 * @memberOf utils
 * @param {java.util.List} set Java Set ({@link https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/util/List.html})
 * @returns {Array} JavaScript Array
 */
const javaListToJsArray = function (list) {
  return Java.from(list);
};

/**
 * Convert Java Set to JavaScript Array.
 *
 * @memberOf utils
 * @param {java.util.Set} set Java Set ({@link https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/util/Set.html})
 * @returns {Array} JavaScript Array
 */
const javaSetToJsArray = function (set) {
  return Java.from(new ArrayList(set));
};

/**
 * Convert Java Set to JavaScript Set.
 *
 * @memberOf utils
 * @param {java.util.Set} set Java Set ({@link https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/util/Set.html})
 * @returns {Set} JavaScript Set Object ({@link https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Global_Objects/Set})
 */
const javaSetToJsSet = function (set) {
  return new Set(exports.javaSetToJsArray(set));
};

/**
 * Generate a random UUID.
 *
 * @memberOf utils
 * @returns {String} random UUID
 */
const randomUUID = () => Java.type('java.util.UUID').randomUUID();

/**
 * Outputs all members and properties of an object and whether it is a JS or a Java Object to the log.
 *
 * @memberOf utils
 * @param {*} obj object
 */
const dumpObject = function (obj) {
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
        log.info('  Java.typeName(obj.class) = {}', Java.typeName(obj.class));
        if (Java.typeName(obj.class) === 'java.util.HashMap') {
          log.info('Dumping contents...');
          const keys = obj.keySet().toArray();
          for (const key in keys) {
            log.info(`${keys[key]}(${typeof keys[key]}) = ${obj.get(keys[key])}(${typeof obj.get(keys[key])})`);
            if (typeof keys[key] === 'object') {
              log.info('Dumping key...');
              exports.dumpObject(keys[key]);
            }
          }
        }
      }
    } else if (typeof obj === 'string') {
      log.info('String value = ' + obj);
    }

    log.info('  getOwnPropertyNames(obj) = {}', Object.keys(obj).toString());
    log.info('  getAllPropertyNames(obj) = {}', getAllPropertyNames(obj).toString());
    // log.info("obj.toString() = {}", obj.toString());
    // log.info("JSON.stringify(obj) = {}", JSON.stringify(obj));
  } catch (e) {
    log.info('Failed to dump object: ' + e.message);
  }
};

/**
 * Checks whether an object is instance of a Java class.
 *
 * @memberOf utils
 * @param {*} instance object
 * @param {java.lang.Class} type Java class ({@link https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/lang/Class.html})
 * @returns {boolean} whether it is an instance of a Java class
 * @throws error if type is not a java class
 */
const isJsInstanceOfJava = function (instance, type) {
  if (!Java.isType(type)) {
    throw Error('type is not a java class');
  }

  if (instance === null || instance === undefined || instance.class === null || instance.class === undefined) {
    return false;
  }

  return type.class.isAssignableFrom(instance.class);
};

module.exports = {
  jsSetToJavaSet,
  jsArrayToJavaSet,
  jsArrayToJavaList,
  javaListToJsArray,
  javaSetToJsArray,
  javaSetToJsSet,
  randomUUID,
  dumpObject,
  isJsInstanceOfJava
};
