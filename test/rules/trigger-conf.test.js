/* eslint-env mocha */
const assert = require('assert');
const proxyquire = require('proxyquire').noCallThru();

describe('Triggers', function () {
  const createLogMock = () => {
    const messages = [];

    return {
      messages,
      mock: function (name) {
        return {
          error: a => messages.push(a)
        };
      }
    };
  };

  function triggersMock (lookup) { // eslint-disable-line no-unused-vars
    return x => lookup(x);
  }

  describe('Item Triggers', function () {
    it('Should create correct item trigger', function (done) {
      const triggerConf = proxyquire('../../src/rules/trigger-builder', {
        '../log': createLogMock().mock,
        '../triggers': {
          ItemStateChangeTrigger: (name, from, to) => {
            assert.strictEqual(name, 'item1');
            assert.strictEqual(from, undefined);
            assert.strictEqual(to, 'state1');
            done();
          }
        },
        './operation-builder': {},
        './condition-builder': {}
      });

      new triggerConf.ItemTriggerConfig('item1').changed().to('state1')._toOHTriggers();
    });
  });
});
