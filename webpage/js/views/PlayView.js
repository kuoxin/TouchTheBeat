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


            this.loader = new SoundCloudLoader(null, null);
            this.loader.loadStream(this.level.track, this.loading_success.bind(this), this.loading_error.bind(this));
            this.setup();
        },

        setup: function () {
            var template = _.template(playTemplate, {});
            this.$el.html(template);
            this.player = $('#player');

            this.surface = new Surface(this);

            for (i = 0; i < this.level.gameobjects.length; i++) {
                var gameobject = this.level.gameobjects[i];
                switch (gameobject.type) {
                    case "Tap":
                        //console.log("TapObject detected");
                        this.gameobjects.push(new TapObject(this.surface, gameobject.time, gameobject.x, gameobject.y));
                        break;
                    default:
                        console.error("undefined gameobject detected")
                }
            }
            console.log(this.gameobjects[0]);
            this.levelready = true;

        },

        loading_success: function () {
            console.log('loading from SoundCloud completed, level ready: ' + this.levelready);
            if (!this.levelready)
                setTimeout(this.loading_success.bind(this), 1000);
            else {
                this.player.attr('src', this.loader.streamUrl());
                this.player[0].addEventListener('loadedmetadata', this.start.bind(this));
            }

        },

        loading_error: function () {
            console.error('Error when loading Soundcloud track');
        },

        start: function () {
            //TODO Countdown / Smooth Transition to playing

            var a_player = this.player[0];

            this.starttime = new Date().getTime() / 1000;
            console.log(this.starttime);
            this.endtime = this.starttime + a_player.duration;
            this.updateinterval = setInterval(this.update.bind(this), 1000 / 60);
            this.player.trigger("play");

            console.log('now running');

            //this.updateView();
        },

        getTimeDelta: function () {
            return this.player[0].currentTime;
        },


        update: function () {
            //console.log('update: '+this.getTimeDelta());
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

            $('#svg').setOpacity(1000);

            var game = {};

            game.highscore = this.calculateHighScore();
            game.level = this.level;

            setTimeout(function () {
                //TODO: Smooth transition to HighScore View
                var applicationwithmenuview = new ApplicationWithMenuView();
                applicationwithmenuview.render();
                var highscoreview = new HighScoreView();
                highscoreview.render(game);
            }, 1500)

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