const { _boolStateOrNull } = require('../../src/items/helpers');
const { PrimitiveType } = require('../openhab.mock');

describe('items/helpers.js', () => {
  describe('_boolStateOrNull', () => {
    jest.mock('osgi', () => ({}), { virtual: true });
    const { UnDefType } = require('@runtime');

    describe('always returns null for some Item types', () => {
      it.each(['Call', 'DateTime', 'Image', 'Location', 'String'])('for %s Items', (type) => {
        expect(_boolStateOrNull('TEST', type)).toBeNull();
      });
    });

    it('returns null for null state', () => {
      expect(_boolStateOrNull(null, 'Switch')).toBeNull();
    });
    it('returns null for undefined state', () => {
      expect(_boolStateOrNull(undefined, 'Switch')).toBeNull();
    });
    it('returns null for UnDefType state', () => {
      expect(_boolStateOrNull(new UnDefType(), 'Switch')).toBeNull();
    });

    describe('handles Color, Dimmer & Rollershutter Items', () => {
      it('returns true for numericState > 0', () => {
        expect(_boolStateOrNull(new PrimitiveType(1), 'Color')).toBe(true);
      });
      it('returns false for numericState = 0', () => {
        expect(_boolStateOrNull(new PrimitiveType(0), 'Color')).toBe(false);
      });
    });

    describe('handles Contact Items', () => {
      it('returns true for OPEN state', () => {
        expect(_boolStateOrNull(new PrimitiveType('OPEN'), 'Contact')).toBe(true);
      });
      it('returns false for CLOSED state', () => {
        expect(_boolStateOrNull(new PrimitiveType('CLOSED'), 'Contact')).toBe(false);
      });
    });

    describe('handles Number Items', () => {
      it('returns true for non-zero state', () => {
        expect(_boolStateOrNull(new PrimitiveType(1), 'Number')).toBe(true);
        expect(_boolStateOrNull(new PrimitiveType(-1), 'Number')).toBe(true);
      });
      it('returns false for zero state', () => {
        expect(_boolStateOrNull(new PrimitiveType(0), 'Number')).toBe(false);
      });
    });

    describe('handles Player Items', () => {
      it('returns true for PLAY state', () => {
        expect(_boolStateOrNull(new PrimitiveType('PLAY'), 'Player')).toBe(true);
      });
      it.each(['PAUSE', 'REWIND', 'FASTFORWARD'])('returns false for %s state', (state) => {
        expect(_boolStateOrNull(new PrimitiveType('state'), 'Player')).toBe(false);
      });
    });

    describe('handles Switch Items', () => {
      it('returns true for ON state', () => {
        expect(_boolStateOrNull(new PrimitiveType('ON'), 'Switch')).toBe(true);
      });
      it('returns false for OFF state', () => {
        expect(_boolStateOrNull(new PrimitiveType('OFF'), 'Switch')).toBe(false);
      });
    });
  });
});
