const Qty = require('js-quantities');

// Polyfill support for additional unit notations
// Use absolute temperature units here to allow conversion of measured temperatures
const replaceUnits = (value) => {
  if (typeof value === 'string') {
    return value
      .replace(/(°|° )C/, 'tempC')
      .replace(/(°|° )F/, 'tempF')
      .replace('K', 'tempK')
      .replace('°', 'degree')
      .replace('fur', 'furlong') // Imperial length unit
      .replace('lea', 'league') // Imperial length unit
      .replace('ɡₙ', 'gee') // Acceleration: Standard Gravity
      .replace('Ws', 'W*s') // Energy: Watt Seconds
      .replace(/VArh/i, 'VAr*h') // Energy: Volt-Ampere Reactive Hours
      .replace('lx', 'lux') // Illuminance: Lux
      .replace(/(dBm)(W)?/, 'dB*mW') // Power: Decibel-Milliwatts
      .replace('VAh', 'VA*h'); // Power: Volt-Ampere Hours
  } else {
    return value;
  }
};

module.exports = (initValue, initUnits) => Qty(replaceUnits(initValue), replaceUnits(initUnits));
