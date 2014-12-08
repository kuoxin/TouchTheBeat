define([
	'underscore',
	'backbone',
	'jquery'
], function (_, Backbone, $) {
	_.extend(Backbone.View.prototype, {
		fullscreen: false,
		close: function () {
			"use strict";
			if (typeof this.onClose === 'function')
				this.onClose();

			if (!this.fullscreen) {
				/**
				 * Uses the default Backbone.View.remove() method which
				 * removes this.el from the DOM, removes DOM events and calls Backbones stopListening.
				 * http://backbonejs.org/#View-remove
				 */
				this.remove();
			}
			else {
				$('body').empty();
				this.stopListening();
			}

			if (typeof this.onClosed === 'function')
				this.onClosed();

		}
	});

	return Backbone.View;
});