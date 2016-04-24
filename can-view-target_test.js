import QUnit from 'steal-qunit';
import plugin from './can-view-target';

QUnit.module('can-view-target');

QUnit.test('Initialized the plugin', function(){
  QUnit.equal(typeof plugin, 'function');
  QUnit.equal(plugin(), 'This is the can-view-target plugin');
});
