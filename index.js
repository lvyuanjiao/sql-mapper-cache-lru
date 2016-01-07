'use strict';

var util = require('./util');
var cacheProvider = require('./cache-provider');

/*
  var opts = {
    post: {
      maxSize: 500,
      maxAge: 1000 * 60 * 60
    }
  }
*/
module.exports = function(opts) {
  var getCacheProvider = cacheProvider(opts);
  return {
    cache: {
      onQuery: function(params, plugin, done) {
        var ctx = plugin.ctx;
        var checksum = ctx.checksum = util.getCacheKey(ctx.dialect, ctx.database, ctx.queryName, params);
        var cacheName = plugin.params[0] || ctx.namespace;
        done(getCacheProvider(cacheName).get(checksum));
      },
      afterMapping: function(results, plugin, done) {
        var ctx = plugin.ctx;
        var cacheName = plugin.params[0] || ctx.namespace;
        getCacheProvider(cacheName).set(ctx.checksum, results);
        done(results);
      }
    },
    flush: {
      onQuery: function(params, plugin, done) {
        var ctx = plugin.ctx;
        var checksum = util.getCacheKey(ctx.dialect, ctx.database, ctx.queryName, params);
        var cacheName = plugin.params[0] || ctx.namespace;
        getCacheProvider(cacheName).del(checksum);
        done(params);
      }
    }
  };
};
