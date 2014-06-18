define([
  'jquery',
  'underscore',
  'backbone',
  'text!templates/menu.html',
  'bootstrap',
  
], function ($, _, Backbone, menuTemplate) {
	var MenuView = Backbone.View.extend({
		el: '#menu',
		render: function () {
			var template = _.template(menuTemplate, {});
			this.$el.html(template);
		},
		updateMenuState : function (page){
			this.$('.active').removeClass('active');
			this.$('#' + page).addClass('active');
		}
	});
	return MenuView;
});