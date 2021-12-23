'use strict';

const osgi = require('./osgi');

function getAllFunctionNames(obj) {
    var props = [];
    var o = obj;
    do {
        props = props.concat(Object.getOwnPropertyNames(o));
        o = Object.getPrototypeOf(o);
    } while (o.constructor.name !== 'AbstractProvider');

    return props.filter(p => typeof obj[p] === 'function');
}

class AbstractProvider {
    constructor(type) {
        this.typeName = type.class.getName();
        this.javaType = Java.extend(type);//require('@runtime/osgi').classutil.extend(type);
    }

    register() {
        let javaConfig = {};

        let functionNamesToBind = getAllFunctionNames(this).
            filter(f => f !== 'constructor').
            filter(f => f !== 'javaType');

        for(let fn of functionNamesToBind) {
            javaConfig[fn] = this[fn].bind(this);
        }
    
        let hostProvider = this.processHostProvider(new this.javaType(javaConfig));

        this.hostProvider = hostProvider;

        osgi.registerService(this.hostProvider, this.typeName);
    }

    processHostProvider(hostProvider) {
        return hostProvider;
    }
}

module.exports = {
    AbstractProvider
}
