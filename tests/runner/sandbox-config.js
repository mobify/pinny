require.config({
    baseUrl: '../../',
    paths: {
        'text': 'bower_components/requirejs-text/text',
        'fixtures': 'tests/fixtures',
        'bouncefix': 'bower_components/bouncefix.js/dist/bouncefix.min',
        '$': 'lib/zeptojs/dist/zepto',
        'velocity': 'bower_components/mobify-velocity/velocity',
        'chai': 'node_modules/chai/chai',
        'mocha': 'node_modules/mocha/mocha',
        'modal-center': 'dist/effect/modal-center',
        'sheet-bottom': 'dist/effect/sheet-bottom',
        'sheet-left': 'dist/effect/sheet-left',
        'sheet-right': 'dist/effect/sheet-right',
        'sheet-top': 'dist/effect/sheet-top',
        'plugin': 'bower_components/plugin/dist/plugin',
        'shade': 'bower_components/shade/dist/shade.min',
        'deckard': 'bower_components/deckard/dist/deckard.min',
        'lockup': 'bower_components/lockup/dist/lockup',
        'event-polyfill': 'dist/utils/event-polyfil',
        'isChildOf': 'bower_components/selector-utils/src/selector/isChildOf',
        'pinny': 'dist/pinny'
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
