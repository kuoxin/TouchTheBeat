/*
 This module extends the Backbone Framework by multiple features needed in TouchTheBeat
 */
//TODO: change name and usage to more represent a framework than a framework extension

define(['jquery', 'underscore', 'backbone', 'lib/backbone.select'], function ($, _, Backbone) {
    /**
     * A Renderer used similar to a Backbone.View. It is designed to be a view for Snap.SVG components. Every Renderer contains the child 'snap' that gets passed as argument in the constructor.
     * @type {Function}
     */
    var Renderer = Backbone.Renderer = function (options) {
        "use strict";
        options = options || {};

        this.cid = _.uniqueId('renderer');
        this.snap = options.snap;
        this.controller = options.controller;

        if (typeof this.snap === 'undefined')
            throw('The snap object is missing as parameter in a Renderer\'s constructor.');
        if (typeof this.controller === 'undefined')
            throw('The controller object is missing as parameter in a Renderer\'s constructor.');

        options = _.omit(options, ['snap', 'controller']);
        this.initialize.apply(this, [options]);
    };

    Renderer.extend = Backbone.View.extend;

    _.extend(Renderer.prototype, Backbone.Events, {


        initialize: function () {
        },

        /**
         * To be overwritten in Implementation.
         * @returns {boolean} true if the render function should be called again and false if not
         */
        render: function () {
            return false;
        },

        /**
         * @returns {number} the time from that on the renderer function should get called
         */
        getStartTime: function () {
            "use strict";
            throw "Method not implemented.";
        }
    });


    /**
     * A GameObject controls the logic of an element in the game.
     * @type {Function}
     */
    var GameObject = Backbone.GameObject = function () {
        "use strict";
        this.cid = _.uniqueId('gameobject');
        this.initialize.apply(this, arguments);
    };

    GameObject.extend = Backbone.View.extend;

    _.extend(GameObject.prototype, Backbone.Events, {
        initialize: function () {
        },
        getRenderer: function () {
            "use strict";
            return this.renderer.component;
        },
        setRenderer: function (renderer) {
            "use strict";
            this.renderer = {
                component: renderer,
                starttime: renderer.getStartTime()
            };
        },
        render: function (time) {
            "use strict";
            if (!this.active) {
                this.active = (time >= this.renderer.starttime);
            }
            if (this.active) {
                return this.active = this.renderer.component.render(time);
            }
            return true;
        }
    });


    _.extend(Backbone.View.prototype, {
        dispose: function () {
            if (typeof this.onClose === 'function')
                this.onClose();

            this.remove();
            // Uses the default Backbone.View.remove() method which
            // removes this.el from the DOM and removes DOM events.
        }
    });

    _.extend(Backbone.Model.prototype, {
        toJSON: function () {
            var obj = this.deepcopy(this.attributes);
            if (typeof this.id !== 'undefined' && this.id !== null)
                obj.id = this.id;
            return obj;
        },

        deepcopy: function (copyof) {
            var obj = (copyof instanceof Array) ? [] : {};

            for (var k in copyof) {
                if (typeof copyof[k] == "object" && copyof[k] !== null) {
                    //console.log('found ' + typeof copyof[k] + ' ' + k);
                    if (typeof copyof[k].toJSON == "function") {
                        // console.info('.toJSON() method used for nested model/collection ' + k);
                        obj[k] = copyof[k].toJSON();
                    }
                    else {
                        obj[k] = this.deepcopy(copyof[k]);
                    }
                }
                else {
                    // console.log('copied leaf ' + k);
                    obj[k] = copyof[k];
                }
            }
            return obj;
        }
    });
});