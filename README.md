# grunt-hashify-urls

This Grunt task searches CSS files for `url(…)`s, gets the MD5 hash of the referenced content, and then appends a query string to the url to bust CDN caches. For example, `.class { background: url(/images/blank.gif); }` becomes `.class { background: url(/images/blank.gif?v=b44917055649); }`.

It does _not_ do anything for:

- absolute urls, e.g. `url(http://…)` or `url(https://…)`
- data uris, e.g. `url(data:image/png;base64,iVBORw0…)`
- invalid urls, e.g. the file doesn't exist in the fs


## Usage:

1. Install: `npm install grunt-hashify-urls`
