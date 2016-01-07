'use strict';

var assert = require('assert');
var util = require('../util');
var getCachePlugin = require('../index');

(function () {

  console.log('Object check sum');
  var nest = {
    'y': 'yyyy',
    'z': 'zzzz',
    'x': 'xxxx'
  };
  var json1 = {
    'b': 'bbbb',
    'a': 'aaaa',
    'd': 'dddd',
    'c': nest
  };
  var json2 = {
    'd': 'dddd',
    'c': nest,
    'a': 'aaaa',
    'b': 'bbbb'
  };

  util.sortJSON(json1);
  util.sortJSON(json2);
  assert.deepEqual(json1, json2, 'json not the same');
  console.log('  Sort JSON', 'pass');

  assert.deepEqual(util.checksum(JSON.stringify(json1)), util.checksum(JSON.stringify(json2)), 'checksum not the same');
  console.log('  Checksum', 'pass');


  console.log('Array check sum');

  nest = {
    'y': 'yyyy',
    'z': 'zzzz',
    'x': 'xxxx'
  };

  var arr1 = ['c', 'a', nest, 'b'];
  var arr2 = [nest, 'b', 'c', 'a'];

  util.sortJSON(arr1);
  util.sortJSON(arr2);
  assert.deepEqual(arr1[2], arr2[0], 'array not the same');
  console.log('  Sort JSON', 'pass');

  assert.deepEqual(util.checksum(JSON.stringify(arr1[2])), util.checksum(JSON.stringify(arr2[0])), 'checksum not the same');
  console.log('  Checksum', 'pass');


  console.log('Cache');
  var cachePlugin = getCachePlugin({
    'cache1': {
      maxSize: 500,
      maxAge: 1000 * 60 * 60
    }
  });
  var pluginOpt = {
    params: ['cache1'],
    ctx: {
      dialect: 'mysql',
      database: 'test',
      namespace: 'cache1',
      queryName: 'cache1.select'
    }
  };

  var params = [0, 1];
  var values = [0, 1, 2, 3, 4, 5];

  cachePlugin.cache.onQuery(params, pluginOpt, function (results) {
    assert.ok(results === undefined, 'cache not exists');
    console.log('   cache not exists');
    cachePlugin.cache.afterMapping(values, pluginOpt, function (results) {
      assert.deepEqual(results, values, 'cache values not the same');
      console.log('   cache values');
      cachePlugin.cache.onQuery(params, pluginOpt, function (results) {
        assert.deepEqual(results, values, 'cache values not the same');
        console.log('   check cache values');
        cachePlugin.flush.onQuery(params, pluginOpt, function (results) {
          console.log('   flush cache');
          cachePlugin.cache.onQuery(params, pluginOpt, function (results) {
            assert.ok(results === undefined, 'cache not exists');
            console.log('   cache values');
          });
        });
      });
    });
  });

})();
