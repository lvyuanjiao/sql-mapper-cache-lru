'use strict';

var assert = require('assert');
var cache = require('../index');
var util = require('../util');

(function () {

  console.log('JSON check sum');
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

  assert.deepEqual(util.checksum(json1), util.checksum(json2), 'checksum not the same');
  console.log('  Checksum', 'pass');



})();
