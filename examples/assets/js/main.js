require(['config'], function() {
    require([
        'sheet-bottom',
        'selectorEngine',
        'pinny'
    ],
    function(position, $) {
        // Initialize Pinny
        var $pinny = $('#somePinny').pinny({
            position: position,
            coverage: '100%',
        });

        $('.pinnyActivator').on('click', function() {
            $pinny.pinny('toggle');
        });

        // Enable active states
        $(document).on('touchstart', function() {});
    });
});
