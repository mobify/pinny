require.config({
    baseUrl: '../../',
    paths: {
        'text': 'bower_components/requirejs-text/text',
        'fixtures': 'tests/fixtures',
        'bouncefix': 'bower_components/bouncefix.js/dist/bouncefix.min',
        '$': 'lib/zeptojs/dist/zepto',
        'velocity': 'bower_components/velocity/velocity',
        'chai': 'node_modules/chai/chai',
        'mocha': 'node_modules/mocha/mocha',
        'modal-center': 'dist/position/modal-center.min',
        'sheet-bottom': 'dist/position/sheet-bottom.min',
        'sheet-left': 'dist/position/sheet-left.min',
        'sheet-right': 'dist/position/sheet-right.min',
        'sheet-top': 'dist/position/sheet-top.min',
        'shade': 'bower_components/shade/dist/shade.min',
        'pinny': 'dist/pinny.min'
    },
    'shim': {
        'mocha': {
            init: function() {
                this.mocha.setup('bdd');
                return this.mocha;
            }
        },
        '$': {
            exports: '$'
        }
    }
});
