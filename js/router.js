define([
    'jquery',
    'underscore',
    'backbone',
    'app',
    'util/analytics',
    'views/components/html/MenuView',
    'views/HomeView',
    'views/ChooseLevelView',
    'views/components/html/ApplicationWithMenuView',
    'views/PageNotFoundView',
    'views/LegalView',
    'views/PlayView',
    'views/HighScoreView',
    'views/levelbuilder/BaseView',
    'views/components/svg/AudioLoaderView'
], function ($, _, Backbone, app, analytics, MenuView, HomeView, ChooseLevelView, ApplicationWithMenuView, PageNotFoundView, LegalView, PlayView, HighScoreView, LevelBuilderBaseView, AudioLoaderView) {
    var Router = Backbone.Router.extend({
        routes: {
            '': 'home',
            'chooselevel': 'chooselevel',
            'levelbuilder': 'buildlevel',
            'levelbuilder/create(/:soundcloudurl)': 'createlevel',
            'legal': 'legal',
            'playlevel': 'chooselevel',
            'highscore': 'chooselevel',
            'levelbuilder/edit': 'editlevel',

            // Default
            '*notfound': 'notfound'
        },

        views: {
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
        },

        openLevelEditor: function () {
            var levelbuilderview = app.router.views.levelbuilderview;
            var subview = [].shift.call(arguments);
            if (!subview)
                subview = levelbuilderview.contents.startview;

            app.setContent(levelbuilderview);
            levelbuilderview.setContent(subview, arguments);
        },

        init: function () {


            this.on('route:home', function () {
                app.setContent(this.views.homeview);
            });

            this.on('route:chooselevel', function () {
                app.setContent(this.views.chooselevelview);
            });

            this.on('route:buildlevel', function () {
                this.openLevelEditor();
            });

            this.on('route:createlevel', function (soundcloudurl) {
                this.openLevelEditor(this.views.levelbuilderview.contents.audioselectorview, soundcloudurl);
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
                this.openLevelEditor(this.views.levelbuilderview.contents.openlevelview);
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

    var initialize = function () {
        var router = new Router;
        return router;
    };

    return {
        initialize: initialize
    };
});