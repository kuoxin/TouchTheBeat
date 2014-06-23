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
    'views/legal'
], function ($, _, Backbone, analytics, MenuView, HomeView, LevelBuilderView, ChooseLevelView, ApplicationWithMenuView, PageNotFoundView, LegalView) {
	var Router = Backbone.Router.extend({
		routes: {
			// Define some URL routes
			'': 'home',
			'chooselevel': 'chooselevel',
			'buildlevel': 'levelbuilder',
            'legal' : 'legal',

			// Default
			'*notfound': 'notfound'
		},


        //TODO: Better Navigation, make the menu to use the router
        init : function(){
            this.applicationwithmenuview = new ApplicationWithMenuView();
            this.applicationwithmenuview.render();

            var menu = this.applicationwithmenuview.getMenu();

            this.on('route:home', function () {
                var homeview = new HomeView();
                homeview.render();
            });

            this.on('route:chooselevel', function () {
                var chooselevel = new ChooseLevelView();
                chooselevel.render();
            });

            this.on('route:levelbuilder', function () {
                var levelbuilderview = new LevelBuilderView();
                levelbuilderview.render();
            });

            this.on('route:notfound', function (actions) {
                console.log('No route:', actions);
                var pagenotfoundview = new PageNotFoundView();
                pagenotfoundview.render();
                var homeview = new HomeView();
                homeview.render();
            });

            this.on('route:legal', function () {
              var legalview  = new LegalView();
                legalview.render();
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