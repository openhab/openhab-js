const Quantity = require('../quantities');
const Qty = require('js-quantities');

/*
Test whether js-quantities/the polyfill supports all base units from openHAB UoM.
openHAB UoM definitions are based on https://next.openhab.org/docs/concepts/units-of-measurement.html#list-of-units and converted with https://tableconvert.com/markdown-to-json.
*/
describe('quantities.js', function () {
  describe('supports imperial base unit', () => {
    const imperial = [
      ['Length', 'Inch', 'in'],
      ['Length', 'Foot', 'ft'],
      ['Length', 'Yard', 'yd'],
      ['Length', 'Chain', 'ch'],
      ['Length', 'Furlong', 'fur'],
      ['Length', 'Mile', 'mi'],
      ['Length', 'League', 'lea'],
      ['Pressure', 'Inch of Mercury', 'inHg'],
      ['Pressure', 'Pound per square inch', 'psi'],
      ['Speed', 'Miles per Hour', 'mph'],
      ['Temperature', 'Fahrenheit', '°F'],
      ['Volume', 'Gallon (US)', 'gal'],
      ['VolumetricFlowRate', 'Gallon (US) per minute', 'gal/min']
    ];
    describe.each(imperial)('of type %s with unit %s and symbol %s', (type, unit, symbol) => {
      it('doesn\'t throw Qty.Error.', () => {
        expect(() => Quantity('1 ' + symbol)).not.toThrowError(Qty.Error);
      });
      it('returns a Quantity.', () => {
        expect(Quantity('1' + symbol) instanceof Qty).toBe(true);
      });
    });
  });

  describe('supports SI base unit', () => {
    const si = [
      ['Acceleration', 'Metre per Second squared', 'm/s^2'],
      ['Acceleration', 'Standard Gravity', 'ɡₙ'],
      ['AmountOfSubstance', 'Mole', 'mol'],
      ['AmountOfSubstance', 'Deutscher Härtegrad', '°dH'],
      ['Angle', 'Radian', 'rad'],
      ['Angle', 'Degree', '°'],
      ['Angle', 'Minute Angle', "'"],
      ['Angle', 'Second Angle', "''"],
      ['Area', 'Square Metre', 'm^2'],
      ['ArealDensity', 'Dobson Unit', 'DU'],
      ['CatalyticActivity', 'Katal', 'kat'],
      ['DataAmount', 'Bit', 'bit'],
      ['DataAmount', 'Byte', 'B'],
      // Unsupported ['DataAmount', 'Octet', 'o'],
      ['DataTransferRate', 'Bit per Second', 'bit/s'],
      ['Density', 'Gram per cubic Metre', 'g/m^3'],
      ['Dimensionless', 'Percent', '%'],
      ['Dimensionless', 'Parts per Million', 'ppm'],
      ['Dimensionless', 'Decibel', 'dB'],
      ['ElectricPotential', 'Volt', 'V'],
      ['ElectricCapacitance', 'Farad', 'F'],
      ['ElectricCharge', 'Coulomb', 'C'],
      ['ElectricCharge', 'Ampere Hour', 'Ah'],
      ['ElectricConductance', 'Siemens', 'S'],
      ['ElectricConductivity', 'Siemens per Metre', 'S/m'],
      ['ElectricCurrent', 'Ampere', 'A'],
      ['ElectricInductance', 'Henry', 'H'],
      ['ElectricResistance', 'Ohm', 'Ω'],
      ['Energy', 'Joule', 'J'],
      ['Energy', 'Watt Second', 'Ws'],
      ['Energy', 'Watt Hour', 'Wh'],
      ['Energy', 'Volt-Ampere Hour', 'VAh'],
      ['Energy', 'Volt-Ampere Reactive Hour', 'varh'],
      ['Force', 'Newton', 'N'],
      ['Frequency', 'Hertz', 'Hz'],
      ['Illuminance', 'Lux', 'lx'],
      ['Intensity', 'Irradiance', 'W/m^2'],
      ['Intensity', 'Microwatt per square Centimeter', 'µW/cm^2'],
      ['Length', 'Metre', 'm'],
      ['LuminousFlux', 'Lumen', 'lm'],
      ['LuminousIntensity', 'Candela', 'cd'],
      ['MagneticFlux', 'Weber', 'Wb'],
      ['MagneticFluxDensity', 'Tesla', 'T'],
      ['Mass', 'Gram', 'g'],
      ['Power', 'Watt', 'W'],
      ['Power', 'Volt-Ampere', 'VA'],
      ['Power', 'Volt-Ampere Reactive', 'var'],
      ['Power', 'Decibel-Milliwatts', 'dBm'],
      ['Pressure', 'Pascal', 'Pa'],
      ['Pressure', 'Hectopascal', 'hPa'],
      ['Pressure', 'Millimetre of Mercury', 'mmHg'],
      ['Pressure', 'Bar', 'bar'],
      ['Radioactivity', 'Becquerel', 'Bq'],
      ['RadiationDoseAbsorbed', 'Gray', 'Gy'],
      ['RadiationDoseEffective', 'Sievert', 'Sv'],
      ['SolidAngle', 'Steradian', 'sr'],
      ['Speed', 'Metre per Second', 'm/s'],
      ['Speed', 'Knot', 'kn'],
      ['Temperature', 'Kelvin', 'K'],
      ['Temperature', 'Celsius', '°C'],
      // Unsupported ['Temperature', 'Mired', 'mired'],
      ['Time', 'Second', 's'],
      ['Time', 'Minute', 'min'],
      ['Time', 'Hour', 'h'],
      ['Time', 'Day', 'd'],
      ['Time', 'Week', 'week'],
      ['Time', 'Year', 'y'],
      ['Volume', 'Litre', 'l'],
      ['Volume', 'Cubic Metre', 'm^3'],
      ['VolumetricFlowRate', 'Litre per Minute', 'l/min'],
      ['VolumetricFlowRate', 'Cubic Metre per Second', 'm^3/s'],
      ['VolumetricFlowRate', 'Cubic Metre per Minute', 'm^3/min'],
      ['VolumetricFlowRate', 'Cubic Metre per Hour', 'm^3/h'],
      ['VolumetricFlowRate', 'Cubic Metre per Day', 'm^3/d']
    ];
    describe.each(si)('of type %s with unit %s and symbol %s', (type, unit, symbol) => {
      it('doesn\'t throw Qty.Error.', () => {
        expect(() => Quantity('1 ' + symbol)).not.toThrowError(Qty.Error);
      });
      it('returns a Quantity.', () => {
        expect(Quantity('1' + symbol) instanceof Qty).toBe(true);
      });
    });
  });

  describe('supports some additional units', () => {
    const custom = [
      ['Density', 'Kilogram per cubic metre', 'kg/m^3']
    ];
    describe.each(custom)('of type %s with unit %s and symbol %s', (type, unit, symbol) => {
      it('doesn\'t throw Qty.Error.', () => {
        expect(() => Quantity('1 ' + symbol)).not.toThrowError(Qty.Error);
      });
      it('returns a Quantity.', () => {
        expect(Quantity('1' + symbol) instanceof Qty).toBe(true);
      });
    });
  });

  describe('additional unit works as expected', () => {
    it('of type Angel with unit Minute Angel and symbol \'', () => {
      expect(Quantity('1 \'').to('degree').toPrec('0.0001 deg').toString()).toBe('0.0167 deg');
      expect(Quantity('1.5 \'').to('degree').toPrec('0.0001 deg').toString()).toBe('0.025 deg');
      expect(Quantity('1 °').to(Quantity('\'')).toString()).toBe('1 deg');
    });

    it('of type Angel with unit Second Angel and symbol \'\'', () => {
      expect(Quantity('1 \'\'').to('degree').toPrec('0.000001 deg').toString()).toBe('0.000278 deg');
      expect(Quantity('1.5 \'\'').to('degree').toPrec('0.000001 deg').toString()).toBe('0.000417 deg');
      expect(Quantity('1 °').to(Quantity('\'\'')).toString()).toBe('1 deg');
    });

    it('of type AmountOfSubstance with unit Deutscher Härtegrad and symbol °dH', () => {
      expect(Quantity('1 °dH').to('mmol/l').toString()).toBe('0.1783 mmol/l');
      expect(Quantity('1.5 °dH').to('mol/l').toString()).toBe('0.00026745 mol/l');
      expect(Quantity('1 mmol/l').to(Quantity('°dH')).toString()).toBe('1 mmol/l');
    });

    it('of type ArealDensity with unit Dobson Unit and symbol DU', () => {
      expect(Quantity('1 DU').to('mmol/m^2').toString()).toBe('0.44615 mmol/m2');
      expect(Quantity('1.5 DU').to('mol/m^2').toString()).toBe('0.000669225 mol/m2');
      expect(Quantity('1 mol/m^2').to(Quantity('DU')).toString()).toBe('1000 mmol/m2');
    });
  });
});
