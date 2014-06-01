define([
  'jquery',
  'underscore',
  'backbone',
  'text!templates/home.html'
], function ($, _, Backbone, homeTemplate) {
	var HomeView = Backbone.View.extend({
		el: '#content',
		render: function () {
			var template = _.template(homeTemplate, {});
			this.$el.html(template);
		}
	});
	// Our module now returns our view
	return HomeView;
});