
require(['testHarnessConfig'], function() {
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
            sheetTop, 
            plugin, 
            shade, 
            deckard, 
            lockup, 
            pinny) {

            window.modalCenter = modalCenter;
            window.bounceFix = bounceFix;
            window.$ = $; 
            window.Velocity = velocity; 
            window.modalCenter = modalCenter;
            window.sheetBottom = sheetBottom;
            window.sheetLeft = sheetLeft;
            window.sheetRight = sheetRight;
            window.sheetTop = sheetTop;
            window.plugin = plugin;
            window.shade = shade;
            window.deckard = deckard;
            window.lockup = lockup;
            window.pinny = pinny;

            window.parent.postMessage('loaded', '*');
        });
});
