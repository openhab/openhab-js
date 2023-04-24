const { QuantityType } = require('./openhab.mock');
const { BigDecimal } = require('./java.mock');
const { Unit } = require('./javax-measure.mock');
const { getQuantity, Quantity, QuantityError, _stringOrNumberOrQtyToQtyType, _stringOrQtyToQtyType } = require('../quantity');

describe('quantity.js', () => {
  const quantityTypeSpy = new QuantityType();
  QuantityType.valueOf.mockImplementation(() => quantityTypeSpy);
  const unitSpy = new Unit();
  quantityTypeSpy.getUnit.mockImplementation(() => unitSpy);

  describe('factory', () => {
    it('creates Quantity from string', () => {
      expect(getQuantity('5m')).toBeInstanceOf(Quantity);
    });
    it('creates Quantity from Quantity', () => {
      expect(getQuantity(getQuantity('5m'))).toBeInstanceOf(Quantity);
    });
    it('creates Quantity from Java QuantityType', () => {
      expect(getQuantity(quantityTypeSpy)).toBeInstanceOf(Quantity);
    });
    it('throws TypeError else', () => {
      expect(() => getQuantity(5)).toThrowError(TypeError);
    });
  });

  describe('member', () => {
    it('dimension delegates & returns', () => {
      quantityTypeSpy.getDimension.mockImplementation(() => '[L]');
      const dimension = getQuantity('5 m').dimension;
      expect(quantityTypeSpy.getDimension).toHaveBeenCalled();
      expect(dimension).toBe('[L]');
    });

    it('unit delegates & returns', () => {
      unitSpy.getName.mockImplementation(() => 'Metres');
      let unit = getQuantity('5 m').unit;
      expect(unit).toBe('Metres');

      unitSpy.getName.mockImplementation(() => null);
      unit = getQuantity('5 m').unit;
      expect(unit).toBe(null);

      expect(unitSpy.getName).toHaveBeenCalledTimes(2);
      expect(quantityTypeSpy.getUnit).toHaveBeenCalledTimes(2);
    });

    it('symbol delegates & returns', () => {
      quantityTypeSpy.getUnit.mockImplementation(() => 'm');
      let symbol = getQuantity('5 m').symbol;
      expect(symbol).toBe('m');

      quantityTypeSpy.getUnit.mockImplementation(() => null);
      symbol = getQuantity('5 m').symbol;
      expect(symbol).toBe(null);

      expect(quantityTypeSpy.getUnit).toHaveBeenCalledTimes(2);

      quantityTypeSpy.getUnit.mockImplementation(() => unitSpy);
    });

    it('float delegates & returns', () => {
      quantityTypeSpy.doubleValue.mockImplementation(() => 1.5);
      const float = getQuantity('1.5 m').float;
      expect(quantityTypeSpy.doubleValue).toHaveBeenCalled();
      expect(float).toBe(1.5);
    });

    it('int delegates & returns', () => {
      quantityTypeSpy.longValue.mockImplementation(() => 5);
      const int = getQuantity('5 m').int;
      expect(quantityTypeSpy.longValue).toHaveBeenCalled();
      expect(int).toBe(5);
    });
  });

  describe('method', () => {
    it.each([
      ['add'],
      ['divide'],
      ['multiply'],
      ['subtract']
    ])('%s delegates & returns Quantity', (method) => {
      const qty = getQuantity('5 m')[method]('5 m');
      expect(quantityTypeSpy[method]).toHaveBeenCalled();
      expect(qty).toBeInstanceOf(Quantity);
    });

    describe('toUnit', () => {
      it('delegates & returns Quantity', () => {
        const unit = 'cm';
        const qty = getQuantity('5 m').toUnit(unit);
        expect(quantityTypeSpy.toUnit).toHaveBeenCalledWith(unit);
        expect(qty).toBeInstanceOf(Quantity);
      });
      it('delegates & returns null', () => {
        quantityTypeSpy.toUnit.mockImplementation(() => null);
        const unit = 'cm';
        const qty = getQuantity('5 m').toUnit(unit);
        expect(quantityTypeSpy.toUnit).toHaveBeenCalledWith(unit);
        expect(qty).toBe(null);
        quantityTypeSpy.toUnit.mockImplementation(() => new QuantityType());
      });
      it('wraps exceptions in QuantityError', () => {
        quantityTypeSpy.toUnit.mockImplementation(() => { throw new Error(); });
        expect(() => getQuantity('5 m').toUnit('cm')).toThrowError(QuantityError);
        quantityTypeSpy.toUnit.mockImplementation(() => new QuantityType());
      });
    });

    // method name | compareTo returns for true | compareTo returns for false
    it.each([
      ['equal', 0, 1],
      ['greaterThan', 1, 0],
      ['greaterThanOrEqual', 0, -1],
      ['lessThan', -1, 0],
      ['lessThanOrEqual', 0, 1]
    ])('%s delegates, compares & returns correct boolean', (name, mock1, mock2) => {
      quantityTypeSpy.compareTo.mockImplementation(() => mock1);
      let equals = getQuantity('5 m')[name]('500 cm');
      expect(equals).toBe(true);

      quantityTypeSpy.compareTo.mockImplementation(() => mock2);
      equals = getQuantity('5 m')[name]('500 cm');
      expect(equals).toBe(false);

      expect(quantityTypeSpy.compareTo).toHaveBeenCalledTimes(2);
    });
    it('toString delegates & returns string', () => {
      const str = getQuantity('5 m').toString();
      expect(quantityTypeSpy.toString).toHaveBeenCalled();
      expect(typeof str).toBe('string');
    });
  });

  describe('private method', () => {
    describe('_stringOrNumberOrQtyToQtyType', () => {
      it('parses number to BigDecimal', () => {
        const value = _stringOrNumberOrQtyToQtyType(10);
        expect(BigDecimal.valueOf).toHaveBeenCalledWith(10);
        expect(value).toBeInstanceOf(BigDecimal);
      });
      it('wraps exceptions from BigDecimal in QuantityError', () => {
        BigDecimal.valueOf.mockImplementation(() => { throw new Error(); });
        expect(() => _stringOrNumberOrQtyToQtyType(10)).toThrowError(QuantityError);
        BigDecimal.valueOf.mockImplementation(() => new BigDecimal());
      });
      it('parses string to QuantityType', () => {
        const value = _stringOrNumberOrQtyToQtyType('10 m');
        expect(QuantityType.valueOf).toHaveBeenCalledWith('10 m');
        expect(value).toBeInstanceOf(QuantityType);
      });
      it('wraps exceptions from QuantityType in QuantityError', () => {
        QuantityType.valueOf.mockImplementation(() => { throw new Error(); });
        expect(() => _stringOrNumberOrQtyToQtyType('10 m')).toThrowError(QuantityError);
        QuantityType.valueOf.mockImplementation(() => new QuantityType());
      });
      it('extracts QuantityType from Quantity', () => {
        const value = _stringOrNumberOrQtyToQtyType(getQuantity('10 m'));
        expect(value).toBeInstanceOf(QuantityType);
      });
      it('else throws TypeError', () => {
        expect(() => _stringOrNumberOrQtyToQtyType(true)).toThrowError(TypeError);
      });
    });
    describe('_stringOrQtyToQtyType', () => {
      it('parses string to QuantityType', () => {
        const value = _stringOrQtyToQtyType('10 m');
        expect(QuantityType.valueOf).toHaveBeenCalledWith('10 m');
        expect(value).toBeInstanceOf(QuantityType);
      });
      it('wraps exceptions from QuantityType in QuantityError', () => {
        QuantityType.valueOf.mockImplementation(() => { throw new Error(); });
        expect(() => _stringOrNumberOrQtyToQtyType('10 m')).toThrowError(QuantityError);
        QuantityType.valueOf.mockImplementation(() => new QuantityType());
      });
      it('extracts QuantityType from Quantity', () => {
        const value = _stringOrQtyToQtyType(getQuantity('10 m'));
        expect(value).toBeInstanceOf(QuantityType);
      });
      it('else throws TypeError', () => {
        expect(() => _stringOrQtyToQtyType(10)).toThrowError(TypeError);
      });
    });
  });
});
