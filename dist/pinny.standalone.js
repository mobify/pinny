(function() {/**
 * @license almond 0.3.0 Copyright (c) 2011-2014, The Dojo Foundation All Rights Reserved.
 * Available via the MIT or new BSD license.
 * see: http://github.com/jrburke/almond for details
 */
//Going sloppy to avoid 'use strict' string cost, but strict practices should
//be followed.
/*jslint sloppy: true */
/*global setTimeout: false */

var requirejs, require, define;
(function (undef) {
    var main, req, makeMap, handlers,
        defined = {},
        waiting = {},
        config = {},
        defining = {},
        hasOwn = Object.prototype.hasOwnProperty,
        aps = [].slice,
        jsSuffixRegExp = /\.js$/;

    function hasProp(obj, prop) {
        return hasOwn.call(obj, prop);
    }

    /**
     * Given a relative module name, like ./something, normalize it to
     * a real name that can be mapped to a path.
     * @param {String} name the relative name
     * @param {String} baseName a real name that the name arg is relative
     * to.
     * @returns {String} normalized name
     */
    function normalize(name, baseName) {
        var nameParts, nameSegment, mapValue, foundMap, lastIndex,
            foundI, foundStarMap, starI, i, j, part,
            baseParts = baseName && baseName.split("/"),
            map = config.map,
            starMap = (map && map['*']) || {};

        //Adjust any relative paths.
        if (name && name.charAt(0) === ".") {
            //If have a base name, try to normalize against it,
            //otherwise, assume it is a top-level require that will
            //be relative to baseUrl in the end.
            if (baseName) {
                //Convert baseName to array, and lop off the last part,
                //so that . matches that "directory" and not name of the baseName's
                //module. For instance, baseName of "one/two/three", maps to
                //"one/two/three.js", but we want the directory, "one/two" for
                //this normalization.
                baseParts = baseParts.slice(0, baseParts.length - 1);
                name = name.split('/');
                lastIndex = name.length - 1;

                // Node .js allowance:
                if (config.nodeIdCompat && jsSuffixRegExp.test(name[lastIndex])) {
                    name[lastIndex] = name[lastIndex].replace(jsSuffixRegExp, '');
                }

                name = baseParts.concat(name);

                //start trimDots
                for (i = 0; i < name.length; i += 1) {
                    part = name[i];
                    if (part === ".") {
                        name.splice(i, 1);
                        i -= 1;
                    } else if (part === "..") {
                        if (i === 1 && (name[2] === '..' || name[0] === '..')) {
                            //End of the line. Keep at least one non-dot
                            //path segment at the front so it can be mapped
                            //correctly to disk. Otherwise, there is likely
                            //no path mapping for a path starting with '..'.
                            //This can still fail, but catches the most reasonable
                            //uses of ..
                            break;
                        } else if (i > 0) {
                            name.splice(i - 1, 2);
                            i -= 2;
                        }
                    }
                }
                //end trimDots

                name = name.join("/");
            } else if (name.indexOf('./') === 0) {
                // No baseName, so this is ID is resolved relative
                // to baseUrl, pull off the leading dot.
                name = name.substring(2);
            }
        }

        //Apply map config if available.
        if ((baseParts || starMap) && map) {
            nameParts = name.split('/');

            for (i = nameParts.length; i > 0; i -= 1) {
                nameSegment = nameParts.slice(0, i).join("/");

                if (baseParts) {
                    //Find the longest baseName segment match in the config.
                    //So, do joins on the biggest to smallest lengths of baseParts.
                    for (j = baseParts.length; j > 0; j -= 1) {
                        mapValue = map[baseParts.slice(0, j).join('/')];

                        //baseName segment has  config, find if it has one for
                        //this name.
                        if (mapValue) {
                            mapValue = mapValue[nameSegment];
                            if (mapValue) {
                                //Match, update name to the new value.
                                foundMap = mapValue;
                                foundI = i;
                                break;
                            }
                        }
                    }
                }

                if (foundMap) {
                    break;
                }

                //Check for a star map match, but just hold on to it,
                //if there is a shorter segment match later in a matching
                //config, then favor over this star map.
                if (!foundStarMap && starMap && starMap[nameSegment]) {
                    foundStarMap = starMap[nameSegment];
                    starI = i;
                }
            }

            if (!foundMap && foundStarMap) {
                foundMap = foundStarMap;
                foundI = starI;
            }

            if (foundMap) {
                nameParts.splice(0, foundI, foundMap);
                name = nameParts.join('/');
            }
        }

        return name;
    }

    function makeRequire(relName, forceSync) {
        return function () {
            //A version of a require function that passes a moduleName
            //value for items that may need to
            //look up paths relative to the moduleName
            var args = aps.call(arguments, 0);

            //If first arg is not require('string'), and there is only
            //one arg, it is the array form without a callback. Insert
            //a null so that the following concat is correct.
            if (typeof args[0] !== 'string' && args.length === 1) {
                args.push(null);
            }
            return req.apply(undef, args.concat([relName, forceSync]));
        };
    }

    function makeNormalize(relName) {
        return function (name) {
            return normalize(name, relName);
        };
    }

    function makeLoad(depName) {
        return function (value) {
            defined[depName] = value;
        };
    }

    function callDep(name) {
        if (hasProp(waiting, name)) {
            var args = waiting[name];
            delete waiting[name];
            defining[name] = true;
            main.apply(undef, args);
        }

        if (!hasProp(defined, name) && !hasProp(defining, name)) {
            throw new Error('No ' + name);
        }
        return defined[name];
    }

    //Turns a plugin!resource to [plugin, resource]
    //with the plugin being undefined if the name
    //did not have a plugin prefix.
    function splitPrefix(name) {
        var prefix,
            index = name ? name.indexOf('!') : -1;
        if (index > -1) {
            prefix = name.substring(0, index);
            name = name.substring(index + 1, name.length);
        }
        return [prefix, name];
    }

    /**
     * Makes a name map, normalizing the name, and using a plugin
     * for normalization if necessary. Grabs a ref to plugin
     * too, as an optimization.
     */
    makeMap = function (name, relName) {
        var plugin,
            parts = splitPrefix(name),
            prefix = parts[0];

        name = parts[1];

        if (prefix) {
            prefix = normalize(prefix, relName);
            plugin = callDep(prefix);
        }

        //Normalize according
        if (prefix) {
            if (plugin && plugin.normalize) {
                name = plugin.normalize(name, makeNormalize(relName));
            } else {
                name = normalize(name, relName);
            }
        } else {
            name = normalize(name, relName);
            parts = splitPrefix(name);
            prefix = parts[0];
            name = parts[1];
            if (prefix) {
                plugin = callDep(prefix);
            }
        }

        //Using ridiculous property names for space reasons
        return {
            f: prefix ? prefix + '!' + name : name, //fullName
            n: name,
            pr: prefix,
            p: plugin
        };
    };

    function makeConfig(name) {
        return function () {
            return (config && config.config && config.config[name]) || {};
        };
    }

    handlers = {
        require: function (name) {
            return makeRequire(name);
        },
        exports: function (name) {
            var e = defined[name];
            if (typeof e !== 'undefined') {
                return e;
            } else {
                return (defined[name] = {});
            }
        },
        module: function (name) {
            return {
                id: name,
                uri: '',
                exports: defined[name],
                config: makeConfig(name)
            };
        }
    };

    main = function (name, deps, callback, relName) {
        var cjsModule, depName, ret, map, i,
            args = [],
            callbackType = typeof callback,
            usingExports;

        //Use name if no relName
        relName = relName || name;

        //Call the callback to define the module, if necessary.
        if (callbackType === 'undefined' || callbackType === 'function') {
            //Pull out the defined dependencies and pass the ordered
            //values to the callback.
            //Default to [require, exports, module] if no deps
            deps = !deps.length && callback.length ? ['require', 'exports', 'module'] : deps;
            for (i = 0; i < deps.length; i += 1) {
                map = makeMap(deps[i], relName);
                depName = map.f;

                //Fast path CommonJS standard dependencies.
                if (depName === "require") {
                    args[i] = handlers.require(name);
                } else if (depName === "exports") {
                    //CommonJS module spec 1.1
                    args[i] = handlers.exports(name);
                    usingExports = true;
                } else if (depName === "module") {
                    //CommonJS module spec 1.1
                    cjsModule = args[i] = handlers.module(name);
                } else if (hasProp(defined, depName) ||
                           hasProp(waiting, depName) ||
                           hasProp(defining, depName)) {
                    args[i] = callDep(depName);
                } else if (map.p) {
                    map.p.load(map.n, makeRequire(relName, true), makeLoad(depName), {});
                    args[i] = defined[depName];
                } else {
                    throw new Error(name + ' missing ' + depName);
                }
            }

            ret = callback ? callback.apply(defined[name], args) : undefined;

            if (name) {
                //If setting exports via "module" is in play,
                //favor that over return value and exports. After that,
                //favor a non-undefined return value over exports use.
                if (cjsModule && cjsModule.exports !== undef &&
                        cjsModule.exports !== defined[name]) {
                    defined[name] = cjsModule.exports;
                } else if (ret !== undef || !usingExports) {
                    //Use the return value from the function.
                    defined[name] = ret;
                }
            }
        } else if (name) {
            //May just be an object definition for the module. Only
            //worry about defining if have a module name.
            defined[name] = callback;
        }
    };

    requirejs = require = req = function (deps, callback, relName, forceSync, alt) {
        if (typeof deps === "string") {
            if (handlers[deps]) {
                //callback in this case is really relName
                return handlers[deps](callback);
            }
            //Just return the module wanted. In this scenario, the
            //deps arg is the module name, and second arg (if passed)
            //is just the relName.
            //Normalize module name, if it contains . or ..
            return callDep(makeMap(deps, callback).f);
        } else if (!deps.splice) {
            //deps is a config object, not an array.
            config = deps;
            if (config.deps) {
                req(config.deps, config.callback);
            }
            if (!callback) {
                return;
            }

            if (callback.splice) {
                //callback is an array, which means it is a dependency list.
                //Adjust args if there are dependencies
                deps = callback;
                callback = relName;
                relName = null;
            } else {
                deps = undef;
            }
        }

        //Support require(['a'])
        callback = callback || function () {};

        //If relName is a function, it is an errback handler,
        //so remove it.
        if (typeof relName === 'function') {
            relName = forceSync;
            forceSync = alt;
        }

        //Simulate async callback;
        if (forceSync) {
            main(undef, deps, callback, relName);
        } else {
            //Using a non-zero value because of concern for what old browsers
            //do, and latest browsers "upgrade" to 4 if lower value is used:
            //http://www.whatwg.org/specs/web-apps/current-work/multipage/timers.html#dom-windowtimers-settimeout:
            //If want a value immediately, use require('id') instead -- something
            //that works in almond on the global level, but not guaranteed and
            //unlikely to work in other AMD implementations.
            setTimeout(function () {
                main(undef, deps, callback, relName);
            }, 4);
        }

        return req;
    };

    /**
     * Just drops the config on the floor, but returns req in case
     * the config return value is used.
     */
    req.config = function (cfg) {
        return req(cfg);
    };

    /**
     * Expose module registry for debugging and tooling
     */
    requirejs._defined = defined;

    define = function (name, deps, callback) {

        //This module may not have dependencies
        if (!deps.splice) {
            //deps is not an array, so probably means
            //an object literal or factory function for
            //the value. Adjust args.
            callback = deps;
            deps = [];
        }

        if (!hasProp(defined, name) && !hasProp(waiting, name)) {
            waiting[name] = [name, deps, callback];
        }
    };

    define.amd = {
        jQuery: true
    };
}());

define("node_modules/almond/almond.js", function(){});

define("$", (function (global) {
    return function () {
        var ret, fn;
        return ret || global.$; // what does this mean
    };
}(this)));
define("$", function(){});

(function(factory) {
    /* AMD module. */
    // i think this means velocity depends on jquery/zepto to be loaded first?
    if (typeof define === "function" && define.amd) {
        define('velocity',['$'], factory);
    } else {
        factory(window.jQuery || window.Zepto);
    }
}(function(global) {
	var ret;
	return ret || global.Velocity;
}));
(function(factory) {
    if (typeof define === 'function' && define.amd) {
        define('modal-center',[
            '$',
            'velocity'
        ], factory);
    } else {
        var framework = window.Zepto || window.jQuery;
        factory(framework, framework.Velocity);
    }
}(function($, Velocity) {
    return function() {
        var plugin = this;
        var $window = $(window);
        var coverage = this._coverage(2);

        this.$pinny
            .css({
                width: coverage ? 'auto' : this.options.coverage,
                height: coverage ? 'auto' : this.options.coverage
            });

        return {
            open: function() {
                var size = {};
                var getDimension = function(dimension) {
                    if (!size[dimension]) {
                        size[dimension] = $window[dimension]() - plugin.$pinny[dimension]() / 2;
                    }
                    return size[dimension];
                };
                var height = getDimension('height');
                var width = getDimension('width');

                plugin.$pinny
                    .css({
                        top: coverage ? coverage : height,
                        bottom: coverage ? coverage : height,
                        right: coverage ? coverage : width,
                        left: coverage ? coverage : width
                    });

                Velocity.animate(
                    plugin.$pinny,
                    {
                        scale: [1, 2],
                        opacity: [1, 0]
                    },
                    {
                        easing: plugin.options.easing,
                        duration: plugin.options.duration,
                        display: 'block',
                        complete: plugin.animation.openComplete.bind(plugin)
                    }
                );
            },
            close: function() {
                Velocity.animate(
                    plugin.$pinny,
                    {
                        scale: 0.5,
                        opacity: 0
                    },
                    {
                        begin: plugin.animation.beginClose.bind(plugin),
                        easing: plugin.options.easing,
                        duration: plugin.options.duration,
                        display: 'none',
                        complete: plugin.animation.closeComplete.bind(plugin)
                    }
                );
            }
        };
    };
}));

(function(factory) {
    if (typeof define === 'function' && define.amd) {
        define('sheet-bottom',[
            '$',
            'velocity'
        ], factory);
    } else {
        var framework = window.Zepto || window.jQuery;
        factory(framework, framework.Velocity);
    }
}(function($, Velocity) {
    return function() {
        var plugin = this;
        var coverage = this._coverage();

        this.$pinny
            .css({
                bottom: 0,
                left: 0,
                right: 0,
                top: coverage ? coverage : 'auto',
                height: coverage ? 'auto' : this.options.coverage,
                width: 'auto'
            });

        return {
            open: function() {
                // Force feed the initial value
                Velocity.animate(
                    plugin.$pinny,
                    { translateY: [0, '100%'] },
                    {
                        easing: plugin.options.easing,
                        duration: plugin.options.duration,
                        display: 'block',
                        complete: plugin.animation.openComplete.bind(plugin)
                    }
                );
            },
            close: function() {
                Velocity.animate(
                    plugin.$pinny,
                    'reverse',
                    {
                        begin: plugin.animation.beginClose.bind(plugin),
                        easing: plugin.options.easing,
                        duration: plugin.options.duration,
                        display: 'none',
                        complete: plugin.animation.closeComplete.bind(plugin)
                    }
                );
            }
        };
    };
}));

(function(factory) {
    if (typeof define === 'function' && define.amd) {
        define('sheet-left',[
            '$',
            'velocity'
        ], factory);
    } else {
        var framework = window.Zepto || window.jQuery;
        factory(framework, framework.Velocity);
    }
}(function($, Velocity) {
    return function() {
        var plugin = this;
        var coverage = this._coverage();

        this.$pinny
            .css({
                top: 0,
                bottom: 0,
                left: 0,
                right: coverage ? coverage : 'auto',
                width: coverage ? 'auto' : this.options.coverage,
                height: 'auto'
            });

        return {
            open: function() {


                // Force feed the initial value
                Velocity.animate(
                    plugin.$pinny,
                    { translateX: [0, '-100%'] },
                    {
                        easing: plugin.options.easing,
                        duration: plugin.options.duration,
                        display: 'block',
                        complete: plugin.animation.openComplete.bind(plugin)
                    }
                );
            },
            close: function() {
                Velocity.animate(
                    plugin.$pinny,
                    'reverse',
                    {
                        begin: plugin.animation.beginClose.bind(plugin),
                        easing: plugin.options.easing,
                        duration: plugin.options.duration,
                        display: 'none',
                        complete: plugin.animation.closeComplete.bind(plugin)
                    }
                );
            }
        };
    };

}));

(function(factory) {
    if (typeof define === 'function' && define.amd) {
        define('sheet-right',[
            '$',
            'velocity'
        ], factory);
    } else {
        var framework = window.Zepto || window.jQuery;
        factory(framework, framework.Velocity);
    }
}(function($, Velocity) {
    return function() {
        var plugin = this;
        var coverage = this._coverage();

        this.$pinny
            .css({
                top: 0,
                bottom: 0,
                right: 0,
                left: coverage ? coverage : 'auto',
                width: coverage ? 'auto' : this.options.coverage,
                height: 'auto'
            });

        return {
            open: function() {


                // Force feed the initial value
                Velocity.animate(
                    plugin.$pinny,
                    { translateX: [0, '100%'] },
                    {
                        easing: plugin.options.easing,
                        duration: plugin.options.duration,
                        display: 'block',
                        complete: plugin.animation.openComplete.bind(plugin)
                    }
                );
            },
            close: function() {
                Velocity.animate(
                    plugin.$pinny,
                    'reverse',
                    {
                        begin: plugin.animation.beginClose.bind(plugin),
                        easing: plugin.options.easing,
                        duration: plugin.options.duration,
                        display: 'none',
                        complete: plugin.animation.closeComplete.bind(plugin)
                    }
                );
            }
        };
    };

}));

(function(factory) {
    if (typeof define === 'function' && define.amd) {
        define('sheet-top',[
            '$',
            'velocity'
        ], factory);
    } else {
        var framework = window.Zepto || window.jQuery;
        factory(framework, framework.Velocity);
    }
}(function($, Velocity) {
    return function() {
        var plugin = this;
        var coverage = this._coverage();

        this.$pinny
            .css({
                top: 0,
                left: 0,
                right: 0,
                bottom: coverage ? coverage : 'auto',
                height: coverage ? 'auto' : this.options.coverage,
                width: 'auto'
            });

        return {
            open: function() {
                // Force feed the initial value
                Velocity.animate(
                    plugin.$pinny,
                    { translateY: [0, '-100%'] },
                    {
                        easing: plugin.options.easing,
                        duration: plugin.options.duration,
                        display: 'block',
                        complete: plugin.animation.openComplete.bind(plugin)
                    }
                );
            },
            close: function() {
                Velocity.animate(
                    plugin.$pinny,
                    'reverse',
                    {
                        begin: plugin.animation.beginClose.bind(plugin),
                        easing: plugin.options.easing,
                        duration: plugin.options.duration,
                        display: 'none',
                        complete: plugin.animation.closeComplete.bind(plugin)
                    }
                );
            }
        };
    };

}));

(function (factory) {
    if (typeof define === 'function' && define.amd) {
        define('plugin',[
            '$'
        ], factory);
    } else {
        var framework = window.Zepto || window.jQuery;
        window.Plugin = factory(framework);
    }
}(function($) {
    function Plugin(element, options, defaultOptions) {
        this.options = $.extend(true, {}, defaultOptions, options);

        if (typeof this._init !== 'function') {
            throw this.name + ' needs an _init method';
        }

        this._init(element);
    }

    Plugin.prototype._trigger = function(eventName, data) {
        eventName in this.options && this.options[eventName].call(this, $.Event(this.name + ':' + eventName, { bubbles: false }), data);
    };

    Plugin.create = function(name, SubConstructor, prototype) {
        SubConstructor.__super__ = Plugin;
        for (var key in Plugin.prototype)  {
            if (!SubConstructor.prototype[key]) {
                SubConstructor.prototype[key] = Plugin.prototype[key];
            }
        }
        SubConstructor.prototype = $.extend(true, SubConstructor.prototype, prototype);
        SubConstructor.prototype.constructor = SubConstructor;
        SubConstructor.prototype.name = name;

        $.fn[name] = function(option) {
            var args = Array.prototype.slice.call(arguments);

            return this.each(function() {
                var $this = $(this);
                var plugin = $this.data(name);
                var isMethodCall = typeof option === 'string';

                // If plugin isn't initialized, we lazy-load initialize it. If it's
                // already initialized, we can safely ignore the call.
                if (!plugin) {
                    if (isMethodCall) {
                        throw 'cannot call methods on "' + name + '" prior to initialization; attempted to call method "' + option + '"';
                    }
                    $this.data(name, (plugin = new SubConstructor(this, option)));
                }

                // invoke a public method on plugin, and skip private methods
                if (isMethodCall) {
                    if (option.charAt(0) === '_' || typeof plugin[option] !== 'function') {
                        throw 'no such method "' + option + '" for "' + name + '"';
                    }

                    plugin[option].apply(plugin, args.length > 1 ? args.slice(1) : null);
                }
            });
        };

        $.fn[name].Constructor = SubConstructor;
    };

    $.extend($, {
        noop: function() {},
        uniqueId: function() {
            return +new Date();
        }
    });

    return Plugin;
}));

/*!
 * v0.3.0
 * Copyright (c) 2014 Jarid Margolin
 * bouncefix.js is open sourced under the MIT license.
 */ 

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define('bouncefix',[], function () {
      return (root.returnExportsGlobal = factory());
    });
  } else if (typeof exports === 'object') {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like enviroments that support module.exports,
    // like Node.
    module.exports = factory();
  } else {
    root['bouncefix'] = factory();
  }
}(this, function () {


/*
 * dom-event.js
 * 
 * (C) 2014 Jarid Margolin
 * MIT LICENCE
 *
 */
var domEvent;
domEvent = function () {
  // ----------------------------------------------------------------------------
  // DOMEvent
  //
  // Convenient class used to work with addEventListener.
  // ----------------------------------------------------------------------------
  function DOMEvent(el, eventName, handler, context) {
    // Make args available to instance
    this.el = el;
    this.eventName = eventName;
    this.handler = handler;
    this.context = context;
    // Attach
    this.add();
  }
  //
  // Handler that manages context, and normalizes both 
  // preventDefault and stopPropagation.
  //
  DOMEvent.prototype._handler = function (e, context) {
    // Copy props to new evt object. This is shallow.
    // Only done so that I can modify stopPropagation
    // and preventDefault.
    var evt = {};
    for (var k in e) {
      evt[k] = e[k];
    }
    // Normalize stopPropagation
    evt.stopPropagation = function () {
      if (e.stopPropagation) {
        e.stopPropagation();
      } else {
        e.cancelBubble = true;
      }
    };
    // Normalize preventDefault
    evt.preventDefault = function () {
      if (e.preventDefault) {
        e.preventDefault();
      } else {
        e.returnValue = false;
      }
    };
    // Call with context and modified evt.
    this.handler.call(this.context || context, evt);
  };
  //
  // Add the `EventListener`. This method is called internally in
  // the constructor. It can also be used to re-attach a listener
  // that was previously removed.
  //
  DOMEvent.prototype.add = function () {
    // Cache this
    var self = this;
    // Cache handler so it can be removed.
    self.cachedHandler = function (e) {
      self._handler.call(self, e, this);
    };
    // Modified handler
    self.el.addEventListener(self.eventName, self.cachedHandler, false);
  };
  //
  // Remove the `EventListener`
  //
  DOMEvent.prototype.remove = function () {
    this.el.removeEventListener(this.eventName, this.cachedHandler);
  };
  // ----------------------------------------------------------------------------
  // Expose
  // ----------------------------------------------------------------------------
  return DOMEvent;
}();
/*
 * utils.js
 * 
 * (C) 2014 Jarid Margolin
 * MIT LICENCE
 *
 */
var utils;
utils = function () {
  // ----------------------------------------------------------------------------
  // Utils
  // ----------------------------------------------------------------------------
  var utils = {};
  //
  // Search nodes to find target el. Return if exists
  //
  utils.getTargetedEl = function (el, className) {
    while (true) {
      // We found it, exit
      if (el.classList.contains(className)) {
        break;
      }
      // Else keep climbing up tree
      if (el = el.parentElement) {
        continue;
      }
      // Not found
      break;
    }
    return el;
  };
  //
  // Return true or false depending on if content
  // is scrollable
  //
  utils.isScrollable = function (el) {
    return el.scrollHeight > el.offsetHeight;
  };
  //
  // Keep scrool from hitting end bounds
  //
  utils.scrollToEnd = function (el) {
    var curPos = el.scrollTop, height = el.offsetHeight, scroll = el.scrollHeight;
    // If at top, bump down 1px
    if (curPos <= 0) {
      el.scrollTop = 1;
    }
    // If at bottom, bump up 1px
    if (curPos + height >= scroll) {
      el.scrollTop = scroll - height - 1;
    }
  };
  // ----------------------------------------------------------------------------
  // Expose
  // ----------------------------------------------------------------------------
  return utils;
}();
/*
 * fix.js
 * 
 * (C) 2014 Jarid Margolin
 * MIT LICENCE
 *
 */
var fix;
fix = function (DOMEvent, utils) {
  // ----------------------------------------------------------------------------
  // Fix
  //
  // Class Constructor - Called with new BounceFix(el)
  // Responsible for setting up required instance
  // variables, and listeners.
  // ----------------------------------------------------------------------------
  var Fix = function (className) {
    // Make sure it is created correctly
    if (!(this instanceof Fix)) {
      return new Fix(className);
    }
    // Without className there is nothing to fix
    if (!className) {
      throw new Error('"className" argument is required');
    }
    // Add className to instance
    this.className = className;
    // On touchstart check for block. On end, cleanup
    this.startListener = new DOMEvent(document, 'touchstart', this.touchStart, this);
    this.endListener = new DOMEvent(document, 'touchend', this.touchEnd, this);
  };
  //
  // touchstart handler
  //
  Fix.prototype.touchStart = function (evt) {
    // Get target
    var el = utils.getTargetedEl(evt.target, this.className);
    // If el scrollable
    if (el && utils.isScrollable(el)) {
      return utils.scrollToEnd(el);
    }
    // Else block touchmove
    if (el && !this.moveListener) {
      this.moveListener = new DOMEvent(el, 'touchmove', this.touchMove, this);
    }
  };
  //
  // If this event is called, we block scrolling
  // by preventing default behavior.
  //
  Fix.prototype.touchMove = function (evt) {
    evt.preventDefault();
  };
  //
  // On touchend we need to remove and listeners
  // we may have added.
  //
  Fix.prototype.touchEnd = function (evt) {
    if (this.moveListener) {
      this.moveListener.remove();
      delete this.moveListener;
    }
  };
  //
  // touchend handler
  //
  Fix.prototype.remove = function () {
    this.startListener.remove();
    this.endListener.remove();
  };
  // ----------------------------------------------------------------------------
  // Expose
  // ----------------------------------------------------------------------------
  return Fix;
}(domEvent, utils);
/*
 * bouncefix.js
 * 
 * (C) 2014 Jarid Margolin
 * MIT LICENCE
 *
 */
var bouncefix;
bouncefix = function (Fix) {
  // ----------------------------------------------------------------------------
  // Bouncefix
  //
  // Stop full body elastic scroll bounce when scrolling inside
  // nested containers (IOS)
  // ----------------------------------------------------------------------------
  var bouncefix = { cache: {} };
  //
  // Add/Create new instance
  //
  bouncefix.add = function (className) {
    if (!this.cache[className]) {
      this.cache[className] = new Fix(className);
    }
  };
  //
  // Delete/Remove instance
  //
  bouncefix.remove = function (className) {
    if (this.cache[className]) {
      this.cache[className].remove();
      delete this.cache[className];
    }
  };
  // ----------------------------------------------------------------------------
  // Expose
  // ----------------------------------------------------------------------------
  return bouncefix;
}(fix);


return bouncefix;



}));
/**
 * Device OS and Browser detection
 *
 * Based on:
 *
 * Zepto detect.js
 * https://github.com/madrobby/zepto/blob/master/src/detect.js
 * (c) 2010-2014 Thomas Fuchs
 */
(function(factory) {
    if (typeof define === 'function' && define.amd) {
        define('deckard',[
            '$'
        ], factory);
    } else {
        var framework = window.Zepto || window.jQuery;
        factory(framework);
    }
}(function($) {
    var _parseVersion = function(version) {
        if (!version) return {};

        var parts = version.split('.');

        return {
            version: version,
            major: parseInt(parts[0] || 0),
            minor: parseInt(parts[1] || 0),
            patch: parseInt(parts[2] || 0)
        };
    };

    var ua = window.navigator.userAgent;
    var device;
    var currentOrientation;
    var $window = $(window);
    var $html = $('html');
    var orientationEvent = 'onorientationchange' in window ? 'orientationchange' : 'resize';
    // This ratio is less than 1 because it accommodates when keyboards are activated.
    var compareRatio = 0.8;

    /*jshint maxstatements:120 */
    var detect = function(ua) {
        var browserVersion;
        var osVersion;
        var os = {};
        var browser = {};
        var cssClasses = [];

        var webkit = ua.match(/Web[kK]it[\/]{0,1}([\d.]+)/);
        var android = ua.match(/(Android);?[\s\/]+([\d.]+)?/);
        var osx = !!ua.match(/\(Macintosh\; Intel /);
        var ipad = ua.match(/(iPad).*OS\s([\d_]+)/);
        var ipod = ua.match(/(iPod)(.*OS\s([\d_]+))?/);
        var iphone = !ipad && ua.match(/(iPhone\sOS)\s([\d_]+)/);
        var windowsphone = ua.match(/Windows Phone ([\d.]+)/);
        var kindle = ua.match(/Kindle\/([\d.]+)/);
        var silk = ua.match(/Silk\/([\d._]+)/);
        var blackberry = ua.match(/(BlackBerry).*Version\/([\d.]+)/);
        var bb10 = ua.match(/(BB10).*Version\/([\d.]+)/);
        var rimtabletos = ua.match(/(RIM\sTablet\sOS)\s([\d.]+)/);
        var playbook = ua.match(/PlayBook/);
        var chrome = ua.match(/Chrome\/([\d.]+)/) || ua.match(/CriOS\/([\d.]+)/);
        var firefox = ua.match(/Firefox\/([\d.]+)/);
        var ie = ua.match(/MSIE\s([\d.]+)/) || ua.match(/Trident\/[\d](?=[^\?]+).*rv:([0-9.].)/);
        var webview = !chrome && ua.match(/(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/);
        var safari = webview || ua.match(/Version\/([\d.]+)([^S](Safari)|[^M]*(Mobile)[^S]*(Safari))/);

        browser.webkit = !!webkit;

        if (browser.webkit) {
            browserVersion = webkit[1];
            cssClasses.push('webkit');
        }

        if (android) {
            os.android = true;
            osVersion = android[2];
            cssClasses.push('android');
        }
        if (iphone && !ipod) {
            os.ios = os.iphone = true;
            osVersion = iphone[2].replace(/_/g, '.');
            cssClasses.push('ios', 'iphone');
        }
        if (ipad) {
            os.ios = os.ipad = true;
            osVersion = ipad[2].replace(/_/g, '.');
            cssClasses.push('ios', 'ipad');
        }
        if (ipod) {
            os.ios = os.ipod = true;
            osVersion = ipod[3] ? ipod[3].replace(/_/g, '.') : null;
            cssClasses.push('ios', 'ipod');
        }
        if (windowsphone) {
            os.windowsphone = true;
            osVersion = windowsphone[1];
            cssClasses.push('windows');
        }
        if (blackberry) {
            os.blackberry = true;
            osVersion = blackberry[2];
            cssClasses.push('blackberry');
        }
        if (bb10) {
            os.bb10 = true;
            osVersion = bb10[2];
            cssClasses.push('blackberry', 'bb10');
        }
        if (rimtabletos) {
            os.rimtabletos = true;
            osVersion = rimtabletos[2];
            cssClasses.push('blackberry');
        }
        if (playbook) {
            browser.playbook = true;
            cssClasses.push('playbook');
        }
        if (kindle) {
            os.kindle = true;
            osVersion = kindle[1];
            cssClasses.push('kindle');
        }
        if (silk) {
            browser.silk = true;
            browserVersion = silk[1];
            cssClasses.push('silk');
        }
        if (!silk && os.android && ua.match(/Kindle Fire/)) {
            browser.silk = true;
            cssClasses.push('silk');
        }
        if (chrome) {
            browser.chrome = true;
            browserVersion = chrome[1];
            cssClasses.push('chrome');
        }
        if (firefox) {
            browser.firefox = true;
            browserVersion = firefox[1];
            cssClasses.push('firefox');
        }
        if (ie) {
            browser.ie = true;
            browserVersion = ie[1];
            cssClasses.push('ie');
        }
        if (safari && (osx || os.ios)) {
            browser.safari = true;
            cssClasses.push('safari');
            if (osx) {
                browserVersion = safari[1];
            }
        }

        if (webview) {
            browser.webview = true;
            cssClasses.push('webview');
        }

        os = $.extend(true, os, _parseVersion(osVersion));
        browser = $.extend(true, browser, _parseVersion(browserVersion));

        // Determines if this browser is the Android browser vs. chrome. It's always the
        // Android browser if it's webkit and the version is less than 537
        if (os.android && !browser.chrome && browser.webkit && browser.major < 537) {
            browser.androidBrowser = true;
            cssClasses.push('android-browser');
        }

        os.tablet = !!(ipad || playbook || kindle || (android && !ua.match(/Mobile/)) ||
        (firefox && ua.match(/Tablet/)) || (ie && !ua.match(/Phone/) && ua.match(/Touch/)));

        os.mobile = !!(!os.tablet && !os.ipod && (android || iphone || blackberry || bb10 ||
        (chrome && ua.match(/Android/)) || (chrome && ua.match(/CriOS\/([\d.]+)/)) ||
        (firefox && ua.match(/Mobile/)) || (ie && ua.match(/Touch/))));

        // http://stackoverflow.com/questions/19689715/what-is-the-best-way-to-detect-retina-support-on-a-device-using-javascript
        os.retina = ((window.matchMedia && (window.matchMedia('only screen and (min-resolution: 192dpi), only screen and (min-resolution: 2dppx), only screen and (min-resolution: 75.6dpcm)').matches || window.matchMedia('only screen and (-webkit-min-device-pixel-ratio: 2), only screen and (-o-min-device-pixel-ratio: 2/1), only screen and (min--moz-device-pixel-ratio: 2), only screen and (min-device-pixel-ratio: 2)').matches)) || (window.devicePixelRatio && window.devicePixelRatio > 2)) && os.ios;
        os.retina && cssClasses.push('retina');

        cssClasses.push(os.tablet ? 'tablet' : (os.mobile ? 'mobile' : 'desktop'));

        return {
            os: os,
            browser: browser,
            classes: cssClasses
        };
    };

    var orientation = function() {
        var isLandscape = ($window.height() / $window.width()) < compareRatio;

        return {
            orientation: {
                landscape: isLandscape,
                portrait: !isLandscape
            }
        };
    };

    var addClasses = function(device, orientation) {
        device.classes.push(orientation.landscape ? 'landscape' : 'portrait');
        $html.addClass(device.classes.join(' '));
    };

    $window
        .on(orientationEvent, function() {
            $.extend($, orientation());
            $html.toggleClass('portrait landscape');
        });

    device = detect(ua);
    currentOrientation = orientation();

    addClasses(device, currentOrientation.orientation);

    // bind os, browser, and orientation to $ as top-level properties
    $.extend($, { os: device.os, browser: device.browser }, currentOrientation);

    // expose for unit testing
    $.__deckard = {
        detect: detect,
        orientation: orientation,
        addClasses: addClasses
    };

    return $;
}));

(function(factory) {
    if (typeof define === 'function' && define.amd) {
        define('lockup',[
            '$',
            'plugin',
            'deckard'
        ], factory);
    } else {
        var framework = window.Zepto || window.jQuery;
        factory(framework, window.Plugin);
    }
}(function($, Plugin) {
    $.extend($.fn, {
        renameAttr: function(oldName, newName) {
            return this.each(function() {
                var $el = $(this);
                $el
                    .attr(newName, $el.attr(oldName))
                    .removeAttr(oldName);
            });
        }
    });

    var classes = {
        CONTAINER: 'lockup__container',
        LOCKED: 'lockup--is-locked'
    };

    function Lockup(element, options) {
        Lockup.__super__.call(this, element, options, Lockup.DEFAULTS);
    }

    Lockup.VERSION = '1.0.0';

    Lockup.DEFAULTS = {
        container: null,
        locked: $.noop,
        unlocked: $.noop
    };

    Plugin.create('lockup', Lockup, {
        _init: function(element) {
            this.$element = $(element);
            this.$html = $('html');
            this.$body = $('body');
            this.$doc = $(document);

            this.$container = this._buildContainer();
        },

        /**
         * The body content needs to be wrapped in a containing
         * element in order to facilitate scroll blocking. One can
         * either be supplied in the options, or we'll create one
         * automatically, and append all body content to it.
         */
        _buildContainer: function() {
            // Check if there's a lockup container already created. If there is,
            // we don't want to create another. There can be only one!
            var $container = $('.' + classes.CONTAINER);

            if (!$container.length) {
                $container = this.options.container ?
                    $(this.options.container).addClass(classes.CONTAINER) :
                    this._createContainer();
            }

            return $container;
        },

        _createContainer: function() {
            // scripts must be disabled to avoid re-executing them
            var $scripts = this.$body.find('script')
                .renameAttr('src', 'x-src')
                .attr('type', 'text/lockup-script');

            this.$body.wrapInner($('<div />').addClass(classes.CONTAINER));

            $scripts.renameAttr('x-src', 'src').attr('type', 'text/javascript');

            return this.$body.find('.' + classes.CONTAINER);
        },

        /**
         * This function contains several methods for fixing scrolling issues
         * across different browsers. See each if statement for an in depth
         * explanation.
         */
        lock: function() {
            var self = this;

            var getPadding = function(position) {
                return parseInt(self.$body.css('padding-' + position));
            };

            this.scrollPosition = this.$body.scrollTop();

            this.$doc.off('touchmove', this._preventDefault);

            this.$container.addClass(classes.LOCKED);

            /**
             * On Chrome, we can get away with fixing the position of the html
             * and moving it up to the equivalent of the scroll position
             * to lock scrolling.
             */
            if ($.browser.chrome) {
                this.$html.css('position', 'fixed');
                this.$html.css('top', this.scrollPosition * -1);

                this._trigger('locked');
            }
            /**
             * On iOS8, we lock the height of the element's body wrapping div as well
             * as do some scrolling magic to make sure forms don't jump the page
             * around when they're focused.
             */
            else if ($.os.ios && $.os.major >= 8) {
                this.$body
                    .css('margin-top', 0)
                    .css('margin-bottom', 0);

                this.$container
                    .height(window.innerHeight)
                    .css('overflow', 'hidden')
                    .scrollTop(this.scrollPosition - getPadding('top') - getPadding('bottom'));

                this._trigger('locked');
            }
            /**
             * On iOS7 and under, the browser can't handle what we're doing
             * above so we need to do the less sexy version. Wait for the
             * focus to trigger and then jump scroll back to the initial
             * position. Looks like crap but it works.
             */
            else if ($.os.ios && $.os.major <= 7) {
                this.$element.find('input, select, textarea')
                    .on('focus', function() {
                        setTimeout(function() {
                            window.scrollTo(0, self.scrollPosition);

                            self._trigger('locked');
                        }, 0);
                    });
            }
        },

        /**
         * Undo all the things above
         */
        unlock: function() {
            this.$doc.on('touchmove', this._preventDefault);

            this.$container.removeClass(classes.LOCKED);

            if ($.browser.chrome) {
                this.$html.css('position', '');
                this.$html.css('top', '');
                window.scrollTo(0, this.scrollPosition);
            } else if ($.os.ios && $.os.major >= 8) {
                this.$body
                    .css('margin', '');

                this.$container
                    .css('overflow', '')
                    .css('height', '');

                window.scrollTo(0, this.scrollPosition);
            } else if ($.os.ios && $.os.major <= 7) {
                this.$element.find('input, select, textarea').off('focus');
            }

            this._trigger('unlocked');

            this.$doc.off('touchmove', this._preventDefault);
        },

        isLocked: function() {
            return this.$container.hasClass(classes.LOCKED);
        },

        _preventDefault: function(e) {
            e.preventDefault();
        }
    });

    return $;
}));

(function(factory) {
    if (typeof define === 'function' && define.amd) {
        define('shade',[
            '$',
            'plugin',
            'velocity'
        ], factory);
    } else {
        var framework = window.Zepto || window.jQuery;
        factory(framework, window.Plugin, framework.Velocity);
    }
}(function($, Plugin, Velocity) {
    function Shade(element, options) {
        Shade.__super__.call(this, element, options, Shade.DEFAULTS);
    }

    Shade.VERSION = '1.0.5';

    Shade.DEFAULTS = {
        cover: document.body,
        color: 'black',
        opacity: '0.25',
        duration: 150,
        easing: 'swing',
        padding: 0,
        zIndex: 1,
        click: function() {
            this.close();
        },
        open: $.noop,
        opened: $.noop,
        close: $.noop,
        closed: $.noop
    };

    Plugin.create('shade', Shade, {
        _init: function(element) {
            var plugin = this;

            this.$element = $(element);

            this.isBody = $(this.options.cover).is('body');

            this.$shade = $('<div />')
                .addClass('shade')
                .css({
                    background: this.options.color ? this.options.color : '',
                    opacity: 0
                })
                .hide()
                .on('click', function() {
                    plugin.options.click && plugin.options.click.call(plugin);
                })
                .insertAfter(this.$element);

            $(window)
                .on('resize:shade', function() {
                    plugin.$shade.hasClass('shade--is-open') && plugin.setPosition.call(plugin);
                });
        },

        open: function() {
            var plugin = this;

            this._trigger('open');

            this.setPosition();

            Velocity.animate(
                this.$shade,
                {
                    opacity: this.options.opacity
                },
                {
                    display: 'block',
                    duration: this.options.duration,
                    easing: this.options.easing,
                    complete: function() {
                        plugin.$shade
                            .addClass('shade--is-open')
                            .on('touchmove', function() {
                                return false;
                            });

                        plugin._trigger('opened');
                    }
                }
            );
        },

        close: function() {
            var plugin = this;

            this._trigger('close');

            Velocity.animate(
                this.$shade,
                'reverse',
                {
                    display: 'none',
                    duration: this.options.duration,
                    easing: this.options.easing,
                    complete: function() {
                        plugin.$shade
                            .removeClass('shade--is-open')
                            .off('touchmove');

                        plugin._trigger('closed');
                    }
                }
            );
        },

        setPosition: function() {
            var $element = this.$element;
            var width = this.isBody ? 'auto' : $element.width();
            var height = this.isBody ? 'auto' : $element.height();
            var position = this.isBody ? 'fixed' : 'absolute';

            this.$shade
                .css({
                    left: this.options.padding ? -this.options.padding : 0,
                    top: this.options.padding ? -this.options.padding : 0,
                    bottom: this.options.padding ? -this.options.padding : 0,
                    right: this.options.padding ? -this.options.padding : 0,
                    width: this.options.padding ? width - this.options.padding : width,
                    height: this.options.padding ? height - this.options.padding : height,
                    position: position,
                    padding: this.options.padding,
                    zIndex: this.options.zIndex || $element.css('zIndex') + 1
                });
        }
    });

    return $;
}));


(function(factory) {
    if (typeof define === 'function' && define.amd) {
        define('pinny',[
            '$',
            'plugin',
            'bouncefix',
            'lockup',
            'shade'
        ], factory);
    } else {
        var framework = window.Zepto || window.jQuery;
        factory(framework, window.Plugin, window.bouncefix);
    }
}(function($, Plugin, bouncefix) {
    var EFFECT_REQUIRED = 'Pinny requires a declared effect to operate. For more information read: https://github.com/mobify/pinny#initializing-the-plugin';
    var FOCUSABLE_ELEMENTS = 'a[href], area[href], input, select, textarea, button, iframe, object, embed, [tabindex], [contenteditable]';

    /**
     * Function.prototype.bind polyfill required for < iOS6
     */
    /* jshint ignore:start */
    if (!Function.prototype.bind) {
        Function.prototype.bind = function(scope) {
            var fn = this;
            return function() {
                return fn.apply(scope);
            };
        };
    }
    /* jshint ignore:end */

    var classes = {
        PINNY: 'pinny',
        WRAPPER: 'pinny__wrapper',
        TITLE: 'pinny__title',
        CLOSE: 'pinny__close',
        CONTENT: 'pinny__content',
        OPENED: 'pinny--is-open',
        SCROLLABLE: 'pinny--is-scrollable'
    };

    /**
     * Template constants required for building the default HTML structure
     */
    var template = {
        COMPONENT: '<{0} class="' + classes.PINNY + '__{0}">{1}</{0}>',
        HEADER: '<h1 class="' + classes.TITLE + '">{0}</h1><button class="' + classes.CLOSE + '">Close</button>',
        FOOTER: '{0}'
    };

    function Pinny(element, options) {
        Pinny.__super__.call(this, element, options, Pinny.DEFAULTS);
    }

    Pinny.VERSION = '0';

    Pinny.DEFAULTS = {
        effect: null,
        container: null,
        appendTo: null,
        structure: {
            header: '',
            footer: false
        },
        zIndex: 2,
        cssClass: '',
        coverage: '100%',
        easing: 'swing',
        duration: 200,
        shade: {},
        open: $.noop,
        opened: $.noop,
        close: $.noop,
        closed: $.noop
    };

    Plugin.create('pinny', Pinny, {
        /**
         * Common animation callbacks used in the effect objects
         */
        animation: {
            beginClose: function() {

            },
            openComplete: function() {
                this._trigger('opened');

                this._focus();
            },
            closeComplete: function() {
                this._trigger('closed');

                this._resetFocus();
            }
        },

        _init: function(element) {
            this.id = 'pinny-' + $.uniqueId();

            this.$element = $(element);
            this.$doc = $(document);
            this.$body = $('body');

            this._build();

            if (!this.options.effect) {
                throw EFFECT_REQUIRED;
            }

            this.effect = this.options.effect.call(this);

            this.$element.removeAttr('hidden');

            this._bindEvents();
        },

        toggle: function() {
            this[this.$pinny.hasClass(classes.OPENED) ? 'close' : 'open']();
        },

        open: function() {
            if (this._isOpen()) {
                return;
            }

            this._trigger('open');

            bouncefix.add(classes.SCROLLABLE);

            this.effect.open.call(this);

            this.options.shade && this.$shade.shade('open');

            this.$pinny.addClass(classes.OPENED);

            this.$pinny.lockup('lock');
        },

        close: function() {
            if (!this._isOpen()) {
                return;
            }

            this._trigger('close');

            bouncefix.remove(classes.SCROLLABLE);

            this.$pinny.removeClass(classes.OPENED);

            this.options.shade && this.$shade.shade('close');

            this.effect.close.call(this);

            this.$pinny.lockup('unlock');
        },

        _isOpen: function() {
            return this.$pinny.hasClass(classes.OPENED);
        },

        _bindEvents: function() {
            // Block scrolling on anything but pinny content
            this.$pinny.on('touchmove', function(e) {
                if (!$(e.target).parents().hasClass(classes.CONTENT)) {
                    e.preventDefault();
                }
            });
        },

        /**
         Builds Pinny using the following structure:

         <section class="pinny">
             <div class="pinny__wrapper">
                 <header class="pinny__header">{header content}</header>
                 <div class="pinny__content">
                 {content}
                 </div>
                 <footer class="pinny__footer">{footer content}</footer>
             </div>
         </section>
         */
        _build: function() {
            var plugin = this;

            this.$pinny = $('<section />')
                .addClass(classes.PINNY)
                .addClass(this.options.cssClass)
                .css({
                    position: 'fixed',
                    zIndex: this.options.zIndex,
                    width: this.options.coverage,
                    height: this.options.coverage
                })
                .on('click', '.' + classes.CLOSE, function(e) {
                    e.preventDefault();
                    plugin.close();
                })
                .lockup({
                    container: this.options.container
                });

            this.$container = this.$pinny.data('lockup').$container;

            this.$pinny.appendTo(this.options.appendTo ? $(this.options.appendTo) : this.$container);

            if (this.options.structure) {
                var $wrapper = $('<div />')
                    .addClass(classes.WRAPPER)
                    .appendTo(this.$pinny);

                this._buildComponent('header').appendTo($wrapper);

                $('<div />')
                    .addClass(classes.CONTENT)
                    .addClass(classes.SCROLLABLE)
                    .append(this.$element)
                    .appendTo($wrapper);

                this._buildComponent('footer').appendTo($wrapper);
            } else {
                this.$element.appendTo(this.$pinny);
            }

            this._addAccessibility();

            if (this.options.shade) {
                this.$shade = this.$pinny.shade($.extend(true, {}, {
                    click: function() {
                        plugin.close();
                    }
                }, $.extend(
                    this.options.shade,
                    {
                        duration: this.options.duration
                    }
                )));
            }
        },

        _buildComponent: function(name) {
            var component = this.options.structure[name];
            var $element = $([]);

            if (component !== false) {
                var html = this._isHtml(component) ? component : template[name.toUpperCase()].replace('{0}', component);

                $element = $(template.COMPONENT.replace(/\{0\}/g, name).replace(/\{1\}/g, html));
            }

            return $element;
        },

        _isHtml: function(input) {
            return /<[a-z][\s\S]*>/i.test(input);
        },

        /**
         * Takes the coverage option and turns it into a effect value
         */
        _coverage: function(divisor) {
            var coverage;
            var percent = this.options.coverage.match(/(\d*)%$/);

            if (percent) {
                coverage = 100 - parseInt(percent[1]);

                if (divisor) {
                    coverage = coverage / divisor;
                }
            }

            return percent ? coverage + '%' : this.options.coverage;
        },

        /**
         * Accessibility Considerations
         */
        _addAccessibility: function() {
            var headerID = this.id + '__header';
            var $header = this.$pinny.find('h1, .' + classes.TITLE).first();
            var $wrapper = this.$pinny.find('.' + classes.WRAPPER);

            this.$container
                .attr('aria-hidden', 'false');

            this.$pinny
                .attr('role', 'dialog')
                .attr('aria-labelledby', headerID)
                .attr('aria-hidden', 'true')
                .attr('tabindex', '-1');

            $wrapper
                .attr('role', 'document');

            $header
                .attr('id', headerID);
        },

        _focus: function() {
            this.originalActiveElement = document.activeElement;

            this._disableInputs();

            this.$pinny.attr('aria-hidden', 'false');

            this.$pinny.children().first().focus();

            this.$container.attr('aria-hidden', 'true');
        },

        _resetFocus: function() {
            this._enableInputs();

            this.$container.attr('aria-hidden', 'false');

            this.$pinny.attr('aria-hidden', 'true');

            this.originalActiveElement.focus();
        },

        /**
         * Trap any tabbing within the visible Pinny window
         */
        _disableInputs: function() {
            var $focusableElements = $(FOCUSABLE_ELEMENTS).not(function() {
                return $(this).closest('.pinny').length;
            });

            $focusableElements.each(function(_, el) {
                var $el = $(el);
                var currentTabIndex = $el.attr('tabindex') || 0;

                $el
                    .data('tabindex', currentTabIndex)
                    .attr('tabindex', '-1');
            });
        },

        _enableInputs: function() {
            var $disabledInputs = $('[data-pinny-tabindex]');

            $disabledInputs.each(function(_, el) {
                var $el = $(el);
                var oldTabIndex = $el.data('tabindex');

                if (oldTabIndex) {
                    $el.attr('tabindex', oldTabIndex);
                } else {
                    $el.removeAttr('tabindex');
                }

                $el.removeData('tabindex');
            });
        }
    });

    $('[data-pinny]').each(function() {
        var $pinny = $(this);
        var effect = $(this).data('pinny');

        if (!effect.length) {
            throw EFFECT_REQUIRED;
        }

        $pinny.pinny({
            effect: effect
        });
    });

    return $;
}));

(function(factory) {
    if (typeof define === 'function' && define.amd) {
        define('effects',[
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

require(["effects"], null, undefined, true)})();