require.config({
    baseUrl: '../',
    paths: {
        'text': 'bower_components/requirejs-text/text',
        'selectorEngine': 'bower_components/jquery/dist/jquery',
        'bouncefix': 'bower_components/bouncefix.js/dist/bouncefix.min',
        'zappy': 'bower_components/tappy/tappy',
        'velocity-shim': 'lib/velocity-shim',
        'velocity': 'bower_components/velocity/jquery.velocity',
        'modal-center': 'dist/position-modal-center',
        'modal-bottom': 'dist/position-modal-bottom',
        'shade': 'dist/shade',
        'pinny': 'dist/pinny'
    },
    'shim': {
        'selectorEngine': {
            exports: '$'
        },
        'zappy': {
            deps: ['selectorEngine'],
            exports: '$'
        },
        // 'velocity-shim': {
        //     deps: ['selectorEngine'],
        //     exports: '$'
        // },
        'velocity': {
            deps: ['selectorEngine'],
            exports: '$'
        }
    }
});
