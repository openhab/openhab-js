const { UUID, HashSet, ArrayList, Instant, ZonedDateTime } = require('./java.mock');
const {
  randomUUID,
  jsSetToJavaSet,
  jsArrayToJavaSet,
  jsArrayToJavaList,
  javaListToJsArray,
  javaSetToJsArray,
  javaSetToJsSet,
  javaInstantToJsInstant,
  javaZDTToJsZDT
} = require('../src/utils');
const time = require('@js-joda/core');

describe('utils.js', () => {
  describe('randomUUID', () => {
    it('delegates to Java UUID#randomUUID().', () => {
      jest.spyOn(UUID, 'randomUUID');
      randomUUID();
      expect(UUID.randomUUID).toHaveBeenCalled();
    });

    it('returns Java UUID as string.', () => {
      expect(randomUUID()).toBe('UUID');
      expect(typeof randomUUID()).toBe('string');
    });
  });

  describe('jsSetToJavaSet', () => {
    it('returns Java HashSet.', () => {
      expect(jsSetToJavaSet(new Set())).toBeInstanceOf(HashSet);
    });

    it('adds all items from set to returned HashSet.', () => {
      jest.spyOn(HashSet.prototype, 'add');
      const hashSet = jsSetToJavaSet(new Set(['item1', 'item2']));
      expect(hashSet.add).toHaveBeenNthCalledWith(1, 'item1');
      expect(hashSet.add).toHaveBeenNthCalledWith(2, 'item2');
    });
  });

  describe('jsArrayToJavaSet', () => {
    it('returns Java HashSet.', () => {
      expect(jsArrayToJavaSet([])).toBeInstanceOf(HashSet);
    });

    it('adds all items from array to returned HashSet.', () => {
      jest.spyOn(HashSet.prototype, 'add');
      const hashSet = jsArrayToJavaSet(['item1', 'item2']);
      expect(hashSet.add).toHaveBeenNthCalledWith(1, 'item1');
      expect(hashSet.add).toHaveBeenNthCalledWith(2, 'item2');
    });
  });

  describe('jsArrayToJavaList', () => {
    it('returns Java HashSet.', () => {
      expect(jsArrayToJavaList([])).toBeInstanceOf(ArrayList);
    });

    it('adds all items from array to returned ArrayList.', () => {
      jest.spyOn(ArrayList.prototype, 'add');
      const arrayList = jsArrayToJavaList(['item1', 'item2']);
      expect(arrayList.add).toHaveBeenNthCalledWith(1, 'item1');
      expect(arrayList.add).toHaveBeenNthCalledWith(2, 'item2');
    });
  });

  describe('javaListToJsArray', () => {
    it('delegates to Java#from().', () => {
      const list = new ArrayList();
      jest.spyOn(Java, 'from');
      javaListToJsArray(list);
      expect(Java.from).toHaveBeenCalledWith(list);
    });
  });

  describe('javaSetToJsArray', () => {
    it('delegates to Java#from().', () => {
      jest.spyOn(Java, 'from');
      javaSetToJsArray(new HashSet());
      expect(Java.from.mock.calls[0][0]).toBeInstanceOf(ArrayList);
    });
  });

  describe('javaSetToJsSet', () => {
    it('returns Set.', () => {
      expect(javaSetToJsSet(new HashSet())).toBeInstanceOf(Set);
    });
  });

  describe('javaInstantToJsInstant', () => {
    it('returns JS-Joda Instant', () => {
      expect(javaInstantToJsInstant(new Instant())).toBeInstanceOf(time.Instant);
    });
  });

  describe('javaZDTToJsZDT', () => {
    it('returns JS-Joda ZonedDateTime', () => {
      expect(javaZDTToJsZDT(new ZonedDateTime())).toBeInstanceOf(time.ZonedDateTime);
    });
  });
});
