module.exports = function(grunt) {

    grunt.initConfig({

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

        // concat js files
        concat: {
            js:{
                options: {
                    separator: ';\n',
                    banner: '<%= meta.banner %>\n'
                },
                src: ['src/**/*.js'],
                dest: 'dist/<%= pkg.name %>.js'
            },
            css:{
                options: {
                    separator: '\n',
                    banner: '<%= meta.banner %>\n'
                },
                src: ['src/**/*.css'],
                dest: 'dist/<%= pkg.name %>.css'
            }
        },

        copy: {
            // js
            js: {
                src: [
                    // vendors, this  rule is very broad, so specify this for your module
                    'vendor/**/build/*.js',
                    'vendor/**/dist/*.js'
                ],
                dest: 'dist/'
            },
            // css
            css: {
                src: [
                    // vendors, this  rule is very broad, so specify this for your module
                    'vendor/**/build/*.css',
                    'vendor/**/dist/*.css'
                ],
                dest: 'dist/'
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

        clean: {
            build: {
                src: ['dist/**']
            }
        },

        uglify: {
            js: {
                options: {
                    banner: '<%= meta.banner %>\n'
                },
                files: {
                    'dist/<%= pkg.name %>.min.js': ['<%= concat.js.dest %>']
                }
            }
        },

        jshint: {
            files: ['Gruntfile.js', 'src/**/*.js', 'test/**/*.js'],
            options: {
                // options here to override JSHint defaults
                globals: {
                    jQuery: false,
                    console: true,
                    module: true,
                    document: true
                }
            }
        },

        // configure watch task
        watch: {
            files: ['<%= jshint.files %>'],
            tasks: ['jshint', 'concat']
        },

        // string replacments in index.html
        replace: {
            dist: {
                options: {
                    patterns: [{
                        match: 'package',
                        replacement: '<%= pkg.name %>'
                    }, {
                        match: 'version',
                        replacement: '<%= pkg.version %>'
                    }]
                },
                files: [{
                    src: ['dist/index.html'],
                    dest: 'dist/index.html'
                }]
            }
        }

    });

    // load tasks
    grunt.loadNpmTasks('grunt-replace');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    // perform tasks, just comment out what you don't need
    grunt.registerTask(
        'default',
        'Compiles all of the assets and copies the files to the build directory.', [
            'clean',
            'jshint',
            'concat',
            'copy',
            'replace',
            'uglify'
        ]
    );

};
