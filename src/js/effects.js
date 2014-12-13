(function(factory) {
    if (typeof define === 'function' && define.amd) {
        define([
            '$',
            'modal-center',
            'sheet-bottom',
            'sheet-left',
            'sheet-right',
            'sheet-top',
            'pinny'
        ], factory);
    } else {
        var framework = window.Zepto || window.jQuery;
        factory(framework, window.Plugin, window.bouncefix);
    }
}(function($, modalCenter, sheetBottom, sheetLeft, sheetRight, sheetTop) {
    window.modalCenter = modalCenter;
    window.sheetBottom = sheetBottom;
    window.sheetLeft = sheetLeft;
    window.sheetRight = sheetRight;
    window.sheetTop = sheetTop;
}));
