'use strict';

var assert = require('assert');
var getCache = require('../index');

(function () {

  console.log('Cache');
  var cache = getCache();

  var key = 'k';
  var value = 'v';

  var v = cache.get(key);
  assert.notEqual(value, v, 'the same');
  console.log('  empty');

  cache.set(key, value);
  v = cache.get(key);
  assert.equal(value, v, 'not the same');
  console.log('  cache it');

  cache.reset();
  v = cache.get(key);
  assert.notEqual(value, v, 'the same');
  console.log('  reset the cache');

})();
