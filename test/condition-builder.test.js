const assert = require('assert');
var proxyquire = require('proxyquire').noCallThru();

describe('Conditionals', function () {

    const createLogMock = () => {
        let messages = [];

        return {
            messages,
            mock:function(name){
                return {
                    error: a => messages.push(a)
                }
            }
        };
    }

    function itemMock(nameToState) {
        return {
            getItem: function(name){
                return nameToState(name);
            }
        }
    }

    describe('Function Conditions', function () {
        it('Should pass when the function returns true', function () {

            const condition_conf = proxyquire('../rules/condition-builder', {
                '../log': createLogMock().mock,
                '../items': itemMock(),
                './operation-builder': {}
              });

            let conf = new condition_conf.FunctionConditionConf(() => true);
            assert.strictEqual(conf.check(), true);
        });

        it('Should not pass when the function returns false', function () {

            const condition_conf = proxyquire('../rules/condition-builder', {
                '../log': createLogMock().mock,
                '../items': itemMock(),
                './operation-builder': {}
              });

            let conf = new condition_conf.FunctionConditionConf(() => false);
            assert.strictEqual(conf.check(), false);
        });
    });

    describe('Item Conditions', function () {
        it('Should pass when the item state matches', function () {

            const condition_conf = proxyquire('../rules/condition-builder', {
                '../log': createLogMock().mock,
                '../items': itemMock((name) => {
                    assert.strictEqual(name, 'myitem');
                      return {
                          state: "mystate"
                      }
                }),
                './operation-builder': {}
              });

            let conf = new condition_conf.ConditionBuilder();

            assert.strictEqual(conf.stateOfItem('myitem').is('mystate').check(), true);
        });

        it('Should pass when the item in list of states', function () {

            const condition_conf = proxyquire('../rules/condition-builder', {
                '../log': createLogMock().mock,
                '../items': itemMock((name) => {
                    assert.strictEqual(name, 'myitem');
                      return {
                          state: "mystate"
                      }
                }),
                './operation-builder': {}
              });

            let conf = new condition_conf.ConditionBuilder();

            assert.strictEqual(conf.stateOfItem('myitem').in('otherstate', 'mystate').check(), true);
        });


        it('Should not pass when the item state doesnt matches', function () {

            const condition_conf = proxyquire('../rules/condition-builder', {
                '../log': createLogMock().mock,
                '../items': itemMock((name) => {
                    assert.strictEqual(name, 'myitem');
                      return {
                          state: "mystate2"
                      }
                }),
                './operation-builder': {}
              });

            let conf = new condition_conf.ConditionBuilder();

            assert.strictEqual(conf.stateOfItem('myitem').is('mystate').check(), false);
        });

        it('Should not pass when the item doesnt exist', function () {

            const condition_conf = proxyquire('../rules/condition-builder', {
                '../log': createLogMock().mock,
                '../items': itemMock((name) => {
                    assert.strictEqual(name, 'myitem');
                    return undefined;
                }),
                './operation-builder': {}
              });

            let conf = new condition_conf.ConditionBuilder();

            assert.throws(() => conf.stateOfItem('myitem').is('mystate').check(), {message: /myitem/});
        });

        it('Should not pass when the item is null', function () {

            const condition_conf = proxyquire('../rules/condition-builder', {
                '../log': createLogMock().mock,
                '../items': itemMock((name) => {
                    assert.strictEqual(name, 'myitem');
                    return null;
                }),
                './operation-builder': {}
              });

            let conf = new condition_conf.ConditionBuilder();

            assert.throws(() => conf.stateOfItem('myitem').is('mystate').check(), {message: /myitem/});
        });

    });
});
