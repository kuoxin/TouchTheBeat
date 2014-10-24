define([
    'jquery',
    'underscore',
    'backbone',
    'app',
    'text!templates/UserMenuButton.html',
    'bootstrap'
], function ($, _, Backbone, app, template) {
    var UserMenuButtonView = Backbone.View.extend({
        tagName: 'li',
        className: 'dropdown',

        render: function () {
            var user = app.session.get('user');
            this.$el.html(_.template(template, user.toJSON()));
        }
    });
    return UserMenuButtonView;
});