define([
	'jquery',
	'underscore',
	'backbone',
    'utils/analytics',
	'views/menu',
	'views/home',
	'views/levelbuilder',
	'views/chooselevel',
	'views/applicationwithmenu',
    'views/PageNotFoundView',
    'views/legal',
    'views/PlayView'
], function ($, _, Backbone, analytics, MenuView, HomeView, LevelBuilderView, ChooseLevelView, ApplicationWithMenuView, PageNotFoundView, LegalView, PlayView) {
	var Router = Backbone.Router.extend({
		routes: {
			// Define some URL routes
			'': 'home',
			'chooselevel': 'chooselevel',
            'buildlevel' : 'buildlevel',
			'buildlevel/:soundcloudurl': 'buildlevel',
            'legal' : 'legal',
            'playlevel?json=:level' : 'playlevel',

			// Default
			'*notfound': 'notfound'
		},

        init : function(){
            this.applicationwithmenuview = new ApplicationWithMenuView();
            this.applicationwithmenuview.render();
            this.homeview = new HomeView();
            this.chooselevel = new ChooseLevelView();
            this.levelbuilderview = new LevelBuilderView();
            this.pagenotfoundview = new PageNotFoundView();
            this.legalview  = new LegalView();
            this.playlevelview = new PlayView();

            this.on('route:home', function () {
                this.homeview.render();
            });

            this.on('route:chooselevel', function () {
                this.chooselevel.render();
            });

            this.on('route:buildlevel', function (soundcloudurl) {
                this.levelbuilderview.render(soundcloudurl);
            });

            this.on('route:notfound', function (actions) {
                console.log('No route:', actions);
                this.pagenotfoundview.render();
                this.homeview.render();
            });

            this.on('route:playlevel', function(level){
                this.playlevelview.render(JSON.parse(level));
            });

            this.on('route:legal', function () {
                this.legalview.render();
            });
        }
	});

	var initialize = function () {
		var router = new Router;
        router.init();
		Backbone.history.start();
        return router;
	};

	return {
		initialize: initialize
	};
});