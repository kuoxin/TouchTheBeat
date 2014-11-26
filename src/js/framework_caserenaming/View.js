define([
	'underscore',
	'backbone'
], function (_, Backbone) {
	_.extend(Backbone.View.prototype, {
		dispose: function () {
			if (typeof this.onClose === 'function')
				this.onClose();

			this.remove();
			// Uses the default Backbone.View.remove() method which
			// removes this.el from the DOM and removes DOM events.
		}
	});

	return Backbone.View;
});