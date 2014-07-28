require(['config'], function() {
    require([
        'selectorEngine',
        'pinny'
    ],
    function($) {
        // Initialize Pinny
        var $pinny = $('#somePinny').pinny();

        $('#pinnyActivator').on('click', function() {
            $pinny.pinny('toggle');
        });

        // Enable active states
        $(document).on('touchstart', function() {});
    });
});
