'use strict';

var LRU = require("lru-cache");

var dummy = {
  get: function(k) {
    return undefined;
  },
  set: function() {},
  del: function() {}
};

module.exports = function(opts) {
  var caches = {};

  for (var key in opts) {
    var value = opts[key];
    caches[key] = LRU({
      max: value.maxSize || 1024,
      maxAge: value.maxAge || 1000 * 60 * 60, // one hour
      length: function(n, key) {
        return n.length + key.length;
      }
    });
  }

  return function(name) {
    return caches[name] || dummy;
  };
};
