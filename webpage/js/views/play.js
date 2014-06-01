define([
  'jquery',
  'underscore',
  'backbone',
  'text!templates/play.html'
], function ($, _, Backbone, playTemplate) {
	var PlayView = Backbone.View.extend({
		el: '#content',
		render: function () {
			var template = _.template(playTemplate, {});
			this.$el.html(template);
		}
	});
	// Our module now returns our view
	return PlayView;
});