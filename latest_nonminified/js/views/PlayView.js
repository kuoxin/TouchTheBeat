define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/play.html',
    'app',
    'util/SoundcloudLoader',
    'views/applicationwithmenu',
    'gameclasses/Game',
    'util/analytics',
    'views/audio',
    'util/scripts'

], function ($, _, Backbone, playTemplate, app, SoundCloudLoader, ApplicationWithMenuView, Game, analytics, AudioController) {
    var PlayView = Backbone.View.extend({
        el: '#body',

        // this.game.start();
        //analytics.trackAction('game', 'starting', 'now');
        onClose: function () {
            console.log('onclose event fired');
            if (this.startobj != null) {
                console.log('closing game');
                analytics.trackAction('game', 'closing game');
                if (this.game != null)
                    this.game.stop();

                this.startobj = null;
                this.result = null;
            }

            if (this.audiocontroller) {
                this.audiocontroller.onClose();
                this.audiocontroller.dispose();
            }

            this.game = null;
            if (this.player)
                this.player.off();
        },

        stopGame: function () {
            analytics.trackAction('game', 'ending game');
            console.info('Now ending game.');
            this.game.stop();


            $('#svg').fadeTo(1500, 0, this.exitview.bind(this));

            this.result = {};
            this.result.highscore = this.game.calculateHighScore();
            this.result.level = this.level;

            this.audiocontroller.dispose();
        },

        render: function (level) {
            //TODO: Stop the game really when navigating away.
            Backbone.history.navigate('playlevel', false);
            this.onClose();

            this.level = level;
            var template = _.template(playTemplate, {});
            this.$el.html(template);

            this.audiocontroller = new AudioController();
            this.audiocontroller.setCallbacks(this.onAudioStarted.bind(this), this.stopGame.bind(this), this.onAudioReady.bind(this), this.onAudioError.bind(this));
            this.audiocontroller.render(SoundCloudLoader.getStreamUrl(this.level.audio.stream_url), true);

            this.game = new Game(this);


        },

        onAudioReady: function () {
            //TODO: show loading state / show when track starts
        },

        onAudioStarted: function () {
            this.game.start();
        },

        onAudioError: function () {
            console.error('Audio error!!!!!');
            this.audiocontroller.onClose();
            this.audiocontroller.dispose();
        },

        getTimeDelta: function () {
            return this.audiocontroller.getCurrentTime();
        },

        exitview: function () {

            analytics.trackAction('game', 'ending regularly', 'highscore:' + this.result.highscore);

            app.setContent(app.router.highscoreview, this.result);
        }




    });
    return PlayView;
});