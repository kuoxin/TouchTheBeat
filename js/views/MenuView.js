define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/menu.html',
    'views/SignInButtonView',
    'app',
    'mixins/ExchangeableContent',
    'bootstrap'
], function ($, _, Backbone, menuTemplate, SignInButtonView, app, ExchangeableContent) {
    var MenuView = Backbone.View.extend(
        _.extend(new ExchangeableContent, {
        el: '#menu',

        initialize: function () {
            this.listenTo(app.session, 'change:logged_in', this.changeLoggedInState.bind(this));
        },

        render: function () {
            this.configureExchangableContents({className: 'usermenucontainer'});
            this.addContents({
                nosession: new SignInButtonView()
            });
            var template = _.template(menuTemplate, {});
            this.$el.html(template);
            Backbone.history.bind("route", this.updateMenuState.bind(this));
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
            console.log('MenuView updating session state');
            console.log(session.get('user'));
            if (session.get('logged_in')) {
                //btn:btn_signin.html('Signed in as ' + session.get('user').escape('username'));

            }
            else {
                console.log('setting login button');
                this.setContent('nosession');
            }
        },

        updateMenuState: function (router, route) {
            var activeitem_old = $('.active');
            if (activeitem_old != null)
                activeitem_old.removeClass('active');

            var activeitem_new = $('#' + (this.menustates[route] || route));
            if (activeitem_new != null)
                activeitem_new.addClass('active');
        }
        }));
    return MenuView;
});