/* eslint-env mocha */
const assert = require('assert');
const proxyquire = require('proxyquire').noCallThru();

describe('Conditionals', function () {
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

  function itemMock (nameToState) {
    return {
      getItem: function (name) {
        return nameToState(name);
      }
    };
  }

  describe('Function Conditions', function () {
    it('Should pass when the function returns true', function () {
      const conditionConf = proxyquire('../rules/condition-builder', {
        '../log': createLogMock().mock,
        '../items': itemMock(),
        './operation-builder': {}
      });

      const conf = new conditionConf.FunctionConditionConf(() => true);
      assert.strictEqual(conf.check(), true);
    });

    it('Should not pass when the function returns false', function () {
      const conditionConf = proxyquire('../rules/condition-builder', {
        '../log': createLogMock().mock,
        '../items': itemMock(),
        './operation-builder': {}
      });

      const conf = new conditionConf.FunctionConditionConf(() => false);
      assert.strictEqual(conf.check(), false);
    });
  });

  describe('Item Conditions', function () {
    it('Should pass when the item state matches', function () {
      const conditionConf = proxyquire('../rules/condition-builder', {
        '../log': createLogMock().mock,
        '../items': itemMock((name) => {
          assert.strictEqual(name, 'myitem');
          return {
            state: 'mystate'
          };
        }),
        './operation-builder': {}
      });

      const conf = new conditionConf.ConditionBuilder();

      assert.strictEqual(conf.stateOfItem('myitem').is('mystate').check(), true);
    });

    it('Should pass when the item in list of states', function () {
      const conditionConf = proxyquire('../rules/condition-builder', {
        '../log': createLogMock().mock,
        '../items': itemMock((name) => {
          assert.strictEqual(name, 'myitem');
          return {
            state: 'mystate'
          };
        }),
        './operation-builder': {}
      });

      const conf = new conditionConf.ConditionBuilder();

      assert.strictEqual(conf.stateOfItem('myitem').in('otherstate', 'mystate').check(), true);
    });

    it('Should not pass when the item state doesnt matches', function () {
      const conditionConf = proxyquire('../rules/condition-builder', {
        '../log': createLogMock().mock,
        '../items': itemMock((name) => {
          assert.strictEqual(name, 'myitem');
          return {
            state: 'mystate2'
          };
        }),
        './operation-builder': {}
      });

      const conf = new conditionConf.ConditionBuilder();

      assert.strictEqual(conf.stateOfItem('myitem').is('mystate').check(), false);
    });

    it('Should not pass when the item doesnt exist', function () {
      const conditionConf = proxyquire('../rules/condition-builder', {
        '../log': createLogMock().mock,
        '../items': itemMock((name) => {
          assert.strictEqual(name, 'myitem');
          return undefined;
        }),
        './operation-builder': {}
      });

      const conf = new conditionConf.ConditionBuilder();

      assert.throws(() => conf.stateOfItem('myitem').is('mystate').check(), { message: /myitem/ });
    });

    it('Should not pass when the item is null', function () {
      const conditionConf = proxyquire('../rules/condition-builder', {
        '../log': createLogMock().mock,
        '../items': itemMock((name) => {
          assert.strictEqual(name, 'myitem');
          return null;
        }),
        './operation-builder': {}
      });

      const conf = new conditionConf.ConditionBuilder();

      assert.throws(() => conf.stateOfItem('myitem').is('mystate').check(), { message: /myitem/ });
    });
  });
});
