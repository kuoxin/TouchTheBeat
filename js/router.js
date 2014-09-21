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
    'views/levelbuilder/AudioSelectorView',
    'views/levelbuilder/GameObjectRecorderView',
    'views/levelbuilder/GameObjectEditorView',
    'views/levelbuilder/MetaDataView',
    'views/levelbuilder/StartView',
    'views/components/svg/AudioLoaderView'
], function ($, _, Backbone, app, analytics, MenuView, HomeView, ChooseLevelView, ApplicationWithMenuView, PageNotFoundView, LegalView, PlayView, HighScoreView, AudioSelectorView, GameObjectRecorderView, GameObjectEditorView, MetaDataView, StartView, AudioLoaderView) {
    var Router = Backbone.Router.extend({
        routes: {
            '': 'home',
            'chooselevel': 'chooselevel',
            'levelbuilder': 'buildlevel',
            'levelbuilder/create(/:soundcloudurl)': 'createlevel',
            'legal': 'legal',
            'playlevel': 'chooselevel',
            'highscore': 'chooselevel',
            'editlevel': 'editlevel',

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
            levelbuilder: {
                startview: new StartView(),
                audioselectorview: new AudioSelectorView(),
                gameobjectrecorderview: new GameObjectRecorderView(),
                metadataview: new MetaDataView()
            },

            audioloaderview: new AudioLoaderView()
        },

        init: function () {


            this.on('route:home', function () {
                app.setContent(app.router.views.homeview);
            });

            this.on('route:chooselevel', function () {
                app.setContent(app.router.views.chooselevelview);
            });

            this.on('route:buildlevel', function () {
                app.setContent(app.router.views.levelbuilder.startview);
            });

            this.on('route:createlevel', function (soundcloudurl) {
                app.setContent(app.router.views.levelbuilder.audioselectorview, soundcloudurl);
            });

            this.on('route:notfound', function (actions) {
                console.log('No route:', actions);
                app.setContent(app.router.views.homeview);
                app.router.views.pagenotfoundview.render();
            });

            this.on('route:legal', function () {
                app.setContent(app.router.views.legalview);
            });

            //TODO: integrate this temporary route into the LevelBuilder
            this.on('route:editlevel', function () {
                //var view = new GameObjectEditorView(levelcontainer[0]);
                //app.setContent(view);
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