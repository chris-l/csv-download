module.exports = function(grunt) {

  grunt.initConfig({
    'jslint'  : {
      all     : {
        src : [ 'src/*.js' ],
        directives : {
          indent : 2
        }
      }
    },
    'uglify'  : {
        target : {
          files : { 'dist/csv-download.js' : 'src/csv-download.js' }
      }
    },
    'connect': {
      demo: {
        options: {
          open: true,
          keepalive: true
        }
      }
    },
    'gh-pages': {
      options: {
        clone: 'bower_components/csv-download'
      },
      src: [
        'bower_components/**/*',
        '!bower_components/csv-download/**/*',
        'demo/*', 'src/*', 'index.html'
      ]
    },
    vulcanize: {
      default: {
        options: {
          inline: true,
          'strip-excludes' : false,
          excludes: {
            imports: [ "polymer.html" ]
          }
        },
        files: {
          'dist/csv-download.html' : 'dist/csv-download.html'
        }
      }
    },
    clean : [ 'dist/csv-download.js' ],
    'replace': {
      example: {
        src: ['src/*'],
        dest: 'dist/',
        replacements: [{
          from: 'bower_components',
          to: '..'
        }]
      }
    }
  });

  grunt.loadNpmTasks('grunt-jslint');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-gh-pages');
  grunt.loadNpmTasks('grunt-text-replace');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-vulcanize');
  grunt.loadNpmTasks('grunt-contrib-clean');

  grunt.registerTask('lint',  ['jslint']);
  grunt.registerTask('build',  ['jslint', 'replace', 'uglify', 'vulcanize', 'clean']);
  grunt.registerTask('deploy', ['gh-pages']);
  grunt.registerTask('server', ['connect']);

};
