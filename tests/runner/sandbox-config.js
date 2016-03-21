require.config({
    baseUrl: '../../',
    paths: {
        'text': 'node_modules/requirejs-text/text',
        'fixtures': 'tests/fixtures',
        'bouncefix': 'node_modules/bouncefix.js/dist/bouncefix.min',
        '$': 'node_modules/jquery/dist/jquery.min',
        'velocity': 'node_modules/velocity-animate/velocity',
        'chai': 'node_modules/chai/chai',
        'mocha': 'node_modules/mocha/mocha',
        'modal-center': 'dist/effect/modal-center',
        'sheet-bottom': 'dist/effect/sheet-bottom',
        'sheet-left': 'dist/effect/sheet-left',
        'sheet-right': 'dist/effect/sheet-right',
        'sheet-top': 'dist/effect/sheet-top',
        'plugin': 'node_modules/plugin/dist/plugin',
        'shade': 'node_modules/shade/dist/shade.min',
        'deckard': 'node_modules/deckard/dist/deckard.min',
        'lockup': 'node_modules/lockup/dist/lockup',
        'event-polyfill': 'dist/utils/event-polyfil',
        'isChildOf': 'node_modules/selector-utils/src/selector/isChildOf',
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
