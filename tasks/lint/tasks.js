
module.exports = function(grunt) {
    grunt.loadNpmTasks('grunt-eslint');

    grunt.registerTask('lint:dev', ['eslint:dev']);
    grunt.registerTask('lint:prod', ['eslint:prod']);
    grunt.registerTask('lint', ['lint:dev']);
};
