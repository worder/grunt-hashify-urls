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

  var content;
  try {
    content = fs.readFileSync(path);
  } catch (err) {
    console.warn(path, 'not found');
  }

  if (!content) return;

  var hash = crypto
    .createHash('md5')
    .update(content)
    .digest('hex');

  cache[path] = hash;

  return hash;
}


module.exports = function (content, options) {
  options = options || {};
  var baseDir = options.baseDir || process.cwd();
  var cssPath = path.dirname(options.cssPath) || baseDir;
  var hashLength = options.hashLength || 12;

  var regex   = /url\((.+?)\)/gi;
  var match   = regex.exec(content);
  var matches = [];

  // Process all occurances of the string
  while (match !== null) {
    var uri = match && match[1] || '';

    // Remove quotation marks and whitespace
    var normalizedUri = uri.replace(/(["'\s])/g, '');

    // Filter out blank, absolute and data urls
    if (!/^(http|https|data):/.test(normalizedUri)) {
      // Resolve relative path to full FS path
      var resourcePath = /^\.\.\//.test(normalizedUri)
        ? path.join(cssPath, normalizedUri)
        : path.join(baseDir, url.parse(normalizedUri).pathname);
      var hash = generateHash(resourcePath);

      if (hash) {
        matches.push({
          originalUri: uri,
          normalizedUri: normalizedUri,
          hash: hash
        });
      }
    }

    // Find next match
    match = regex.exec(content);
  }


  // Iterate through the url-hash pairs, globally replace all instances of the
  // uri->hash pair per pass.
  matches.forEach(function (match) {
    // Append truncated hash to the query string, make sure to preserve #iefix
    var uriObj = url.parse(match.normalizedUri);
    var hash = match.hash.slice(0, hashLength);

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
    var expression  = ['(', match.originalUri, ')'].join('');
    var escapedEx   = expression.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
    var match       = new RegExp(escapedEx, 'gi');
    var replacement = ['(', url.format(uriObj), ')'].join('');

    // Run replacement pass
    content = content.replace(match, replacement);
  });

  return content;
};
