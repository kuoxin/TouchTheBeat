define(['jquery', 'underscore', 'backbone'], function ($, _, Backbone) {
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

	return Renderer;
});