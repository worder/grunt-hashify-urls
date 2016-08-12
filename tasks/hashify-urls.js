'use strict';

var hashifyUrls = require('./lib/hashify-urls.js');

module.exports = function (grunt) {
  grunt.registerMultiTask('hashifyUrls', 'Hashify CSS url()’s.', function () {
    var options = this.options();

    // Iterate over all src-dest file pairs.
    this.files.forEach(function (f) {
      // Hashify CSS files
      f.src.filter(function (filepath) {
        // Warn on and remove invalid source files (if nonull was set).
        if (!grunt.file.exists(filepath)) {
          grunt.log.warn('Source file "' + filepath + '" not found.');
          return false;
        } else {
          return true;
        }
      }).map(function (filepath) {
        // Read file source.
        var content = grunt.file.read(filepath);

        options.cssPath = filepath;
        var hashified = hashifyUrls(content, options);

        grunt.file.write(filepath, hashified);
        grunt.log.writeln('✔ '.cyan + 'File', filepath.cyan, 'hashified.');
      });
    });
  });
};
