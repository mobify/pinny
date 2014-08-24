require(['config'], function() {
    require([
        'sheet-right',
        'selectorEngine',
        'pinny'
    ],
    function(position, $) {
        // Initialize Pinny
        var $pinny = $('#somePinny').pinny({
            position: position,
            coverage: '90%'
        });

        $('.pinnyActivator').on('click', function() {
            $pinny.pinny('toggle');
        });

        // Enable active states
        $(document).on('touchstart', function() {});
    });
});
