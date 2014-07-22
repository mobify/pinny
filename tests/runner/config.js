require.config({
    baseUrl: '../../',
    paths: {
        'text': 'bower_components/requirejs-text/text',
        'fixtures': 'tests/fixtures',
        'zepto': 'lib/zeptojs/dist/zepto.min',
        'zappy': 'bower_components/tappy/tappy',
        'velocity-shim': 'lib/velocity-shim',
        'velocity': 'bower_components/velocity/jquery.velocity',
        'chai': 'node_modules/chai/chai',
        'mocha': 'node_modules/mocha/mocha',
        'pinny': 'dist/pinny'
    },
    'shim': {
        'mocha': {
            init: function() {
                this.mocha.setup('bdd');
                return this.mocha;
            }
        },
        'zepto': {
            exports: '$'
        },
        'zappy': {
            exports: '$'
        },
        'velocity-shim': {
            exports: '$'
        },
        'velocity': {
            exports: '$',
            deps: ['velocity-shim']
        },
        'pinny': {
            exports: 'Pinny',
            deps: ['zappy', 'velocity']
        }
    }
});
