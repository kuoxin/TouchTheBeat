define([
    'jquery',
    'underscore',
    'backbone',
    'util/analytics',
    'models/Level',
    'bootstrap'
], function ($, _, Backbone, analytics, Level) {
    var app = {
        router: null,
        models: {
            levelEditorModel: null
        },

        baseviewIsRendered: false,

        startlevel: function (level) {
            app.setFullScreenContent(app.router.views.playlevelview, level);
        },

        setFullScreenContent: function () {
            app.baseviewIsRendered = false;

            app.router.views.current = [].shift.call(arguments);
            app.router.views.current.setElement('#body').render.apply(app.router.views.current, arguments);
            analytics.trackPageView(app.router.getCurrentAppStatus());
        },

        getLevelEditorModel: function () {
            return app.models.levelEditorModel;
        },

        createLevelEditorModel: function (soundcloudURL) {
            if (app.getLevelEditorModel()) {
                console.warn('The current LevelEditor-draft will be overwritten. Trying to log the level-text as backup:');
                try {
                    console.log(JSON.stringify(app.getLevelEditorModel().toJSON()));
                }
                catch (e) {
                    console.error(e);
                }
            }
            app.models.levelEditorModel = soundcloudURL ? Level.createFromSoundCloud(soundcloudURL) : new Level();
            return app.getLevelEditorModel();
        },

        getMainView: function () {
            console.log(app.router.views.baseview);
            return app.router.views.baseview;
        },

        setContent: function () {

            var newview = [].shift.call(arguments);

            if (app.router.views.current == newview)
                return;

            if (!app.baseviewIsRendered) {
                app.router.views.baseview.render();
                app.baseviewIsRendered = true;
            }

            if (app.router.views.current != null) {
                if (app.router.views.current.onClose)
                    app.router.views.current.onClose();

                //app.router.views.current.dispose();
            }

            app.router.views.current = newview;
            app.router.views.current.setElement($('#content')).render.apply(app.router.views.current, arguments);

            analytics.trackPageView(app.router.getCurrentAppStatus());
        }
    };
    return app;
});