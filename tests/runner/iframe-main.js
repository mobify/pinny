
require(['iframe-config'], function() {
    require([
        'bouncefix',
        '$',
        'velocity',
        'modal-center',
        'sheet-bottom',
        'sheet-left',
        'sheet-right',
        'sheet-top',
        'plugin',
        'shade',
        'deckard',
        'lockup',
        'pinny'
    ],
        function(
            bounceFix, 
            $,
            velocity, 
            modalCenter, 
            sheetBottom, 
            sheetLeft, 
            sheetRight, 
            sheetTop) {

            var dependencies = {};

            dependencies.modalCenter = modalCenter;
            dependencies.bounceFix = bounceFix;
            dependencies.$ = $;
            dependencies.Velocity = velocity;
            dependencies.modalCenter = modalCenter;
            dependencies.sheetBottom = sheetBottom;
            dependencies.sheetLeft = sheetLeft;
            dependencies.sheetRight = sheetRight;
            dependencies.sheetTop = sheetTop;

            window.dependencies = dependencies;

            window.parent.postMessage('loaded', '*');
        });
});
