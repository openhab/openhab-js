jest.mock('../../src/osgi', () => ({
  getService: () => ({
    getTimeZone: () => ({
      getId: () => 'Europe/Paris'
    })
  })
}));

const ItemPersistence = require('../../src/items/item-persistence');
const TimeSeries = require('../../src/items/time-series');
const { JavaPersistenceExtensions, JavaTypeParser } = require('../openhab.mock');
const time = require('../../src/time');

describe('items/item-persistence.js', () => {
  const rawItem = {
    getName: () => 'TestItem',
    getAcceptedDataTypes: () => []
  };
  const itemPersistence = new ItemPersistence(rawItem);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('persist', () => {
    // The Java APIs behind these calls take a State or a java.lang.String, never a number:
    // TypeParser.parseState(List<Class<? extends State>>, String) and
    // PersistenceExtensions.persist(Item, ZonedDateTime, State | String). Passing a JS number
    // through unconverted makes GraalJS throw "Invalid or lossy primitive coercion", even though
    // the JSDoc for these methods documents number as an accepted state.
    describe('converts numeric states to string', () => {
      it('for a TimeSeries', () => {
        const timeSeries = new TimeSeries('REPLACE');
        timeSeries.add(time.toZDT('2026-01-01T00:00:00Z'), 38.16);

        itemPersistence.persist(timeSeries, 'influxdb');

        expect(JavaTypeParser.parseState).toHaveBeenCalledWith([], '38.16');
      });

      it('for a state given with a timestamp', () => {
        const timestamp = time.toZDT('2026-01-01T00:00:00Z');

        itemPersistence.persist(timestamp, 38.16, 'influxdb');

        expect(JavaPersistenceExtensions.persist).toHaveBeenCalledWith(rawItem, timestamp, '38.16', 'influxdb');
      });

      it('for a state given with a timestamp and no service', () => {
        const timestamp = time.toZDT('2026-01-01T00:00:00Z');

        itemPersistence.persist(timestamp, 0);

        expect(JavaPersistenceExtensions.persist).toHaveBeenCalledWith(rawItem, timestamp, '0');
      });
    });

    it('leaves string states untouched', () => {
      const timestamp = time.toZDT('2026-01-01T00:00:00Z');

      itemPersistence.persist(timestamp, 'ON', 'influxdb');

      expect(JavaPersistenceExtensions.persist).toHaveBeenCalledWith(rawItem, timestamp, 'ON', 'influxdb');
    });

    it('maps null and undefined states to NULL and UNDEF', () => {
      const timestamp = time.toZDT('2026-01-01T00:00:00Z');

      itemPersistence.persist(timestamp, null, 'influxdb');
      itemPersistence.persist(timestamp, undefined, 'influxdb');

      expect(JavaPersistenceExtensions.persist).toHaveBeenNthCalledWith(1, rawItem, timestamp, 'NULL', 'influxdb');
      expect(JavaPersistenceExtensions.persist).toHaveBeenNthCalledWith(2, rawItem, timestamp, 'UNDEF', 'influxdb');
    });
  });
});
