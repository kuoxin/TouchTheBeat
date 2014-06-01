define([
  'jquery',
  'underscore',
  'backbone'
], function ($, _, Backbone) {
	var MenuView = Backbone.View.extend({
		el: '#menu',
		render: function (page) {
			console.log('rendered menu ' + page);
			this.$('.active').removeClass('active');
			this.$('#' + page).addClass('active');
		}
	});
	return MenuView;
});