define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/play.html',
    'app',
    'utils/SoundcloudLoader',
    'views/applicationwithmenu',
    '../gameclasses/Game',
    '../utils/scripts'

], function ($, _, Backbone, playTemplate, app, SoundCloudLoader, ApplicationWithMenuView, Game) {
    var PlayView = Backbone.View.extend({
        el: '#body',

        events: {
            'play #player' : 'listenToAudioStarted',
            'pause #player' : 'listenToAudioPaused',
            'canplaythrough #player' : 'listenToAudioCanPlayThrough',
            'oncanplay #player' : 'listenToAudioCanPlay',
            'suspend #player' : 'listenToAudioStalled',
            'durationchange #player' : 'listenToAudioDurationChange',
            'progress #player' : 'listenToAudioLoadingProgress'

        },

        listenToAudioLoadingProgress : function(){
            console.log('The audio is loading...');
        },

        listenToAudioDurationChange : function(){
            console.log('The audio duration changed.');
        },

        listenToAudioTimeUpdated : function() {
            if (this.startobj == undefined && this.player[0].currentTime == 0) {
                console.info('The audio seems to have started playing. starting game loop...');
                this.startobj = {};
                this.startobj.time = window.performance.now();
                this.startobj.currentTimeDif = 0;
                this.game.start();
            }

            if (this.startobj != undefined) {


            var low = this.player[0].currentTime;

            var high = this.getTimeDelta();

            var diff = (high - low) * 1000;
            //console.log('The audio time was updated. diff: ' + Math.floor(diff) + ' highprec:' + Math.floor(high * 100) / 100 + ' audio: ' + Math.floor(low * 100) / 100 + ' correction: ' + Math.floor(this.startobj.time / 10) / 100);


            if (Math.abs(diff) > 80) {
                this.startobj.time += (diff);
                console.warn('corrected time: ' + (diff));
            }
        }

        },

        onClose: function () {


            if (this.startobj != null) {
                console.log('closing game');
                if (this.game != null)
                    this.game.stop();

                this.startobj = null;
                this.result = null;
            }

            this.game = null;
            if (this.player)
                this.player.off();
        },

        listenToAudioStalled : function(){
          console.warn('The audio was stalled.');
        },

        listenToAudioCanPlay : function(){
            console.log('The audio can play.');
        },

        listenToAudioCanPlayThrough : function(){
            console.log('The audio can probably play through until the end.');
        },

        listenToAudioStarted : function() {
           /* console.log('NETWORK_STATE: '+ $('#player')[0].networkState );
            console.log('READY_STATE: '+ $('#player')[0].readyState );
            console.log('startTime: '+ $('#player')[0].startTime );
            console.log('currentTime: '+ $('#player').currentTime);
            */

                //this means the game has started or the audio started again from pause-state
                //i do not have find a way yet to detect when the audio is not starting due to autoplay restrictions
                console.info('The play-audio action was triggered.');


        },

        listenToAudioPaused : function(){
            console.warn('The audio was paused...');
            //TODO: Handle
        },

        listenToAudioEnded : function(){
            console.info('The audio has stopped. Now ending game.');
            this.game.stop();
            this.stop();
        },

        render: function (level) {
            //TODO: Stop the game really when navigating away.

            Backbone.history.navigate('playlevel', false);
            this.onClose();

            this.level = level;
            var template = _.template(playTemplate, {});
            this.$el.html(template);
            this.player = $('#player');

            this.player.on("timeupdate", this.listenToAudioTimeUpdated.bind(this));
            this.player.on('ended', this.listenToAudioEnded.bind(this));
            this.player.on('loadedmetadata', this.loadedmetadata.bind(this));
            this.player.attr('src', SoundCloudLoader.getStreamUrl(this.level.audio.stream_url));
            this.game = new Game(this);
            $('#player').trigger("play");

        },

        loadedmetadata: function () {
            console.info('The audio loaded the metadata successfully.');
        },

        getTimeDelta: function () {
            return (window.performance.now() - this.startobj.time)/1000;
        },

        stop: function () {
            console.log("now stopped");

            $('#svg').fadeTo(1500,0, this.exitview.bind(this));

            this.result = {};
            this.result.highscore = this.game.calculateHighScore();
            this.result.level = this.level;


        },

        exitview: function(){
            app.setContent(app.router.highscoreview, this.result);
        }




    });
    return PlayView;
});