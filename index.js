'use strict';

var util = require('./util');
var buildCacheProvider = require('./cache-provider');

/*
  var opts = {
    post: {
      maxSize: 500,
      maxAge: 1000 * 60 * 60
    }
  }
*/
module.exports = function(opts) {
  var cacheProvider = buildCacheProvider(opts);

  function getCacheProvider(plugin) {
    return cacheProvider(plugin.params[0] || plugin.ctx.namespace);
  }

  function getCacheKey(plugin, params) {
    return util.getCacheKey(plugin.ctx.dialect, plugin.ctx.database, plugin.queryName, params);
  }
  return {
    cache: {
      onQuery: function(params, plugin, done) {
        var cacheKey = plugin.ctx.cacheKey = getCacheKey(plugin, params);
        done(getCacheProvider(plugin).get(cacheKey));
      },
      afterMapping: function(results, plugin, done) {
        getCacheProvider(plugin).set(plugin.ctx.cacheKey, results);
        done(results);
      }
    },
    flush: {
      onQuery: function(params, plugin, done) {
        getCacheProvider(plugin).del(getCacheKey(plugin, params));
        done();
      }
    }
  };
};
