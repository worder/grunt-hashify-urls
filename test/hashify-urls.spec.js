var expect = require('chai').expect;
var hashifyUrls = require('../src/hashify-urls.js');

function run(input) {
  return hashifyUrls(input, {
    baseDir: __dirname + '/resources'
  });
}

describe('hashify-urls', function () {
  describe('relative urls', function () {
    it('appends hash', function () {
      var input = '.class1 { background: url(/images/blank.gif); }'
        + '.class2 { background: url(/images/github.png) }';
      var output = '.class1 { background: url(/images/blank.gif?v=b44917055649); }'
        + '.class2 { background: url(/images/github.png?v=cefc20232703) }';

      expect(run(input)).to.equal(output);
    });
  });

  describe('hash length specified', function () {
    it('returns the hash in the specified length', function () {
      var input = '.class1 { background: url(/images/blank.gif); }'
      var output = '.class1 { background: url(/images/blank.gif?v=b4491705); }'

      expect(hashifyUrls(input, {
        hashLength: 8,
        baseDir: __dirname + '/resources'
      })).to.equal(output);
    });
  });

  describe('ie eot format svg urls', function () {
    it('preserves the #iefix', function () {
      var input = '.class { font-family: webfont; src: url(/fonts/webfont.eot);'
        + 'src: url(/fonts/webfont.eot?#iefix) format(embedded-opentype) }';
      var output = '.class { font-family: webfont; src: url(/fonts/webfont.eot?v=679667b4d450);'
        + 'src: url(/fonts/webfont.eot?v=679667b4d450#iefix) format(embedded-opentype) }';

      expect(run(input)).to.equal(output);
    });
  });

  describe('absolute urls', function () {
    it('does nothing', function () {
      var input = '.class1 { background: url(http://example.com/image-1.png); }'
        + '.class2 { background: url(https://example.com/image-2.png); }'

      expect(run(input)).to.equal(input);
    });
  });

  describe('data urls', function () {
    it('does nothing', function () {
      var input = '.class { background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhE…); }';

      expect(run(input)).to.equal(input);
    });
  });

  describe('invalid urls', function () {
    it('does nothing', function () {
      var input = '.class { background: url(/images/invalid.gif); }';

      expect(run(input)).to.equal(input);
    });
  });

});
