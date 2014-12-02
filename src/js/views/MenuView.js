define([
    'jquery',
    'underscore',
    'Framework',
    'text!templates/menu.html',
    'views/SignInMenuButtonView',
    'views/UserMenuButtonView',
    'app',
    'framework/ExchangeableContent',
    'lib/bootstrap'
], function ($, _, Framework, menuTemplate, SignInMenuButtonView, UserMenuButtonView, app, ExchangeableContent) {
    var MenuView = Framework.View.extend(
        _.extend(new ExchangeableContent(), {
        el: '#menu',

        initialize: function () {
            this.listenTo(app.session, 'change:logged_in', this.changeLoggedInState.bind(this));
        },

        render: function () {
            this.configureExchangableContents({
                className: 'usermenucontainer',
                contentsareinstances: true
            });
            this.addContents({
                nosession: new SignInMenuButtonView(),
                session: new UserMenuButtonView()
            });
            var template = _.template(menuTemplate, {});
            this.$el.html(template);
            Framework.history.bind("route", this.updateMenuState.bind(this));
            this.changeLoggedInState(app.session);
        },

        menustates: {
            'createlevel': 'levelbuilder',
            'editlevel': 'levelbuilder',
            'buildlevel': 'levelbuilder'
        },

        events: {
            'click .navbar-collapse ul li a:not(.dropdown-toggle)': 'changeMenuVisibility'
        },

            changeMenuVisibility: function () {
                this.$('.navbar-toggle:visible').click();
            },

        changeLoggedInState: function (session) {
            if (session.get('logged_in')) {
                this.setContent('session');
            }
            else
                this.setContent('nosession', ['navbar-btn']);
        },

        updateMenuState: function (router, route) {
            var activeitem_old = $('.active');
            if (activeitem_old !== null)
                activeitem_old.removeClass('active');

            var activeitem_new = $('#' + (this.menustates[route] || route));
            if (activeitem_new !== null)
                activeitem_new.addClass('active');
        }
        }));
    return MenuView;
});