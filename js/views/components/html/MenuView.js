define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/menu.html',
    'bootstrap'
], function ($, _, Backbone, menuTemplate) {
    var MenuView = Backbone.View.extend({
        el: '#menu',
        render: function () {
            if (this.closemenuitem)
                this.closemenuitem.unbind();

            var template = _.template(menuTemplate, {});
            this.$el.html(template);

            this.closemenuitem = $('.navbar-collapse ul li a:not(.dropdown-toggle)');

            this.closemenuitem.bind('click', function () {
                $('.navbar-toggle:visible').click();
            });

            Backbone.history.bind("route", this.updateMenuState.bind(this));
        },

        menustates: {
            'createlevel': 'levelbuilder',
            'editlevel': 'levelbuilder',
            'buildlevel': 'levelbuilder'
        },

        updateMenuState: function (router, route) {
            var activeitem_old = $('.active');
            if (activeitem_old != null)
                activeitem_old.removeClass('active');

            var activeitem_new = $('#' + (this.menustates[route] || route));
            if (activeitem_new != null)
                activeitem_new.addClass('active');
        }
    });
    return MenuView;
});