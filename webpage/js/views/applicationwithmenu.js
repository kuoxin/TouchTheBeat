define([
  'jquery',
  'underscore',
  'backbone',
  'text!templates/applicationwithmenu.html'
], function ($, _, Backbone, awmtemplate) {
	var ApplicationWithMenuView = Backbone.View.extend({
		el: 'body',
		render: function () {
			var template = _.template(awmtemplate, {});
			this.$el.html(template);
		}
	});
	return ApplicationWithMenuView;
});