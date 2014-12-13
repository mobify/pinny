module.exports = function(grunt) {
    return {
        standalone: {
            options: {
                baseUrl: './',
                name: 'node_modules/almond/almond.js',
                include: ['effects'],
                mainConfigFile: 'config.js',
                wrap: {
                    start: '(function() {',
                    end: 'require(["effects"], null, undefined, true)})();'
                },
                out: 'dist/pinny.standalone.js',
                optimize: 'none'
            }
        }
    };
};
