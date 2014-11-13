require(['config'], function() {
    require([
        '$',
        'modal-center',
        'sheet-top',
        'sheet-right',
        'sheet-left',
        'sheet-bottom',
        'pinny'
    ],
    function(
        $,
        modalCenter,
        sheetTop,
        sheetRight,
        sheetLeft,
        sheetBottom
    ) {
        var $modalCenter = $('#modalCenterPinny').pinny({
            effect: modalCenter,
            coverage: '80%'
        });

        $('#modalCenter').on('click', function() {
            $modalCenter.pinny('toggle');
        });

        var $sheetTop = $('#sheetTopPinny').pinny({
            effect: sheetTop,
            coverage: '80%',
            shade: {
                duration: 200
            }
        });

        $('#sheetTop').on('click', function() {
            $sheetTop.pinny('toggle');
        });

        var $sheetRight = $('#sheetRightPinny').pinny({
            effect: sheetRight,
            coverage: '80%'
        });

        $('#sheetRight').on('click', function() {
            $sheetRight.pinny('toggle');
        });

        var $sheetLeft = $('#sheetLeftPinny').pinny({
            effect: sheetLeft,
            coverage: '80%'
        });

        $('#sheetLeft').on('click', function() {
            $sheetLeft.pinny('toggle');
        });

        var $sheetBottom = $('#sheetBottomPinny').pinny({
            effect: sheetBottom,
            coverage: '100%'
        });

        $('#sheetBottom').on('click', function() {
            $sheetBottom.pinny('toggle');
        });

        // Enable active states
        $(document).on('touchstart', function() {});

        $(window).on('resize', function() {
            $.__deckard.orientation.call($);
        });
    });
});
