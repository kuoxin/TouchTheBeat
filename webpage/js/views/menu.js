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

            Backbone.history.bind("route", this.updateMenuState);
		},

        updateMenuState : function (router,route) {
            console.log(route);
            console.log(router);

            var activeitem_old = $('.active');
            if (activeitem_old != null)
                activeitem_old.removeClass('active');

            var activeitem_new = $('#' + route);
            if (activeitem_new != null)
                activeitem_new.addClass('active');

        }
	});
	return MenuView;
});