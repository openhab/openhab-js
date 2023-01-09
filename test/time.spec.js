const time = require('../time');
const { ZonedDateTime } = require('@js-joda/core');

jest.mock('../items', () => ({
  Item: new Object() // eslint-disable-line no-new-object
}));

describe('time.js', () => {
  describe('toZDT', () => {
    it('passes through if when is a time.ZonedDateTime', () => {
      const zdt = time.ZonedDateTime.now();
      expect(time.toZDT(zdt)).toBe(zdt);
    });

    it('delegates to parseString', () => {
      const when = 'when';
      expect(() => time.toZDT(when)).toThrowError('Failed to parse string when: DateTimeParseException: Text cannot be parsed to a Duration: when, at index: 0');
    });

    // TODO: Add remaining possible cases for when
  });

  describe('parseString', () => {
    const parseString = time.parseString;

    describe('accepts ISO patterns without the "T" for Blockly', () => {
      it.each([
        ['YYYY-MM-DD hh:mm:ss.f+hh:mm', '2016-03-18 12:38:23.561+01:00'],
        ['YYYY-MM-DD hh:mm:ssZ', '2022-12-24 18:30:35Z'],
        ['YYYY-MM-DD hh:mm:ss+hh:mm[timezone]', '2017-02-04 17:01:15.846+01:00[Europe/Paris]'],
        ['YYYY-MM-DD hh:mm', '2022-12-24 18:30'],
        ['YYYY-MM-DD hh:mm:ss', '2022-12-24 18:30:00'],
        ['YYYY-MM-DD hh:mm:ss.f', '2022-12-24 18:30:00.5363']
      ])('accepts pattern %s', (pattern, isoStr) => {
        expect(parseString(isoStr)).toBeInstanceOf(ZonedDateTime);
      });
    });
  });

  describe('parseISO8601', () => {
    const parseISO8601 = time.parseISO8601;
    const ZonedDateTime = require('@js-joda/core').ZonedDateTime;

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
        ['YYYY-MM-DDThh:mm:ss.f+HH:mm[SYSTEM]', '2016-03-18T12:38:23.561+01:00[SYSTEM]'],
        ['YYYY-MM-DDThh:mm:ss.f+HH:mm', '2016-03-18T12:38:23.561+01:00'],
        ['YYYY-MM-DDThh:mm:ss.f-HH:mm', '2016-03-18T12:38:23.56-04:30'],
        ['YYYY-MM-DDThh:mm:ss.f+HHmm', '2016-03-18T12:38:23.561+0100'],
        ['YYYY-MM-DDThh:mm:ss.f-HHmm', '2016-03-18T12:38:23.561-0430'],
        ['YYYY-MM-DDThh:mm:ssZ', '2022-12-24T18:30:35Z'],
        ['YYYY-MM-DDThh:mm:ss+HH:mm[timezone]', '2017-02-04T17:01:15.846+01:00[Europe/Paris]'],
        ['YYYY-MM-DDThh:mm:ss+HH:mm[timezone]', '2016-03-18T06:38:23.561-05:00[UTC-05:00]']
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

  describe('ZonedDateTime', () => {
    describe('polyfilled method', () => {
      it('toToday works', () => {
        const oldZdt = time.ZonedDateTime.parse('2005-01-21T02:13:35Z');
        const newZdt = oldZdt.toToday();
        expect(newZdt.toLocalDate().toString()).toBe(time.LocalDate.now().toString());
      });

      describe('isBeforeTime and isAfterTime', () => {
        const zdt1 = time.toZDT('14:30');
        const zdt2 = time.toZDT('16:30');
        it('returns true if before/after', () => {
          expect(zdt1.isBeforeTime(zdt2)).toBe(true);
          expect(zdt2.isAfterTime(zdt1)).toBe(true);
        });
        it('returns false if not before/after', () => {
          expect(zdt2.isBeforeTime(zdt1)).toBe(false);
          expect(zdt1.isBeforeTime(zdt1)).toBe(false);
          expect(zdt1.isAfterTime(zdt2)).toBe(false);
          expect(zdt1.isAfterTime(zdt1)).toBe(false);
        });
      });

      describe('isBeforeDate and isAfterDate', () => {
        const zdt1 = time.toZDT('2022-12-01');
        const zdt2 = time.toZDT('2022-12-06');
        it('returns true if before/after', () => {
          expect(zdt1.isBeforeDate(zdt2)).toBe(true);
          expect(zdt2.isAfterDate(zdt1)).toBe(true);
        });
        it('returns false if not before/after', () => {
          expect(zdt2.isBeforeDate(zdt1)).toBe(false);
          expect(zdt1.isBeforeDate(zdt1)).toBe(false);
          expect(zdt1.isAfterDate(zdt2)).toBe(false);
          expect(zdt1.isAfterDate(zdt1)).toBe(false);
        });
      });

      describe('isBeforeDateTime and isAfterDateTime', () => {
        const zdt1 = time.toZDT('2022-12-01T14:30Z');
        const zdt2 = time.toZDT('2022-12-01T16:30Z');
        const zdt3 = time.toZDT('2022-12-02T16:30Z');
        it('returns true if before/after', () => {
          expect(zdt1.isBeforeDateTime(zdt2)).toBe(true);
          expect(zdt2.isBeforeDateTime(zdt3)).toBe(true);
          expect(zdt2.isAfterDateTime(zdt1)).toBe(true);
          expect(zdt3.isAfterDateTime(zdt2)).toBe(true);
        });
        it('returns false if not before/after', () => {
          expect(zdt2.isBeforeDateTime(zdt1)).toBe(false);
          expect(zdt3.isBeforeDateTime(zdt2)).toBe(false);
          expect(zdt1.isBeforeDateTime(zdt1)).toBe(false);
          expect(zdt1.isAfterDateTime(zdt2)).toBe(false);
          expect(zdt2.isAfterDateTime(zdt3)).toBe(false);
          expect(zdt1.isAfterDateTime(zdt1)).toBe(false);
        });
      });

      describe('isBetweenTimes', () => {
        const zdt1 = time.toZDT('14:30');
        const zdt2 = time.toZDT('16:30');
        const zdt3 = time.toZDT('18:30');
        const zdt4 = time.toZDT('0:30');

        describe('it returns true if is between', () => {
          it('without spanning over midnight', () => {
            expect(zdt2.isBetweenTimes(zdt1, zdt3)).toBe(true);
          });
          it('with spanning over midnight', () => {
            expect(zdt3.isBetweenTimes(zdt2, zdt4)).toBe(true);
          });
        });
        describe('it returns false if is not between', () => {
          it('without spanning over midnight', () => {
            expect(zdt1.isBetweenTimes(zdt2, zdt3)).toBe(false);
            expect(zdt3.isBetweenTimes(zdt1, zdt2)).toBe(false);
          });
          it('with spanning over midnight', () => {
            expect(zdt1.isBetweenTimes(zdt2, zdt4)).toBe(false);
          });
        });
      });

      describe('isBetweenDates', () => {
        const date1 = time.toZDT('2022-12-01');
        const date2 = time.toZDT('2022-12-24');
        const date3 = time.toZDT('2022-12-26');

        it('returns true if is between', () => {
          expect(date2.isBetweenDates(date1, date3)).toBe(true);
        });
        it('returns false is is not between', () => {
          expect(date1.isBetweenDates(date2, date3)).toBe(false);
          expect(date3.isBetweenDates(date1, date2)).toBe(false);
        });
      });

      describe('isBetweenDateTimes', () => {
        const dateTime1 = time.toZDT('2022-12-01T14:30Z');
        const dateTime2 = time.toZDT('2022-12-01T18:30Z');
        const dateTime3 = time.toZDT('2022-12-24T18:30Z');

        it('returns true if is between', () => {
          expect(dateTime2.isBetweenDateTimes(dateTime1, dateTime3)).toBe(true);
        });
        it('returns false if is not between', () => {
          expect(dateTime1.isBetweenDateTimes(dateTime1, dateTime2)).toBe(false);
          expect(dateTime3.isBetweenDateTimes(dateTime1, dateTime2)).toBe(false);
        });
      });

      describe('isClose', () => {
        const now = time.ZonedDateTime.now();
        const zdt = time.ZonedDateTime.now().plusHours(6);
        it('returns true if the difference between this and time.ZonedDateTime is within time.Duration', () => {
          const duration = time.Duration.ofHours(12);
          expect(now.isClose(zdt, duration)).toBe(true);
        });
        it('returns false if the difference between this and time.ZonedDateTime is not within time.Duration', () => {
          const duration = time.Duration.ofHours(3);
          expect(now.isClose(zdt, duration)).toBe(false);
        });
      });

      it('getMillisFromNow works', () => {
        const now = time.ZonedDateTime.now().plusSeconds(10);
        expect(now.getMillisFromNow()).toBeGreaterThan(9000);
        expect(now.getMillisFromNow()).toBeLessThan(11000);
      });
    });
  });
});
