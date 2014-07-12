define([
	'jquery',
	'underscore',
	'backbone',
    'app',
    'utils/analytics',
	'views/menu',
	'views/home',
	'views/levelbuilder',
	'views/chooselevel',
	'views/applicationwithmenu',
    'views/PageNotFoundView',
    'views/legal',
    'views/PlayView',
    'views/highscore'
], function ($, _, Backbone, app, analytics, MenuView, HomeView, LevelBuilderView, ChooseLevelView, ApplicationWithMenuView, PageNotFoundView, LegalView, PlayView, HighScoreView) {
	var Router = Backbone.Router.extend({
		routes: {
			// Define some URL routes
			'': 'home',
			'chooselevel': 'chooselevel',
            'buildlevel' : 'buildlevel',
			'buildlevel/:soundcloudurl': 'buildlevel',
            'legal' : 'legal',
            'playlevel': 'chooselevel',
            'highscore': 'chooselevel',

			// Default
			'*notfound': 'notfound'
		},

        init : function(){
            console.log('initializing router');
            this.applicationwithmenuview = new ApplicationWithMenuView();
            this.homeview = new HomeView();
            this.chooselevelview = new ChooseLevelView();
            this.levelbuilderview = new LevelBuilderView();
            this.pagenotfoundview = new PageNotFoundView();
            this.legalview  = new LegalView();
            this.playlevelview = new PlayView();
            this.highscoreview = new HighScoreView();

            this.on('route:home', function () {
                app.setContent(this.homeview);
            });

            this.on('route:chooselevel', function () {
                app.setContent(this.chooselevelview);
            });

            this.on('route:buildlevel', function (soundcloudurl) {
                app.setContent(this.levelbuilderview, soundcloudurl);
            });

            this.on('route:notfound', function (actions) {
                console.log('No route:', actions);
                app.setContent(this.homeview);
                this.pagenotfoundview.render();
            });

            this.on('route:legal', function () {
                app.setContent(this.legalview);
            });
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