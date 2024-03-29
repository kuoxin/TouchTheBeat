define(['jquery', 'underscore', 'backbone'], function ($, _, Backbone) {
	/**
	 * The Controller is a base object of TouchTheBeat that controls a specific aspect of the app
	 * @class Controller
	 * @type {Function}
	 */
	var Controller = function () {
		"use strict";
		this.cid = _.uniqueId('controller');
		this.initialize.apply(this, arguments);
	};

	Controller.extend = Backbone.View.extend;

	_.extend(Controller.prototype, Backbone.Events, {
		initialize: function () {
		},
		close: function () {
			"use strict";
			if (typeof this.onClose === 'function') {
				this.onClose();
			}
		}
	});
	return Controller;
});
