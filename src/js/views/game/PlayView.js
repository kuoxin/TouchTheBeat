define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/play.html',
    'app',
    'models/Track',
    'gameclasses/Game',
    'util/analytics',
    'util/AudioController',
    'util/scripts'

], function ($, _, Backbone, playTemplate, app, Track, Game, analytics, AudioController) {
    var PlayView = Backbone.View.extend({
        el: '#body',

        onClose: function () {
            console.log('onclose event fired');
            analytics.trackAction('game', 'closing game');
            if (this.game != null)
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

            this.audioloaderview = app.router.views.audioloaderview;
            this.audioloaderview.render();


            this.audiocontroller = new AudioController();
            this.audiocontroller.attachAudioLoadingView(this.audioloaderview);
            this.audiocontroller.setCallbacks(this.onAudioStarted.bind(this), this.stopGame.bind(this), this.onAudioReady.bind(this), this.onAudioError.bind(this));
            this.audiocontroller.render(this.level.get('audio').getStreamUrl(), true);


        },

        onAudioReady: function () {
            this.game = new Game(this.level, this.audiocontroller);
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