/* eslint-disable no-undef */

const { ScriptExecution, Transformation } = require('../src/actions');
const { JavaScriptExecution, JavaTransformation } = require('./openhab.mock');

jest.mock('../src/osgi');

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
      const zdt = {};
      const functionRef = (foo) => foo;

      ScriptExecution.createTimer(identifier, zdt, functionRef, 'prop1');

      expect(ThreadsafeTimers.createTimer).toHaveBeenCalled();
      expect(JavaScriptExecution.callScript).not.toHaveBeenCalled();

      jest.clearAllMocks();

      ScriptExecution.createTimer(zdt, functionRef, 'prop1');

      expect(ThreadsafeTimers.createTimer).toHaveBeenCalled();
      expect(JavaScriptExecution.callScript).not.toHaveBeenCalled();
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
      it('delegates to Java Transformation.', () => {
        Transformation.transform(type, fn, value);

        expect(JavaTransformation.transform).toHaveBeenCalledWith(type, fn, value);
      });
    });

    describe('transformRaw', () => {
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
