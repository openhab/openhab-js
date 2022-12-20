const Qty = require('js-quantities');

// Use absolute temperature units here to allow conversion of measured temperatures
const replaceUnits = (value) => {
    if (typeof value === 'string') {
        return value
            .replace(/(°|° )C/, 'tempC')
            .replace(/(°|° )F/, 'tempF')
            .replace('K', 'tempK')
            .replace('°', 'degree');
    } else {
        return value;
    }
};

// Polyfill support for temperature units with the degree sign ° with or without a space in between, e.g. °C or °F
// Polyfill support for angle in degrees using the degree sign °
module.exports = (initValue, initUnits) => Qty(replaceUnits(initValue), replaceUnits(initUnits));
