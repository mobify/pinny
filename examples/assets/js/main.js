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
            position: modalCenter,
            coverage: '90%'
        });

        $('#modalCenter').on('click', function() {
            $modalCenter.pinny('toggle');
        });

        var $sheetTop = $('#sheetTopPinny').pinny({
            position: sheetTop,
            coverage: '80%',
            shade: {
                duration: 200
            }
        });

        $('#sheetTop').on('click', function() {
            $sheetTop.pinny('toggle');
        });

        var $sheetRight = $('#sheetRightPinny').pinny({
            position: sheetRight,
            coverage: '80%'
        });

        $('#sheetRight').on('click', function() {
            $sheetRight.pinny('toggle');
        });

        var $sheetLeft = $('#sheetLeftPinny').pinny({
            position: sheetLeft,
            coverage: '80%'
        });

        $('#sheetLeft').on('click', function() {
            $sheetLeft.pinny('toggle');
        });

        var $sheetBottom = $('#sheetBottomPinny').pinny({
            position: sheetBottom,
            coverage: '80%'
        });

        $('#sheetBottom').on('click', function() {
            $sheetBottom.pinny('toggle');
        });

        // Enable active states
        $(document).on('touchstart', function() {});
    });
});
