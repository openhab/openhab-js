// java.lang.Class (https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/lang/Class.html)
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

// java.math.BigDecimal (https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/math/BigDecimal.html)
class BigDecimal {}
BigDecimal.valueOf = jest.fn(() => new BigDecimal());

class Instant {
  toEpochMilli () {
    return 0;
  }
}

class ZonedDateTime {
  toInstant () {
    return new Instant();
  }

  getZone () {
    return new ZoneId();
  }
}

class ZoneId {
  toString () {
    return 'UTC';
  }
}

class HashSet {
  add () {}
}

class Hashtable {
  put () {}
}

class ArrayList {
  add () {}
}

class UUID {
  toString = jest.fn(() => 'UUID');
}
UUID.randomUUID = jest.fn(() => new UUID());

class Logger {
  debug () {}
  error () {}
  info () {}
  trace () {}
  warn () {}
}

class LoggerFactory {
  static getLogger () {
    return new Logger();
  }
}

class FrameworkUtil {
  static getBundleContext () {}
}

module.exports = {
  Class,
  ArrayList,
  BigDecimal,
  Instant,
  ZonedDateTime,
  FrameworkUtil,
  HashSet,
  Hashtable,
  UUID,
  Logger,
  LoggerFactory
};
