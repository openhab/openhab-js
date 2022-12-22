const Qty = require('js-quantities');

// Polyfill support for additional unit notations and additional units as well
// Use absolute temperature units here to allow conversion of measured temperatures
const replaceUnits = (value) => {
  if (typeof value === 'string') {
    // Add support for °dH (Deutscher Härtegrad) for AmountOfSubstance
    if (value.endsWith('°dH')) {
      // See https://www.internetchemie.info/chemie-lexikon/d/deutscher-haertegrad.php (german) for the equation/math
      let dh = parseFloat(value);
      if (isNaN(dh)) dh = 1;
      const mmol_l = dh * 0.1783; // eslint-disable-line camelcase
      return mmol_l + ' mmol/l'; // eslint-disable-line camelcase
    }
    // Add support for DU (Dobson Unit) for ArealDensity
    if (value.endsWith('DU')) {
      // See https://de.wikipedia.org/wiki/Dobson-Einheit (german) for the equation/math
      let du = parseFloat(value);
      if (isNaN(du)) du = 1;
      const mmol_m2 = du * 0.44615; // eslint-disable-line camelcase
      return mmol_m2 + ' mmol/m^2'; // eslint-disable-line camelcase
    }
    // Add support for Second Angle (arc second) for Angle
    if (value.endsWith('\'\'')) {
      // See https://en.wikipedia.org/wiki/Minute_and_second_of_arc for the equation/math
      let arcsecond = parseFloat(value);
      if (isNaN(arcsecond)) arcsecond = 1;
      const degree = arcsecond / 3600;
      return degree + ' deg';
    }
    // Add support for Minute Angle (arc minute) for Angle
    if (value.endsWith('\'')) {
      // See https://en.wikipedia.org/wiki/Minute_and_second_of_arc for the equation/math
      let arcminute = parseFloat(value);
      if (isNaN(arcminute)) arcminute = 1;
      const degree = arcminute / 60;
      return degree + ' deg';
    }
    return value
      .replace(/(°|° )C/, 'tempC')
      .replace(/(°|° )F/, 'tempF')
      .replace('K', 'tempK')
      .replace('°', 'degree')
      .replace('fur', 'furlong') // Imperial length unit
      .replace('lea', 'league') // Imperial length unit
      .replace('ɡₙ', 'gee') // Acceleration: Standard Gravity
      .replace('Ws', 'W*s') // Energy: Watt Seconds
      .replace(/varh/i, 'var*h') // Energy: Volt-Ampere Reactive Hours
      .replace('lx', 'lux') // Illuminance: Lux
      .replace(/(dBm)(W)?/, 'dB*mW') // Power: Decibel-Milliwatts
      .replace('VAh', 'VA*h'); // Power: Volt-Ampere Hours
  } else {
    return value;
  }
};

module.exports = (initValue, initUnits) => Qty(replaceUnits(initValue), replaceUnits(initUnits));
