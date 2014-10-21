define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/menu.html',
    'views/SignInView',
    'app',
    'bootstrap'
], function ($, _, Backbone, menuTemplate, SignInView, app) {
    var MenuView = Backbone.View.extend({
        el: '#menu',

        initialize: function () {
            this.listenTo(app.session, 'change:logged_in', this.changeLoggedInState.bind(this));
        },

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

            this.changeLoggedInState(app.session);
        },

        menustates: {
            'createlevel': 'levelbuilder',
            'editlevel': 'levelbuilder',
            'buildlevel': 'levelbuilder'
        },

        events: {
            'click #btn_signin': 'clickedSignInButton'
        },

        changeLoggedInState: function (session) {
            console.log('MenuView registered login change');
            var btn_signin = $('#btn_signin');
            console.log(session.get('user'));
            if (session.get('logged_in')) {
                btn:btn_signin.html('Signed in as ' + session.get('user').escape('username'));
            }
            else {
                btn:btn_signin.html('Sign in');
            }
        },

        clickedSignInButton: function () {
            if (app.session.get('logged_in')) {

            }
            else {
                this.openSignInModal();
            }

        },

        openSignInModal: function () {
            var signinview = new SignInView();
            signinview.render();
            $('#abovecontent').html(signinview.el);
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