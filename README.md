# GruntWork

GruntWork is a very simplistic [Grunt](http://gruntjs.com/) boilerplate I use for small JS projects. It aims to be lightweight and understandable.

## Install

* edit `package.json` for version, author, license etc
* add info, dependencies to `bower.json`
* optionally customize `Gruntfile.js` to your needs

```!bash
npm install
bower install
```

## Development

As usual: develop in `src` and compile to `dist`.

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
