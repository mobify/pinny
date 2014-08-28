module.exports = function(grunt) {
    return {
        options: {
            banner: '/*! <%= pkg.name %> <%= pkg.version %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
        },
        build: {
            files: {
                'dist/pinny.min.js': 'src/js/pinny.js',
                'dist/shade.min.js': 'src/js/shade.js',
                'dist/position/modal-center.min.js': 'src/js/position/modal-center.js',
                'dist/position/sheet-top.min.js': 'src/js/position/sheet-top.js',
                'dist/position/sheet-bottom.min.js': 'src/js/position/sheet-bottom.js',
                'dist/position/sheet-left.min.js': 'src/js/position/sheet-left.js',
                'dist/position/sheet-right.min.js': 'src/js/position/sheet-right.js'
            }
        }
    };
};