# grunt-hashify-urls

+[![Build Status](http://img.shields.io/travis/thatmarvin/grunt-hashify-urls.svg)](http://travis-ci.org/thatmarvin/grunt-hashify-urls)

This Grunt task searches CSS files for `url(…)`s, gets the MD5 hash of the referenced resource (background images, web fonts etc), and then appends a query string to the url to bust CDN caches. For example, `.class { background: url(/images/blank.gif); }` becomes `.class { background: url(/images/blank.gif?v=b44917055649); }`.

It does _not_ do anything for:

- absolute urls, e.g. `url(http://…)` or `url(https://…)`
- data uris, e.g. `url(data:image/png;base64,iVBORw0…)`
- invalid urls, e.g. when the resource cannot be correctly resolved in the FS


## Getting Started
This plugin requires Grunt `~0.4.5`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-hashify-urls --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-hashify-urls');
```


## The "hashifyUrls" task

### Overview
In your project's Gruntfile, add a section named `hashifyUrls` to the data object passed into `grunt.initConfig()`.

```javascript
grunt.initConfig({
  hashifyUrls: {
    options: {
      baseDir: 'public'
    },
    dist: {
      files: {
        'css/build.css': ['css/global.css', 'css/component.css']
      }
    }
  }
});
```


### Options

#### options.hashLength

Type: `Number`
Default: `12`

The length of the MD5 hash to truncate to.

#### options.baseDir

type: `String`
Default: `process.cwd()`

The dir to look for resources referenced in CSS `url(…)`s. For example, if your CSS serves `url(/images/logo.png)` and the FS path to the image is `public/images/logo.png`, set this to `public`.



## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

