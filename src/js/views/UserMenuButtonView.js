define([
    'jquery',
    'underscore',
    'Framework',
    'app',
    'text!templates/UserMenuButton.html',
    'bootstrap'
], function ($, _, Framework, app, template) {
    var UserMenuButtonView = Framework.View.extend({
        tagName: 'li',
        className: 'dropdown',

        render: function () {
            var user = app.session.get('user');
            this.$el.html(_.template(template, user.toJSON()));
        },

        events: {
            'click #item_logout': 'logout'
        },

        logout: function () {
            app.session.logout();
        }


    });
    return UserMenuButtonView;
});