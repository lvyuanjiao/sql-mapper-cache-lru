'use strict';

var LRU = require("lru-cache");

/*
  var opt = {
    maxSize: 500,
    maxAge: 1000 * 60 * 60
  }
*/
module.exports = function(opt) {
  opt = opt || {};
  var cache = LRU({
    max: opt.maxSize || 1024,
    maxAge: opt.maxAge || 1000 * 60 * 60, // one hour
    length: function(n, key) {
      return n.length + key.length;
    }
  });
  return {
    get: function(key) {
      return cache.get(key);
    },
    set: function(key, value) {
      cache.set(key, value);
    },
    reset: function() {
      cache.reset();
    }
  };
};
