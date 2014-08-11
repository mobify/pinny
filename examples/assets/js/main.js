require(['config'], function() {
    require([
        'modal-center',
        'selectorEngine',
        'pinny'
    ],
    function(position, $) {
        // Initialize Pinny
        var $pinny = $('#somePinny').pinny({
            position: position
        });

        $('#pinnyActivator').on('click', function() {
            $pinny.pinny('toggle');
        });

        // Enable active states
        $(document).on('touchstart', function() {});
    });
});
