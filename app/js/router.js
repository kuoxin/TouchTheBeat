define([
    'jquery',
    'underscore',
    'backbone',
    'app',
    'util/analytics'
], function ($, _, Backbone, app) {
    /**
     * defines the app's routes
     * @module src
     * @class Router
     * @extends Backbone.Router
     */
    var Router = Backbone.Router.extend({
        routes: {
            '': 'home',
			'chooselevel(/)': 'chooselevel',
			'levelbuilder(/)': 'buildlevel',
			'levelbuilder(/start)': 'buildlevel',
			'levelbuilder/create(/)': 'createlevel',
            'levelbuilder/create(/:soundcloudurl)': 'createlevel',
			'levelbuilder/import(/)': 'importlevel',
			'levelbuilder/signin(/)': 'levelbuildersignin',
			'levelbuilder/record(/)': 'buildlevel',
			'legal(/)': 'legal',
			'playlevel(/)': 'chooselevel',
			'highscore(/)': 'chooselevel',
			'signin(/)': 'signin',

            // Default
            '*notfound': 'notfound'
        },

        openLevelBuilder: function () {
            var subroute = [].shift.call(arguments);
            app.showAppContent('levelbuilder', subroute);
        },

        init: function () {
            this.on('route:home', function () {
                app.showAppContent('home');
            });

            this.on('route:chooselevel', function () {
                app.showAppContent('chooselevel');
            });

            this.on('route:buildlevel', function () {
                this.openLevelBuilder();
            });

            this.on('route:createlevel', function () {
                this.openLevelBuilder('leveleditor');
            });

            this.on('route:levelbuildersignin', function () {
                this.openLevelBuilder('signin');
            });

            this.on('route:notfound', function (actions) {
                console.log('No route:', actions);
				app.showAppContent('pagenotfound');
            });

            this.on('route:legal', function () {
                app.showAppContent('legal');
            });

            this.on('route:importlevel', function () {
                this.openLevelBuilder('importlevel');
            });

            this.on('route:signin', function () {
                app.showAppContent('signin');
            });
        },


        /**
         * taken from http://stackoverflow.com/a/16191880/2618345
         * @method getCurrentAppStatus
         * @returns {{route: String, fragment: String, params: *}}
         */
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
