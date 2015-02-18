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
	'views/GameMenuView',
    'util/scripts'

], function ($, _, Framework, playTemplate, app, Track, Game, analytics, AudioController, AudioLoadingRenderer, Surface, GameMenuView) {
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

		onPause: function () {
			this.gameMenu.open();
		},

		onResume: function () {
			this.gameMenu.close();
		},


        stopGame: function () {
            this.game.stop();

			$('#playdiv').fadeTo(1500, 0, this.exitview.bind(this));

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
            this.audioready = false;
			this.levelloaded = false;

			this.level.fetch({
				success: function () {
					"use strict";
					that.levelloaded = true;
					console.log('level loaded');
					if (that.audioready) {
						that.requestStart();
					}
				}
			});
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

			this.gameMenu = new GameMenuView(this.game);
			this.$('#playdiv').append(this.gameMenu.render().$el);

			this.listenTo(this.game, 'pause', this.onPause);
			this.listenTo(this.game, 'resume', this.onResume);

            this.surface.requestStartFromUser(this.game.start.bind(this.game));
        },

        onAudioReady: function () {
			this.audioready = true;
            console.log('audio is ready');
            if (this.levelloaded) {
                this.requestStart();
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
