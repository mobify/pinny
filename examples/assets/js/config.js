require.config({
    baseUrl: '../',
    paths: {
        'text': 'bower_components/requirejs-text/text',
        '$': 'lib/zeptojs/dist/zepto',
        'bouncefix': 'bower_components/bouncefix.js/dist/bouncefix.min',
        'velocity': 'bower_components/velocity/velocity',
        'modal-center': 'dist/modal-center',
        'sheet-bottom': 'dist/sheet-bottom',
        'sheet-left': 'dist/sheet-left',
        'sheet-right': 'dist/sheet-right',
        'sheet-top': 'dist/sheet-top',
        'shade': 'dist/shade',
        'pinny': 'dist/pinny'
    },
    'shim': {
        '$': {
            exports: '$'
        }
    }
});
