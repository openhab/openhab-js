/* eslint-disable no-undef */

const { ScriptExecution, Transformation } = require('../actions');
const { JavaScriptExecution, JavaTransformation } = require('./openhab.mock');

jest.mock('../osgi');

describe('actions.js', () => {
  describe('ScriptExecution', () => {
    beforeAll(() => {
      jest.spyOn(JavaScriptExecution, 'callScript');
      jest.spyOn(JavaScriptExecution, 'createTimer');

      ThreadsafeTimers = {
        createTimer: jest.fn()
      };
    });

    it('delegates callScript to Java ScriptExecution.', () => {
      const scriptName = 'script-1';

      ScriptExecution.callScript(scriptName);

      expect(JavaScriptExecution.callScript).toHaveBeenCalledWith(scriptName);
    });

    it('delegates createTimer to ThreadsafeTimers.', () => {
      const identifier = 'timer-1';
      const instant = {};
      const closure = () => null;

      ScriptExecution.createTimer(identifier, instant, closure);

      expect(ThreadsafeTimers.createTimer).toHaveBeenCalledWith(identifier, instant, closure);
      expect(JavaScriptExecution.callScript).not.toHaveBeenCalled();

      jest.clearAllMocks();

      ScriptExecution.createTimer(identifier, instant);

      expect(ThreadsafeTimers.createTimer).toHaveBeenCalledWith(identifier, instant);
      expect(JavaScriptExecution.callScript).not.toHaveBeenCalled();
    });

    it('falls back to Java ScriptExecution, when ThreadsafeTimers throws error.', () => {
      const identifier = 'timer-1';
      const instant = {};
      const closure = () => null;

      ThreadsafeTimers.createTimer.mockImplementation(() => { throw new Error(); });

      ScriptExecution.createTimer(identifier, instant, closure);

      expect(ThreadsafeTimers.createTimer).toHaveBeenCalledWith(identifier, instant, closure);
      expect(JavaScriptExecution.createTimer).toHaveBeenCalledWith(identifier, instant, closure);

      jest.clearAllMocks();

      ScriptExecution.createTimer(identifier, instant);

      expect(ThreadsafeTimers.createTimer).toHaveBeenCalledWith(identifier, instant);
      expect(JavaScriptExecution.createTimer).toHaveBeenCalledWith(identifier, instant);
    });
  });

  describe('Transformation', () => {
    beforeAll(() => {
      jest.spyOn(JavaTransformation, 'transform');
      jest.spyOn(JavaTransformation, 'transformRaw');
    });
    const type = 'MAP';
    const fn = 'en.map';
    const value = 'ON';

    describe('transform', () => {
      it('throws TypeError when a wrong argument is passed.', () => {
        expect(() => Transformation.transform({}, fn, value)).toThrow(TypeError);
        expect(() => Transformation.transform(type, {}, value)).toThrow(TypeError);
        expect(() => Transformation.transform(type, fn, { value })).toThrow(TypeError);
        expect(JavaTransformation.transform).not.toHaveBeenCalled();
      });

      it('delegates to Java Transformation.', () => {
        Transformation.transform(type, fn, value);

        expect(JavaTransformation.transform).toHaveBeenCalledWith(type, fn, value);
      });
    });

    describe('transformRaw', () => {
      it('throws TypeError when a wrong argument is passed.', () => {
        expect(() => Transformation.transformRaw({}, fn, value)).toThrow(TypeError);
        expect(() => Transformation.transformRaw(type, {}, value)).toThrow(TypeError);
        expect(() => Transformation.transformRaw(type, fn, { value })).toThrow(TypeError);
        expect(JavaTransformation.transformRaw).not.toHaveBeenCalled();
      });

      it('delegates to Java Transformation.', () => {
        Transformation.transformRaw(type, fn, value);

        expect(JavaTransformation.transformRaw).toHaveBeenCalledWith(type, fn, value);
      });

      it('re-throws Java exception from Transformation as JavaScript error.', () => {
        const exception = 'Java stack trace';

        JavaTransformation.transformRaw.mockImplementation(() => { throw exception; });

        try {
          Transformation.transformRaw(type, fn, value);
          fail('should not reach this point');
        } catch (error) {
          expect(error).toBeInstanceOf(Error);
          expect(error.message).toBe(exception);
        }
      });
    });
  });
});
