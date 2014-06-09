'use strict';

var fs = require('fs');
var path = require('path');
var crypto = require('crypto');
var url = require('url');

// Cache generated hashes for identical url()s
var cache = {};

function generateHash(path) {
  if (cache[path]) {
    return cache[path];
  }

  var content = fs.readFileSync(path);
  var hash = crypto
    .createHash('md5')
    .update(content)
    .digest('hex');

  cache[path] = hash;

  // Not worried about collisions since this is just for cache busting, so just
  // use a shorter string here
  return hash;
}


module.exports = function (content, options) {
  options = options || {};
  var baseDir = options.baseDir || __dirname;
  var hashLength = options.hashLength || 12;

  var regex      = /url\("?(.+?)"?\)/gi;
  var match      = regex.exec(content);
  var fileHashes = {}; // uri->hash map

  // Process all occurances of the string
  while (match !== null) {
    var uri = match && match[1];

    // Filter out blank, absolute and data urls
    if (!uri.trim() || /^(http|https|data):/.test(uri)) {
      break;
    }

    // Resolve relative path to full FS path
    var resourcePath = path.join(baseDir, url.parse(uri).pathname);

    try {
      fileHashes[uri] = generateHash(resourcePath);
    } catch (err) {
      console.warn(resourcePath, 'not found');
    }

    // Find next match
    match = regex.exec(content);
  }

  // Skip out if there's nothing to replace
  var uris = Object.keys(fileHashes);
  if (!uris.length) {
    return content;
  }

  // Iterate through the url-hash pairs, globally replace all instances of the
  // uri->hash pair per pass.
  uris.forEach(function (uri) {
    // Append truncated hash to the query string, make sure to preserve #iefix
    var uriObj = url.parse(uri);
    var hash = fileHashes[uri].slice(0, hashLength);

    uriObj.query = {
      v: hash
    };
    uriObj.search = null;

    // Thanks to http://stackoverflow.com/a/4371855/457519 for pointers at
    // escaping the regex to construct RegExp(). The regex needs to be
    // constructed to incorporate flags, esp. for 'g' to replace everything in
    // one go instead of making a replacement pass per match.
    //
    // The match expression is surrounded by brackets so that subsequent passes
    // do not replace url()'s that have already been replaced.
    var exp       = ['(', uri, ')'].join('');
    var escapedEx = exp.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
    var match     = new RegExp(escapedEx, 'gi');
    var replacement = ['(', url.format(uriObj), ')'].join('');

    // Run replacement pass
    content = content.replace(match, replacement);
  });

  return content;
};
