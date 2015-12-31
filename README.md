# GruntWork

GruntWork is a very simplistic [Grunt](http://gruntjs.com/) boilerplate I am using for small JS projects.

## Install

* edit `package.json` for version, author, license etc
* add info, dependencies to `bower.json`
* optionally extend `Gruntfile.js` to your likikng

```!bash
npm install
bower install
```

## Development

### Watch

```!bash
grunt watch
```

### Build

```!bash
grunt
```

## Used tasks

```
'grunt-replace'             // dist file names in index.html
'grunt-contrib-jshint'
'grunt-contrib-watch'
'grunt-contrib-concat'      // js. css
'grunt-contrib-copy'        // js, css, html, assets
'grunt-contrib-clean'
'grunt-contrib-uglify'      // js

```
## TODO

 * LESS tasks
