define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/applicationwithmenu.html',
    'views/MenuView',
    'views/SignInView'
], function ($, _, Backbone, awmtemplate, MenuView, SignInView) {
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
        },

        openSignInModal: function () {
            var signinview = new SignInView();
            signinview.render();
            $('#abovecontent').html(signinview.el);
        }
    });
    return ApplicationWithMenuView;
});