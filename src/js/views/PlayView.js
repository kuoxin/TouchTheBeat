define([
    'jquery',
    'underscore',
    'Framework',
    'text!templates/play.html',
    'app',
    'models/Track',
    'game/controller/Game',
    'util/analytics',
    'game/controller/AudioController',
    'game/renderer/AudioLoadingRenderer',
    'game/Surface',
    'util/scripts'

], function ($, _, Framework, playTemplate, app, Track, Game, analytics, AudioController, AudioLoadingRenderer, Surface) {
    var PlayView = Framework.View.extend({
        el: '#body',

        onClose: function () {
            if (typeof this.game !== 'undefined')
                this.game.stop();

            this.result = null;

            try {
                this.audiocontroller.dispose();
            }
            catch (e) {
            }


            this.game = null;
        },

        stopGame: function () {
            this.game.stop();


            $('#svg').fadeTo(1500, 0, this.exitview.bind(this));

            this.result = {};
            this.result.highscore = this.game.calculateHighScore();
            this.result.level = this.level;

            this.audiocontroller.dispose();
        },

        render: function (level) {
            //TODO: Stop the game really when navigating away.
            Framework.history.navigate('playlevel', false);
            this.onClose();

            this.level = level;
            var template = _.template(playTemplate, {});
            this.$el.html(template);

            this.surface = new Surface(
                {bgcolor: '#000000'}
            );

            this.audioloadingrenderer = new AudioLoadingRenderer({
                snap: this.surface.getSnap()
            });
            this.audioloadingrenderer.render();

            this.audiocontroller = new AudioController({
                renderer: this.audioloadingrenderer,
                callback_started: this.onAudioStarted.bind(this),
                callback_ended: this.stopGame.bind(this),
                callback_readytoplay: this.onAudioReady.bind(this),
                callback_error: this.onAudioError.bind(this)
            });

            this.audiocontroller.load(this.level.get('audio').getStreamUrl(), true);
        },

        onAudioReady: function () {
            console.log('audio is ready');
            this.game = new Game({
                level: this.level,
                audiocontroller: this.audiocontroller,
                surface: this.surface
            });
            this.surface.requestStartFromUser(this.audiocontroller.start.bind(this.audiocontroller));
        },

        onAudioStarted: function () {
            this.game.start();
        },

        onAudioError: function (error) {
            console.error(error);
            alert(error);
            this.audiocontroller.onClose();
            this.audiocontroller.dispose();
        },

        exitview: function () {

            analytics.trackAction('game', 'ending regularly', 'highscore:' + this.result.highscore);

            app.setContent(app.router.views.highscoreview, this.result);
        }




    });
    return PlayView;
});