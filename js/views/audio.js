define([
    'jquery',
    'underscore',
    'backbone',
    'app',
    'utils/analytics'

], function ($, _, Backbone, app, analytics) {
    var AudioController = Backbone.View.extend({
        el: '#player',

        onClose: function () {
            console.log('closing audio');
            if (this.request) {
                this.request.abort();
                this.request = null;
            }

            if (this.source) {
                this.source.disconnect();
                this.source.stop();
                this.source = null;
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
            this.notified_error = false;
            this.notified_success = false;
            this.notified_readytoplay = false;
            this.notified_ended = false;

            this.inittime = null;

            this.playasap = playasap;

            try {
                window.AudioContext = window.AudioContext || window.webkitAudioContext;
                this.context = new AudioContext();

                var request = new XMLHttpRequest();
                request.open('GET', stream_url, true);
                request.responseType = 'arraybuffer';

                var loader = function (e) {
                    this.context.decodeAudioData(request.response, this.initsound.bind(this), this.callback_error);
                }.bind(this);

                request.onload = loader;
                console.log('loading audio');
                this.request = request;
                this.request.send();
            }

            catch (e) {
                alert('Web Audio API is not supported in this browser');
            }
        },

        initsound: function (buffer) {
            var source = this.context.createBufferSource();
            source.buffer = buffer;
            source.connect(this.context.destination);
            source.onended = this.onended.bind(this);
            source.start(0);
            console.log('started');
            this.inittime = this.context.currentTime;
            this.source = source;
            this.callback_started();
        },

        setCallbacks: function (callback_started, callback_ended, callback_readytoplay, callback_error) {
            this.callback_ended = callback_ended;
            this.callback_started = callback_started;
            this.callback_readytoplay = callback_readytoplay;
            this.callback_error = callback_error;
        },

        getCurrentTime: function () {
            return this.context.currentTime - this.inittime;
        },

        getPercentage: function () {
            return this.getCurrentTime() / this.getDuration();
        },

        getDuration: function () {
            return this.source.buffer.duration;

        }

    });
    return AudioController;
});