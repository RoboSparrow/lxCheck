module.exports = function(grunt) {

    ////
    // configure project
    ////

    var CONF = {

        // task: concat
        concat: {
            // name slug for the concated js file (i.e app.js, app.css, app.min.js)
            destSlug: 'spec', //destSlug: 'app'
            // debug: print src file paths as comments
            printPath: true,
            // glob patterns and order for file concat tasks
            files:{
                js: ['src/spec.js', 'src/**/*.spec.js'],     // main file on top
                css: ['src/main.css', 'src/**/*.css'],   // main file on top
                req:[ 'req/req.js', 'req/req.xapi.js']   //lxReq
            }
        }
    };

    ////
    // grunt config
    ////

    grunt.initConfig({

        CONF: CONF,

        pkg: grunt.file.readJSON('package.json'),

        // banner
        meta: {
            banner: [
                '/**',
                ' * <%= pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %>',
                ' * Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author %>',
                ' * Licensed <%= pkg.licenses.type %> <<%= pkg.licenses.url %>>',
                ' */',
                ''
            ].join("\n")
        },

        // concat files
        concat: {
            // js
            js:{
                options: {
                    separator: '\n',
                    banner: '<%= meta.banner %>\n',
                    process: function(src, filepath) {
                        // add reference to concated file
                        return (CONF.concat.printPath) ? '/*' + filepath + '*/\n\n' + src : src;
                    },
                    sourceMap: true
                },
                src: CONF.concat.files.js,
                dest: 'dist/' + CONF.concat.destSlug + '.js'
            },
            // js
            req:{
                options: {
                    separator: '\n',
                    banner: '<%= meta.banner %>\n',
                    process: function(src, filepath) {
                        // add reference to concated file
                        return (CONF.concat.printPath) ? '/*' + filepath + '*/\n\n' + src : src;
                    },
                    sourceMap: true
                },
                src: CONF.concat.files.req,
                dest: 'dist/lx-request.js'
            },

            // css
            css:{
                options: {
                    separator: '\n',
                    banner: '<%= meta.banner %>\n',
                    process: function(src, filepath) {
                        return (CONF.concat.printPath) ? '/*' + filepath + '*/\n\n' + src : src;
                    },
                    sourceMap: true
                },
                src: CONF.concat.files.css,
                dest: 'dist/' + CONF.concat.destSlug + '.css'
            }
        },

        // copy files
        copy: {
            helper: {
                expand: true,
                cwd: 'src/',
                src: [
                    'helper.js'
                ],
                dest: 'dist/'
            },
            mocha: {
                expand: true,
                cwd: 'node_modules/mocha/',
                src: [
                    'mocha.js',
                    'mocha.css',
                    'images/*'
                ],
                dest: 'dist/vendor/mocha'
            },
            chai: {
                expand: true,
                cwd: 'node_modules/chai/',
                src: [
                    'chai.js'
                ],
                dest: 'dist/vendor/mocha'
            },
            pure: {
                expand: true,
                cwd: 'node_modules/purecss/build/',
                src: [
                    'pure-min.css',
                    'grids-responsive-min.css',
                ],
                dest: 'dist/vendor/pure'
            },
            sha2: {
                expand: true,
                cwd: 'node_modules/js-sha256/build/',
                src: [
                    'sha256.min.js'
                ],
                dest: 'dist/vendor'
            },
            // html
            html: {
                expand: true,
                cwd: 'src/',
                src: ['**/*.html'],
                dest: 'dist/'
            },
            // assets
            assets: {
                expand: true,
                cwd: 'src/assets/',
                src: ['**/*.*'],
                dest: 'dist/assets/'
            }

        },

        // clean dist folder (before build)
        clean: {
            build: {
                src: ['dist/**']
            }
        },

        // jshint: specify your preferred options in 'globals'
        // http://jshint.com/docs/options/
        jshint: {
            files: ['Gruntfile.js', 'src/**/*.js', 'req/**/*.js'],
            options:{
                jshintrc: true
            }
        },

        // configure watch task
        watch: {
            files: ['<%= jshint.files %>', 'src/**/*.css', 'src/**/*.html'],
            tasks: ['jshint', 'concat', 'copy']
        }

    }); // end grunt.initConfig

    ////
    // grunt tasks
    ////

    // requirements

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');

    // custom tasks (mind the order of your tasks!), just comment out what you don't need
    grunt.registerTask(
        'default',
        'Compiles all of the assets and copies the files to the build directory.', [
            'clean',
            'jshint',
            'concat',
            'copy'
        ]
    );

}; // end module.exports
