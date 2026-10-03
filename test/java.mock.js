/**
 * {@link https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/lang/Class.html java.lang.Class}
 */
class Class {
  constructor (name) {
    this.name = name;
  }

  getName () {
    return this.name;
  }

  getSimpleName () {
    return this.name.split('.').pop();
  }
}

/**
 * {@link https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/lang/String.html java.lang.String}
 */
class String {
  constructor (string) {
    this.string = string;
  }

  equals (other) {
    return this.string === (typeof other === 'string' ? other : other?.toString());
  }

  toString () {
    return this.string;
  }
}

/**
 * {@link https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/lang/IllegalStateException.html java.lang.IllegalStateException}
 */
class IllegalStateException extends Error {}

/**
 * {@link https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/math/BigDecimal.html java.math.BigDecimal}
 */
class BigDecimal {
  static valueOf = jest.fn(() => new BigDecimal());
}

/**
 * {@link https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/time/Instant.html java.time.Instant}
 */
class Instant {
  toEpochMilli () {
    return 0;
  }
}

/**
 * {@link https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/time/ZonedDateTime.html java.time.ZonedDateTime}
 */
class ZonedDateTime {
  toInstant () {
    return new Instant();
  }

  getZone () {
    return new ZoneId();
  }
}

/**
 * {@link https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/time/ZoneId.html java.time.ZoneId}
 */
class ZoneId {
  toString () {
    return 'UTC';
  }
}

/**
 * {@link https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/stream/Stream.html java.util.stream.Stream}
 */
class Stream {
  constructor (elements = []) {
    this.elements = Array.from(elements);
  }

  filter (predicate) {
    return new Stream(this.elements.filter(predicate));
  }

  forEach (action) {
    this.elements.forEach(action);
  }
}

/**
 * {@link https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/HashMap.html java.util.HashMap}
 */
class HashMap extends Map {
  forEach (callback, thisArg) {
    super.forEach((value, key) => {
      callback.call(thisArg, key, value, this);
    });
  }

  getClass () {
    return new Class('java.util.HashMap');
  }
}

/**
 * {@link https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/HashSet.html java.util.HashSet}
 */
class HashSet {
  add () {}
}

/**
 * {@link https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/Hashtable.html java.util.Hashtable}
 */
class Hashtable {
  put () {}
}

/**
 * {@link https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/ArrayList.html java.util.ArrayList}
 */
class ArrayList {
  add () {}
}

/**
 * {@link https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/UUID.html java.util.UUID}
 */
class UUID {
  static randomUUID = jest.fn(() => new UUID());

  toString = jest.fn(() => 'UUID');
}

/**
 * {@link https://www.slf4j.org/api/org/slf4j/Logger.html org.slf4j.Logger}
 */
class Logger {
  debug () {}
  error () {}
  info () {}
  trace () {}
  warn () {}
}

/**
 * {@link https://www.slf4j.org/api/org/slf4j/LoggerFactory.html org.slf4j.LoggerFactory}
 */
class LoggerFactory {
  static getLogger () {
    return new Logger();
  }
}

/**
 * {@link https://docs.osgi.org/javadoc/osgi.core/8.0.0/org/osgi/framework/FrameworkUtil.html org.osgi.framework.FrameworkUtil}
 */
class FrameworkUtil {
  static getBundleContext () {}
  static getBundle () {
    return {
      getVersion: () => ({
        toString: () => '4.0.0'
      })
    };
  }
}

module.exports = {
  Class,
  String,
  IllegalStateException,
  ArrayList,
  BigDecimal,
  HashMap,
  Instant,
  ZonedDateTime,
  Stream,
  FrameworkUtil,
  HashSet,
  Hashtable,
  UUID,
  Logger,
  LoggerFactory
};
