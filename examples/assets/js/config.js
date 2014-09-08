require.config({
    baseUrl: '../',
    paths: {
        'text': 'bower_components/requirejs-text/text',
        '$': 'bower_components/jquery/dist/jquery',
        'bouncefix': 'bower_components/bouncefix.js/dist/bouncefix.min',
        'velocity': 'bower_components/velocity/velocity',
        'modal-center': 'dist/effect/modal-center.min',
        'sheet-bottom': 'dist/effect/sheet-bottom.min',
        'sheet-left': 'dist/effect/sheet-left.min',
        'sheet-right': 'dist/effect/sheet-right.min',
        'sheet-top': 'dist/effect/sheet-top.min',
        'plugin': 'bower_components/plugin/dist/plugin.min',
        'shade': 'bower_components/shade/dist/shade.min',
        'pinny': 'dist/pinny.min'
    },
    'shim': {
        '$': {
            exports: '$'
        }
    }
});
