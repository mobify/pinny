# Mobify Pinny

A mobile-first content fly-in UI plugin.

![Pinny in action](https://raw.githubusercontent.com/mobify/pinny/pinny-1.0/examples/assets/i/pinny.gif "Pinny in action")

## Requirements

* [Zepto](http://zeptojs.com/)
* [Velocity.js](http://velocityjs.org)

### Velocity

If you are using Zepto, you need to load `bower_components/velocity/velocity.js` (this file comes with a jQuery shim bundled directly in it). If you are using jQuery, you need to load `bower_components/velocity/jquery.velocity.js`.

### jQuery Support

Pinny supports jQuery but is not actively developed for it. You should be able to use Pinny directly with jQuery 2.0. While we don't actively support jQuery for Pinny, we welcome any and all issues and PRs to help us make it work.


## Installation

Pinny can be installed using bower:

```
bower install pinny
```

## Usage with Require.js

To use with require.js, after installing through bower you merely have to reference pinny, pinny's effect modules, and pinny's dependencies (velocity, shade, and bouncefix) inside your require config file:

```config.js

{
    'paths': {
        'pinny': 'bower_components/pinny/dist/pinny.min',
        'modal-center': 'bower_components/pinny/dist/effect/modal-center',
        'sheet-bottom': 'bower_components/pinny/dist/effect/sheet-bottom',
        'sheet-left': 'bower_components/pinny/dist/effect/sheet-left',
        'sheet-right': 'bower_components/pinny/dist/effect/sheet-right',
        'sheet-top': 'bower_components/pinny/dist/effect/sheet-top',
        'shade': 'bower_components/shade/dist/shade.min',
        'velocity': 'bower_components/velocity/velocity',
        'bouncefix': 'bower_components/bouncefix.js/dist/bouncefix.min'
    }
}

```

And then require pinny in as needed:

```
define([
    'zepto',
    'modal-center',
    'pinny'
    ],
    function($, modalCenter) {
        $('.pinny').pinny({
        	effect: modalCenter
        });
    }
);
```


## Usage

Pinny requires very minimal markup. In fact, all pinny needs is a div with your content, and a class attribute with the class `pinny__hidden`.

```html
<!-- Include the CSS -->
<link rel="stylesheet" href="pinny.min.css">

<!-- Optionally include the Theme file -->
<link rel="stylesheet" href="pinny-style.min.css">

<!-- Include the markup -->
<div class="pinny_hidden">
	Your pinny content
</div>

<!-- Include dependencies -->
<script src="zepto.min.js"></script>
<script src="velocity.min.js"></script>

<!-- Include the effect module you want to use -->
<script src="effect/modal-center.js"></script>
<!-- Include pinny.js -->
<script src="pinny.min.js"></script>

<!-- Construct Pinny -->
<script>$('.pinny').pinny()</script>
```

## Initializing the plugin

### pinny()

Initializes the pinny.

```js
$('#myPinny').pinny({
	effect: modalCenter
});
```

### pinny(options)

Initialize with options.

```js
$('#myPinny').pinny({
    effect: {
        open: noop,
        close: noop
    },
    header: 'Pinny',
    footer: '',
    zIndex: 2,
    coverage: '100%',
    easing: 'swing',
    duration: 200,
   	shade: true,
    open: noop,
    opened: noop,
    close: noop,
    closed: noop
});
```

#### Options

##### effect

default: ` {
        open: noop,
        close: noop
    },`

Specifies which `effect` module Pinny should use when opening. `Effect` modules allow you to load specific functionality that tell Pinny how to open and close. Available `effect` modules can be found in the `dist/effect` folder. Current `effect` modules include:

- Modal Center - opens Pinny in the center of the screen
- Sheet Top - slides down from the top of the screen
- Sheet Bottom - slides up from the bottom of the screen
- Sheet Left - slides in from the left of the screen
- Sheet Right - slides in from the right of the screen

```js
$('#myPinny').pinny({
    effect: sheetLeft
});
```

##### header

default `Pinny`

Sets the header that pinny should use in its header bar. Valid values are:

`boolean` - specifies no default header generated. If chosen, the user is required to specify the header markup themselves.
`string` - specifies the title text used in the header. The header structure will be generated automatically.
`html|element` - specifies the HTML to be used for the header

```js
// generates no header
$('#myPinny').pinny({
	header: false
});
```
or

```js
// generates a default header with the title "My Pinny"
$('#myPinny').pinny({
	header: 'My Pinny'
});
```

or

```js
$('#myPinny').pinny({
	header: '<header class="pinny__header">My Pinny<button class="pinny__close">Close</button></header>'
});
```

##### footer

default `''`

Sets the footer.

```js
$('#myPinny').pinny({
    footer: '<div>some footer</div>'
});
```

##### zIndex

default `2`

Sets the z-index value for the pinny. Use this value if you need to specify a specific stacking order.

```js
$('#myPinny').pinny({
    zIndex: 10
});
```

##### coverage

default `80%`

Sets the coverage value. This will allow you to specify that the pinny covers only a portion of the screen.

```js
$('#myPinny').pinny({
    coverage: '80%'
});
```

##### duration

default: `200`

Sets the duration for the animation.

```js
$('#myPinny').pinny({
    duration: 600
});
```

##### shade

default: `{}`

Specifies whether pinny should use the shade overlay. You can pass options through to [Shade](http://github.com/mobify/shade) using this property. For more information on available options, see the [Shade documentation](http://github.com/mobify/shade). 

```js
$('#myPinny').pinny({
    shade: {
        duration: 400
    }
});
```

##### easing

default: `swing`

Sets the easing for the animation. Pinny takes all of the same easing properties that [Velocity.js](http://julian.com/research/velocity) accepts.

> * [jQuery UI's easings](http://easings.net/) and CSS3's easings ("ease", "ease-in", "ease-out", and "ease-in-out"), which are pre-packaged into Velocity. A bonus "spring" easing (sampled in the CSS Support pane) is also included.
* CSS3's bezier curves: Pass in a four-item array of bezier points. (Refer to [Cubic-Bezier.com](http://cubic-bezier.com/) for crafing custom bezier curves.)
* Spring physics: Pass a two-item array in the form of [ tension, friction ]. A higher tension (default: 600) increases total speed and bounciness. A lower friction (default: 20) increases ending vibration speed.
* Step easing: Pass a one-item array in the form of [ steps ]. The animation will jump toward its end values using the specified number of steps.

For more information, check out [Velocity's docs on easing](http://julian.com/research/velocity/#easing).

```js
$('#myPinny').pinny({
    easing: 'ease-in-out'
});
```

##### open

default: `function(e, ui) {}`

Triggered every time the selected pinny item is starting to open.

**Parameters**

| Parameter name | Description |
|----------------|-------------|
| **e** | An Event object passed to the callback |
| **ui** | An object containing any associated data for use inside the callback |

```js
$('#myPinny').pinny({
    open: function(e, ui) {
        // ui.item contains the item opening
    }
});
```

##### opened

default: `function(e, ui) {}`

Triggered every time the selected pinny item has finished opening.

**Parameters**

| Parameter name | Description |
|----------------|-------------|
| **e** | An Event object passed to the callback |
| **ui** | An object containing any associated data for use inside the callback |

```js
$('#myPinny').pinny({
    opened: function(e, ui) {
        // ui.item contains the item that opened
    }
});
```

##### close

default: `function(e, ui) {}`

Triggered every time an pinny item is starting to close.

| Parameter name | Description |
|----------------|-------------|
| **e** | An Event object passed to the callback |
| **ui** | An object containing any associated data for use inside the callback |

```js
$('#myPinny').pinny({
    close: function(e, ui) {
        // ui.item contains the item closing
    }
});
```

##### closed

default: `function(e, ui) {}`

Triggered every time an pinny item is finished closing.

| Parameter name | Description |
|----------------|-------------|
| **e** | An Event object passed to the callback |
| **ui** | An object containing any associated data for use inside the callback |

```js
$('#myPinny').pinny({
    closed: function(e, ui) {
        // ui.item contains the item that closed
    }
});
```

### Storing pinny object for future use

```js
$('#myPinny').pinny();
```

## Methods

### Open

Open the selected pinny item by element reference

```js
$pinny.pinny('open');
```

### Close

Close the selected pinny item by element reference

```js
$pinny.pinny('close');
```

## Browser Compatibility

| Browser           | Version | Support                      |
|-------------------|---------|------------------------------|
| Mobile Safari     | 6.0+    | Supported.                   |
| Chrome (Android)  | 1.0+    | Supported.                   |
| Android Browser   | 4.0+    | Degraded. No scroll locking. |
| Android Browser   | 2.3.x   | Degraded. No transitions.    |
| IE for Win Phone  | 8.0+    | Degraded. No scroll locking. |


## Building a distribution

### Requirements
* [node.js 0.10.x/npm](http://nodejs.org/download/)
* [Grunt](http://gruntjs.com/)
    * Install with `npm install -g grunt-cli`
* [Bower](http://bower.io/)
    * Install with `npm install -g bower`

### Steps
1. `npm install`
1. `bower install`
1. `grunt build-dist`

The `dist` directory will be populated with minified versions of the css and javascript files for distribution and use with whatever build system you might use. The `src` directory has our raw unminified Sass and Javascript files if you prefer to work with those.

## License

_MIT License. Pinny is Copyright © 2014 Mobify. It is free software and may be redistributed under the terms specified in the LICENSE file._
