require.config({
    baseUrl: '../',
    paths: {
        'text': 'bower_components/requirejs-text/text',
        '$': 'bower_components/jquery/dist/jquery',
        'bouncefix': 'bower_components/bouncefix.js/dist/bouncefix.min',
        'velocity': 'bower_components/velocity/velocity',
        'modal-center': 'dist/position/modal-center.min',
        'sheet-bottom': 'dist/position/sheet-bottom.min',
        'sheet-left': 'dist/position/sheet-left.min',
        'sheet-right': 'dist/position/sheet-right.min',
        'sheet-top': 'dist/position/sheet-top.min',
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
