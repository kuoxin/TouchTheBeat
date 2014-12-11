define([
    'jquery',
    'underscore',
    'Framework',
    'text!templates/levelbuilder/signincall.html',
    'app'
], function ($, _, Framework, plainTemplate, app) {
    var SignInCallView = Framework.View.extend({

        template: _.template(plainTemplate, {}),

        route: 'levelbuilder/signin',

        render: function () {
            this.$el.html(this.template);
            var originalRoute = Framework.history.fragment;
            if (originalRoute != this.route) {
                app.router.navigate('levelbuilder/signin', {replace: true});
                this.listenTo(app.session, 'change:logged_in', function (session) {
                    if (session.get('logged_in')) {
                        app.router.navigate(originalRoute, {trigger: true, replace: true});
                    }
                });
            }
        },

        events: {
            'click #btn_showsigninmodal_call': 'clickedSignInButton'
        },

        clickedSignInButton: function () {
            console.log('clicked signinbutton');
            if (!app.session.get('logged_in')) {
                app.getMainView().getAppView().openSignInModal();
            }
        }

    });

    return SignInCallView;
});

