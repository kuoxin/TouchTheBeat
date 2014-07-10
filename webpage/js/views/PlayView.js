define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/play.html',
    'snap',
    'utils/SoundcloudLoader',
    'views/applicationwithmenu',
    'views/highscore',
    'gameclasses/Surface',
    'gameclasses/TapObject',
    '../utils/scripts',

], function ($, _, Backbone, playTemplate, Snap, SoundCloudLoader, ApplicationWithMenuView, HighScoreView, Surface, TapObject) {
    var PlayView = Backbone.View.extend({
        el: '#body',
        time: 0,
        endtime: 0,
        gameobjects: [],
        stopped: true,
        game: {},
        levelready: false,

        render: function (level) {
            this.level = level;
            var template = _.template(playTemplate, {});
            this.$el.html(template);
            this.player = $('#player');

            this.player[0].addEventListener('loadedmetadata', this.start.bind(this));
            this.player.attr('src', SoundCloudLoader.getStreamUrl(this.level.audio.stream_url));
            this.setup();
            $('#player').trigger("play");
            this.updateinterval = setInterval(this.update.bind(this), 1000 / 60);
            console.log('started, '+ !$('#player')[0].paused)

        },

        setup: function () {
            this.surface = new Surface(this);
            for (i = 0; i < this.level.gameobjects.length; i++) {
                var gameobject = this.level.gameobjects[i];
                switch (gameobject.type) {
                    case 'Tap':
                        //console.log("TapObject detected");
                        this.gameobjects.push(new TapObject(this.surface, gameobject.taptime, gameobject.x, gameobject.y));
                        console.info('tapobject detected');
                        break;
                    default:
                        console.error("undefined gameobject detected")
                }
            }
            this.levelready = true;

        },


        start: function () {
            //TODO Countdown / Smooth Transition to playing
            console.log('loaded metadata');
        },

        getTimeDelta: function () {
            return this.player[0].currentTime;
        },


        update: function () {
            if (this.getTimeDelta() + this.starttime >= this.endtime) {
                this.stop();
            }

            for (var i = 0; i < this.gameobjects.length; i++) {
                this.gameobjects[i].update(this.getTimeDelta());
            }


        },

        /*		updateView: function () {
         if (!this.stopped) {
         for (var i = 0; i < this.gameobjects.length; i++) {
         gameobjects[i].updateView(this.getTimeDelta());
         }
         requestAnimationFrame(this.updateView.bind(this));
         }
         },*/

        stop: function () {
            clearInterval(this.updateinterval);
            this.stopped = true;
            console.log("now stopped");
            console.log('length: ' + this.getTimeDelta());
            console.log(this);

            $('#svg').fadeTo(1500,0, this.exitview.bind(this));

            this.game = {};
            this.game.highscore = this.calculateHighScore();
            this.game.level = this.level;


        },

        exitview: function(){
            var applicationwithmenuview = new ApplicationWithMenuView();
            applicationwithmenuview.render();
            var highscoreview = new HighScoreView();
            highscoreview.render(this.game);
        },

        calculateHighScore: function () {
            //var highscores = [];
            var highscoresum = 0;

            for (var i = 0; i < this.gameobjects.length; i++) {
                //highscores.push(this.gameobjects[i].getHighScore());
                highscoresum += this.gameobjects[i].getHighScore();
            }

            var highscoreaverage = highscoresum / this.gameobjects.length;
            var highscore = (highscoreaverage * 100).toFixed(1) + '%';

            console.log('HighScore: ' + highscore);

            return highscore;
        }



    });
    return PlayView;
});