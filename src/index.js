// lazy getters to avoid any reference loading all submodules
module.exports = {
  get log () { return require('./log'); },
  get rules () { return require('./rules'); },
  get items () { return require('./items'); },
  get things () { return require('./things'); },
  get triggers () { return require('./triggers'); },
  get actions () { return require('./actions'); },
  utils: new Proxy({}, {
    get: (target, name) => {
      if (name.startsWith('javaZDTToJsZDT')) {
        console.warn(`utils.${name} is deprecated, use time.javaZDTToJsZDT instead.`);
        return require('./time').javaZDTToJsZDT;
      } else if (name === 'javaInstantToJsInstant') {
        console.warn('utils.javaInstantToJsInstant is deprecated, use time.javaInstantToJsInstant instead.');
        return require('./time').javaInstantToJsInstant;
      }
      return require('./utils')[name];
    }
  }),
  get osgi () { return require('./osgi'); },
  get cache () { return require('./cache'); },
  get time () { return require('./time'); },
  get Quantity () { return require('./quantity').getQuantity; },
  get environment () { return require('./environment'); }
};
