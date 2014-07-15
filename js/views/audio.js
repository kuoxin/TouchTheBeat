define([
    'jquery',
    'underscore',
    'backbone',
    'app',
    'utils/analytics'

], function ($, _, Backbone, app, analytics) {
    var AudioController = Backbone.View.extend({
        el: '#player',

        events: {
            'play': 'onplay',
            'pause': 'onpause',
            'canplaythrough': 'oncanplaythrough',
            'oncanplay': 'oncanplay',
            'suspend': 'onsuspend',
            'durationchange': 'ondurationchange',
            'progress': 'onprogress',
            'ended': 'onended',
            'timeupdate': 'ontimeupdate',
            'loadedmetadata': 'onloadedmetadata',
            'playing': 'onplaying',
            'abort': 'onabort',
            'error': 'onerror',
            'stalled': 'onstalled'
        },

        /*
         onprogress : function(){
         console.info('The audio is loading...');
         },

         onplay: function(){
         console.info('play action triggered');
         },

         ondurationchange : function(){
         console.info('The audio duration changed.');
         },

         onloadedmetadata: function () {
         console.info('The audio loaded the metadata successfully.');
         },
         */

        onerror: function () {
            console.log('audio error.');
            if (!this.notified_error) {
                this.notified_error = true;
                this.callback_error();
            }
            this.remove();
        },

        onabort: function () {
            console.log('audio aborted.');
            if (!this.notified_error) {
                this.notified_error = true;
                this.callback_error();
            }
            this.remove();
        },

        ontimeupdate: function () {
            if (!this.startobj && this.el.currentTime == 0) {

                this.startobj = {};
                this.startobj.time = window.performance.now();
                this.startobj.currentTimeDif = 0;
            }

            if (!this.el.paused) {

                if (this.desperateTimeout) {
                    clearTimeout(this.desperateTimeout);
                    this.desperateTimeout = null;
                }
                if (!this.notified_success) {
                    this.notified_success = true;
                    this.callback_started();
                }
            }

            if (this.startobj != undefined) {
                var low = this.el.currentTime;

                var high = this.getCurrentTime();

                var diff = (high - low) * 1000;
                //console.log('The audio time was updated. diff: ' + Math.floor(diff) + ' highprec:' + Math.floor(high * 100) / 100 + ' audio: ' + Math.floor(low * 100) / 100 + ' correction: ' + Math.floor(this.startobj.time / 10) / 100);
                if (Math.abs(diff) > 80) {
                    this.startobj.time += (diff);
                    analytics.trackAction('game', 'correctedTimeDifference', diff >= 0 ? 'positive' : 'negative', Math.abs(diff));
                    console.warn('corrected time: ' + (diff));
                }
            }

        },

        stalled: function () {
            console.warn('The audio was stalled.');
        },

        oncanplaythrough: function () {
            console.log('The audio can probably play through until the end now.');
            this.canplaythrough = true;

            if (this.playbackwaiting) {
                this.$el.trigger("play");
            }

            if (!this.notified_readytoplay) {
                this.notified_readytoplay = true;
                this.callback_readytoplay();
            }

        },

        onpaused: function () {
            console.warn('The audio was paused...');
            if (this.duration != 0 && this.duration == this.el.currentTime) {
                console.info('The audio has stopped (detected in pause event)');
                if (!this.notified_ended) {
                    this.notified_ended = true;
                    this.callback_ended();
                }
            }
        },

        onended: function () {
            console.info('The audio has stopped');
            if (!this.notified_ended) {
                this.callback_ended();
                this.notified_ended = true;
            }
        },

        render: function (stream_url, playasap) {
            this.canplaythrough = false;
            this.playbackwaiting = false;
            this.notified_error = false;
            this.notified_success = false;
            this.notified_readytoplay = false;
            this.notified_ended = false;

            this.startobj = null;

            this.playasap = playasap;


            this.$el.attr('src', stream_url);
            if (this.playasap)
                this.triggerPlay();

        },

        triggerPlay: function () {
            if (this.canplaythrough || this.playasap) {
                this.$el.trigger("play");
            }
            else {
                console.info('The audio is waiting with playback until pre-buffering is done');
                this.playbackwaiting = true;
                this.desperateTimeout = setTimeout(this.ondesperateTimeout.bind(this), 3000);
            }
        },

        ondesperateTimeout: function () {
            console.warn('triggered desperate timeout');

            this.$el.trigger("play");

            setTimeout(function () {
                console.log(this.el.paused);
                if (this.el.paused && !this.notified_error) {
                    this.notified_error = true;
                    this.callback_error();
                }

                if (!this.el.paused) {
                    this.notified_success = true;
                    this.callback_started();
                }
            }.bind(this), 500);

        },

        setCallbacks: function (callback_started, callback_ended, callback_readytoplay, callback_error) {
            this.callback_ended = callback_ended;
            this.callback_started = callback_started;
            this.callback_readytoplay = callback_readytoplay;
            this.callback_error = callback_error;
        },


        getCurrentTime: function () {
            if (this.startobj)
                return (window.performance.now() - this.startobj.time) / 1000;
            else
                return 0;
        },

        getDuration: function () {
            return this.el.duration;
            ;

        }

    });
    return AudioController;
});