const { UUID, HashSet, ArrayList } = require('./java.mock');
const {
  randomUUID,
  jsSetToJavaSet,
  jsArrayToJavaSet,
  jsArrayToJavaList,
  javaListToJsArray,
  javaSetToJsArray,
  javaSetToJsSet,
  isJsInstanceOfJava
} = require('../utils');

describe('utils.js', () => {
  describe('randomUUID', () => {
    it('delegates to Java UUID#randomUUID().', () => {
      jest.spyOn(UUID, 'randomUUID');
      randomUUID();
      expect(UUID.randomUUID).toHaveBeenCalled();
    });

    it('returns Java UUID.', () => {
      const uuidMock = new UUID();
      UUID.randomUUID.mockImplementation(() => uuidMock);
      expect(randomUUID()).toBe(uuidMock);
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

  describe('isJsInstanceOfJava', () => {
    it('throws error when type is not a Java type.', () => {
      const notAJavaType = {};
      jest.spyOn(Java, 'isType').mockImplementation(() => false);
      expect(() => isJsInstanceOfJava('', notAJavaType)).toThrow(
        'type is not a java class'
      );
      expect(Java.isType).toHaveBeenCalledWith(notAJavaType);
    });

    it('returns false if instance oder type is null or undefined.', () => {
      jest.spyOn(Java, 'isType').mockImplementation(() => true);
      expect(isJsInstanceOfJava(null, {})).toBe(false);
      expect(isJsInstanceOfJava(undefined, {})).toBe(false);
      expect(isJsInstanceOfJava({ getClass: () => { return null; } }, {})).toBe(false);
      expect(isJsInstanceOfJava({ getClass: () => { return undefined; } }, {})).toBe(false);
    });

    it("delegates to isAssignableFrom of given type's class", () => {
      const isAssignableFromMock = jest.fn();
      const javaType = {
        getClass: () => {
          return {
            isAssignableFrom: isAssignableFromMock
          };
        }
      };
      const instance = { getClass: () => 'class' };
      jest.spyOn(Java, 'isType').mockImplementation(() => true);
      isJsInstanceOfJava(instance, javaType);
      expect(isAssignableFromMock).toHaveBeenCalledWith(
        'class'
      );
    });
  });
});
