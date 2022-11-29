/* eslint-disable no-undef */

const { ScriptExecution } = require('../actions');
const { JavaScriptExecution } = require('./openhab.mock');

jest.mock('../osgi');
jest.mock('@runtime/osgi', () => ({}), { virtual: true });
jest.mock('@runtime/Defaults', () => ({}), { virtual: true });

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
});
