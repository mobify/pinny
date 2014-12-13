module.exports = function(grunt) {
    return {
        standalone: {
            options: {
                baseUrl: './',
                name: 'node_modules/almond/almond.js',
                include: ['effects'],
                mainConfigFile: 'config.js',
                insertRequire: ['effects'],
                out: 'dist/pinny.standalone.js',
                optimize: 'none'
            }
        }
    };
};
