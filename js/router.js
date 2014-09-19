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
    'views/levelbuilder/MetaDataView',
    'views/components/svg/AudioLoaderView'
], function ($, _, Backbone, app, analytics, MenuView, HomeView, ChooseLevelView, ApplicationWithMenuView, PageNotFoundView, LegalView, PlayView, HighScoreView, AudioSelectorView, GameObjectRecorderView, MetaDataView, AudioLoaderView) {
    var Router = Backbone.Router.extend({
        routes: {
            '': 'home',
            'chooselevel': 'chooselevel',
            'buildlevel': 'buildlevel',
            'buildlevel/:soundcloudurl': 'buildlevel',
            'legal': 'legal',
            'playlevel': 'chooselevel',
            'highscore': 'chooselevel',

            // Default
            '*notfound': 'notfound'
        },

        init: function () {
            this.applicationwithmenuview = new ApplicationWithMenuView();
            this.homeview = new HomeView();
            this.chooselevelview = new ChooseLevelView();
            this.pagenotfoundview = new PageNotFoundView();
            this.legalview = new LegalView();
            this.playlevelview = new PlayView();
            this.highscoreview = new HighScoreView();
            this.levelbuilder_audioselectorview = new AudioSelectorView();
            this.levelbuilder_gameobjectrecorderview = new GameObjectRecorderView();
            this.levelbuilder_metadataview = new MetaDataView();
            this.audioloaderview = new AudioLoaderView();

            this.on('route:home', function () {
                app.setContent(this.homeview);
            });

            this.on('route:chooselevel', function () {
                app.setContent(this.chooselevelview);
            });

            this.on('route:buildlevel', function (soundcloudurl) {
                app.setContent(this.levelbuilder_audioselectorview, soundcloudurl);
            });

            this.on('route:notfound', function (actions) {
                console.log('No route:', actions);
                app.setContent(this.homeview);
                this.pagenotfoundview.render();
            });

            this.on('route:legal', function () {
                app.setContent(this.legalview);
            });
        },


        // taken from http://stackoverflow.com/a/16191880/2618345
        current: function () {
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