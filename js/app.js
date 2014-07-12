define([
  'jquery',
  'underscore',
  'backbone',
  'router',
  'bootstrap',
], function ($, _, Backbone, Router) {
    var app = {
        router: null,
        startlevel: function (level) {
            app.router.playlevelview.render(level);
        },
        setContent: function () {

            app.router.applicationwithmenuview.render();
            console.log('rendered plain view');
            var view = [].shift.call(arguments);
            view.setElement($('#content')).render.apply(view, arguments);
        }

    };
    return app;
});