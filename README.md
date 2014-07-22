# Mobify Pinny

A mobile-first accordion UI module for progressive disclosure on the web.

## Documentation

You can find full documentation and examples here: http://mobify.github.io/pinny.

## Requirements

* [Zepto](http://zeptojs.com/)
* [Velocity.js](http://velocityjs.org)
* jQuery Shim for Velocity.js (included in the `lib` folder)
* [Zappy](https://github.com/mobify/zappy)

### Velocity Shim

We use a shim for Velocity to polyfill any missing jQuery items so we can continue to use Zepto. If Velocity.js ever stops requiring jQuery, we will be able to stop using this shim.

### jQuery Support

Pinny supports jQuery but is not actively developed for it. You should be able to use Pinny directly with jQuery 2.0 and simply drop the Velocity.js shim in those cases. While we don't actively support jQuery for Pinny, we welcome any and all issues and PRs to help us make it work.


## Installation

Pinny can be installed using bower:

```
bower install pinny
```

## Usage

At a bare minimum, your markup structure should follow the above structure.

## Initializing the plugin

### pinny()

Initializes the pinny.

```js
$('.pinny').pinny();
```

### pinny(options)

Initialize with options.

```js
$('.pinny').pinny({

});
```

#### Options

##### optionName

default: `false`

When set to `true` will force only one item open at a time.

```js
$('.pinny').pinny({

});
```

### Storing pinny object for future use

```js
var $pinny = $('.pinny');
```

## Browser Compatibility

| Browser           | Version | Support                    |
|-------------------|---------|----------------------------|
| Mobile Safari     | 4.0.x   | Degraded. No transitions.  |
| Mobile Safari     | 5.0+    | Supported.                 |
| Android Browser   | 4.0+    | Supported.                 |
| Android Browser   | 2.3.x   | Degraded. No transitions.  |
| Chrome (Android)  | 1.0+    | Supported.                 |


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
1. `grunt`

The `dist` directory will be populated with minified versions of the css and javascript files for distribution and use with whatever build system you might use. The `src` directory has our raw unminified Sass and Javascript files if you prefer to work with those.

## License

_MIT License. Pinny is Copyright © 2014 Mobify. It is free software and may be redistributed under the terms specified in the LICENSE file._
