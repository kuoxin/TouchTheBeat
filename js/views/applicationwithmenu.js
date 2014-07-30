define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/applicationwithmenu.html',
    'views/menu'
], function ($, _, Backbone, awmtemplate, MenuView) {
    var ApplicationWithMenuView = Backbone.View.extend({
        el: 'body',
        render: function () {
            var template = _.template(awmtemplate, {});
            this.$el.html(template);

            this.menu = new MenuView();
            this.menu.render();
        },
        getMenu: function () {
            return this.menu;
        }
    });
    return ApplicationWithMenuView;
});