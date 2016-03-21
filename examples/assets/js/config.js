require.config({
    baseUrl: '../',
    paths: {
        'text': 'node_modules/text/text',
        '$': 'node_modules/jquery/dist/jquery.min',
        'bouncefix': 'node_modules/bouncefix.js/dist/bouncefix.min',
        'velocity': 'node_modules/velocity-animate/velocity',
        'modal-center': 'dist/effect/modal-center',
        'sheet-bottom': 'dist/effect/sheet-bottom',
        'sheet-left': 'dist/effect/sheet-left',
        'sheet-right': 'dist/effect/sheet-right',
        'sheet-top': 'dist/effect/sheet-top',
        'plugin': 'node_modules/plugin/dist/plugin.min',
        'shade': 'node_modules/shade/dist/shade.min',
        'lockup': 'node_modules/lockup/src/js/lockup',
        'deckard': 'node_modules/deckard/dist/deckard.min',
        'event-polyfill': 'dist/utils/event-polyfil',
        'isChildOf': 'node_modules/selector-utils/src/selector/isChildOf',
        'pinny': 'src/js/pinny'
    },
    'shim': {
        '$': {
            exports: '$'
        }
    }
});
