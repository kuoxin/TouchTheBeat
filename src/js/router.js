define([
    'jquery',
    'underscore',
    'backbone',
    'app',
    'util/analytics',
    'views/MenuView',
    'views/HomeView',
    'views/ChooseLevelView',
    'views/ApplicationWithMenuView',
    'views/PageNotFoundView',
    'views/LegalView',
    'views/game/PlayView',
    'views/HighScoreView',
    'views/levelbuilder/BaseView',
    'views/game/AudioLoaderView',
    'views/SignInView'
], function ($, _, Backbone, app, analytics, MenuView, HomeView, ChooseLevelView, ApplicationWithMenuView, PageNotFoundView, LegalView, PlayView, HighScoreView, LevelBuilderBaseView, AudioLoaderView, SignInView) {
    var Router = Backbone.Router.extend({
        routes: {
            '': 'home',
            'chooselevel': 'chooselevel',
            'levelbuilder': 'buildlevel',
            'levelbuilder/create(/:soundcloudurl)': 'createlevel',
            'levelbuilder/edit': 'editlevel',
            'levelbuilder/signin': 'levelbuildersignin',
            'legal': 'legal',
            'playlevel': 'chooselevel',
            'highscore': 'chooselevel',
            'signin': 'signin',

            // Default
            '*notfound': 'notfound'
        },


        openLevelBuilder: function () {
            var levelbuilderview = app.router.views.levelbuilderview;
            var subroute = [].shift.call(arguments);
            app.setContent(levelbuilderview);
            if (!(typeof subroute === 'undefined'))
                levelbuilderview.setContent(subroute);
        },

        init: function () {
            this.views = {
                current: null,
                baseview: new ApplicationWithMenuView(),
                homeview: new HomeView(),
                chooselevelview: new ChooseLevelView(),
                pagenotfoundview: new PageNotFoundView(),
                legalview: new LegalView(),
                playlevelview: new PlayView(),
                highscoreview: new HighScoreView(),
                levelbuilderview: new LevelBuilderBaseView(),
                audioloaderview: new AudioLoaderView()
            };


            this.on('route:home', function () {
                app.setContent(this.views.homeview);
            });

            this.on('route:chooselevel', function () {
                app.setContent(this.views.chooselevelview);
            });

            this.on('route:buildlevel', function () {
                this.openLevelBuilder();
            });

            this.on('route:createlevel', function (soundcloudurl) {
                this.openLevelBuilder('leveleditor');
            });

            this.on('route:levelbuildersignin', function () {
                this.openLevelBuilder('signin');
            });

            this.on('route:notfound', function (actions) {
                console.log('No route:', actions);
                app.setContent(this.views.homeview);
                this.views.pagenotfoundview.render();
            });

            this.on('route:legal', function () {
                app.setContent(this.views.legalview);
            });

            this.on('route:editlevel', function () {
                this.openLevelBuilder('openlevel');
            });

            this.on('route:signin', function () {
                var signinview = new SignInView();
                app.setContent(signinview);
            });
        },


        // taken from http://stackoverflow.com/a/16191880/2618345
        getCurrentAppStatus: function () {
            var Router = this,
                fragment = Backbone.history.fragment,
                routes = _.pairs(Router.routes),
                route = null, params = null, matched;

            matched = _.find(routes, function (handler) {
                route = _.isRegExp(handler[0]) ? handler[0] : Router._routeToRegExp(handler[0]);
                return route.test(fragment);
            });

            if (matched) {
                // NEW: Extracts the params using the internal
                // function _extractParameters
                params = Router._extractParameters(route, fragment);
                route = matched[1];
            }

            return {
                route: route,
                fragment: fragment,
                params: params
            };
        }

    });


    return Router;
});