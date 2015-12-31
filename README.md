# GruntWork

GruntWork is a lightweight [Grunt](http://gruntjs.com/) boilerplate I use for small JS projects.

## Install

* edit `package.json` for version, author, license etc
* add info, dependencies to `bower.json`

```
(sudo) npm install
bower install
```

## Development

## build/publish

```!bash
#Build
grunt

#watch
grunt watch
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
