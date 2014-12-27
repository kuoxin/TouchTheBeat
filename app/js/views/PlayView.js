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

        fullscreen: true,

        onClose: function () {
            if (this.game) {
                this.game.stop();
            }

            this.result = null;
            this.audiocontroller.close();
            this.game = null;
        },

        stopGame: function () {
            this.game.stop();

            $('#svg').fadeTo(1500, 0, this.exitview.bind(this));

            this.result = {};
            this.result.highscore = this.game.calculateHighScore();
            this.result.level = this.level;

            this.audiocontroller.close();
        },

        render: function (level) {
            //TODO: Stop the game really when navigating away.
            Framework.history.navigate('playlevel', false);

            var that = this;

            this.level = level;
            console.log(this.level);
            this.levelloaded = this.level.get('gameObjects').length > 0;
            this.audioready = false;
            if (!this.levelloaded) {
                this.level.fetch({
                    success: function () {
                        "use strict";
                        console.log('level loaded');
                        if (that.audioready) {
                            that.start();
                        }
                        else {
                            that.levelloaded = true;
                        }
                    }
                });
            }
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
                callback_ended: this.stopGame.bind(this),
                callback_readytoplay: this.onAudioReady.bind(this),
                callback_error: this.onAudioError.bind(this)
            });

            this.audiocontroller.load(this.level.get('audio').getStreamUrl(), true);
        },

        requestStart: function () {
            "use strict";
            this.game = new Game({
                level: this.level,
                audiocontroller: this.audiocontroller,
                surface: this.surface
            });
            this.surface.requestStartFromUser(this.game.start.bind(this.game));
        },

        onAudioReady: function () {
            console.log('audio is ready');
            if (this.levelloaded) {
                this.requestStart();
            }
            else {
                this.audioready = true;
            }
        },

        onAudioError: function (error) {
            console.error(error);
            alert(error);
            this.audiocontroller.close();
        },

        exitview: function () {

            analytics.trackAction('game', 'ending regularly', 'highscore:' + this.result.highscore);

            app.showAppContent('highscore', this.result);
        }
    });
    return PlayView;
});