const osgi = require('./osgi');
const log = require('./log')('provider'); // eslint-disable-line no-unused-vars
// const utils = require('./utils');

function getAllFunctionNames (obj) {
  let props = [];
  let o = obj;
  do {
    props = props.concat(Object.getOwnPropertyNames(o));
    o = Object.getPrototypeOf(o);
  } while (o.constructor.name !== 'AbstractProvider');

  return props.filter(p => typeof obj[p] === 'function');
}

class AbstractProvider {
  constructor (type) {
    this.typeName = type.class.getName();
    this.JavaType = Java.extend(type);// require('@runtime/osgi').classutil.extend(type);
  }

  register () {
    const javaConfig = {};

    const functionNamesToBind = getAllFunctionNames(this)
      .filter(f => f !== 'constructor')
      .filter(f => f !== 'javaType');

    for (const fn of functionNamesToBind) {
      javaConfig[fn] = this[fn].bind(this);
    }

    const hostProvider = this.processHostProvider(new this.JavaType(javaConfig));

    this.hostProvider = hostProvider;

    osgi.registerService(this.hostProvider, this.typeName);
  }

  processHostProvider (hostProvider) {
    return hostProvider;
  }
}

module.exports = {
  AbstractProvider
};
