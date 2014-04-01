module.exports = function(grunt) {
  require('load-grunt-tasks')(grunt);

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    autoprefixer: {
        options: {
            browsers: ['last 3 iOS versions', 'Android 2.3', 'Android 4', 'last 2 Chrome versions']
        },
        multiple_files: {
            flatten: true,
            src: 'dist/css/*.css', // -> src/css/file1.css, src/css/file2.css
        },
    },
    sass: {
        dist: {
            options: {
                outputStyle: 'compressed'
            },
            files: [{
                expand: true,
                cwd: 'src/scss',
                src: ['*.scss'],
                dest: 'dist/css',
                ext: '.css'
            }]
        }
    }
  });

  // Default task(s).
  grunt.registerTask('default', ['sass', 'autoprefixer']);
};