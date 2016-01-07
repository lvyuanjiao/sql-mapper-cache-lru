'use strict';

// http://stackoverflow.com/questions/811195/fast-open-source-checksum-for-small-strings
exports.checksum = function(s) {
  var i;
  var chk = 0x12345678;
  for (i = 0; i < s.length; i++) {
    chk += (s.charCodeAt(i) * (i + 1));
  }
  return chk;
};

// http://stackoverflow.com/questions/5467129/sort-javascript-object-by-key
exports.sortJSON = function(unordered) {
  if (typeof unordered !== 'object' || Array.isArray(unordered)) {
    return;
  }
  Object.keys(unordered).sort().forEach(function(key) {
    var value = unordered[key];
    delete unordered[key];
    exports.sortJSON(value);
    unordered[key] = value;
  });
};

exports.getCacheKey = function(dialect, database, queryname, json) {
  exports.sortJSON(json);
  return 'cache-' + exports.checksum(dialect + database + queryname + json);
};
