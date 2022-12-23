const ZonedDateTime = require('@js-joda/core').ZonedDateTime;
const { parseISO8601 } = require('../time');

jest.mock('../items', () => ({}));

describe('time.js', () => {
  describe('parseISO8601', () => {
    describe('parses ISO Date', () => {
      it('accepts correct pattern YYYY-MM-DD', () => {
        expect(parseISO8601('2022-12-24')).toBeInstanceOf(ZonedDateTime);
      });
    });

    describe('parses ISO Time', () => {
      it.each([
        ['hh:mm', '18:00'],
        ['hh:mm:ss', '18:00:00'],
        ['hh:mm:ss.f', '18:00:00.4656']
      ])('accepts correct pattern %s', (pattern, isoStr) => {
        expect(parseISO8601(isoStr)).toBeInstanceOf(ZonedDateTime);
      });
    });

    describe('parses ISO DateTime', () => {
      it.each([
        ['YYYY-MM-DDThh:mm', '2022-12-24T18:30'],
        ['YYYY-MM-DDThh:mm:ss', '2022-12-24T18:30:00'],
        ['YYYY-MM-DDThh:mm:ss.f', '2022-12-24T18:30:00.5363']
      ])('accepts correct pattern %s', (pattern, isoStr) => {
        expect(parseISO8601(isoStr)).toBeInstanceOf(ZonedDateTime);
      });
    });

    describe('parses ISO DateTime with zone offset and/or time/zone', () => {
      it.each([
        ['YYYY-MM-DDThh:mm:ss.f+hh:mm[SYSTEM]', '2016-03-18T12:38:23.561+01:00[SYSTEM]'],
        ['YYYY-MM-DDThh:mm:ss.f+hh:mm', '2016-03-18T12:38:23.561+01:00'],
        ['YYYY-MM-DDThh:mm:ssZ', '2022-12-24T18:30:35Z'],
        ['YYYY-MM-DDThh:mm:ss+hh:mm[timezone]', '2017-02-04T17:01:15.846+01:00[Europe/Paris]'],
        ['YYYY-MM-DDThh:mm:ss+hh:mm[timezone]', '2016-03-18T06:38:23.561-05:00[UTC-05:00]']
      ])('accepts correct pattern %s', (pattern, isoStr) => {
        expect(parseISO8601(isoStr)).toBeInstanceOf(ZonedDateTime);
      });
    });

    describe('rejects wrong ISO pattern', () => {
      it.each([
        ['hh:mm:ss,f', '18:00:00,4654'],
        ['hh:mm:s', '18:30:0'],
        ['hh:m', '18:3'],
        ['h', '6'],
        ['YYYY-MM-DDhh:mm:ss', '2022-12-2418:30:00'],
        ['YYYY-MM-DDThh', '2022-12-24T18']
      ])('%s', (pattern, isoStr) => {
        expect(parseISO8601(isoStr)).toBe(null);
      });
    });
  });
});
