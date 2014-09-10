define([
    'jquery',
    'underscore',
    'backbone'

], function ($, _, Backbone) {
    var AudioController = Backbone.View.extend({
        el: '#player',

        onClose: function () {
            this.active = false;
            console.log('closing audio');
            if (this.request) {
                this.request.abort();
                this.request = null;
            }

            try {

                if (this.source) {
                    this.source.disconnect();
                    this.source.stop();
                    this.source = null;
                }
            } catch (e) {
            }
            ;
        },

        onended: function () {
            console.info('The audio has stopped');
            if (!this.notified_ended) {
                this.callback_ended();
                this.notified_ended = true;
            }
        },

        render: function (stream_url, playasap) {
            this.notified_ended = false;
            this.active = true;

            this.inittime = null;

            this.playasap = playasap;

            try {
                window.AudioContext = window.AudioContext || window.webkitAudioContext;
                this.context = new AudioContext();

                var request = new XMLHttpRequest();
                request.open('GET', stream_url, true);
                request.responseType = 'arraybuffer';

                request.addEventListener("progress", this.passloadingpercentage.bind(this), false);

                var loader = function (e) {
                    if (this.audioloaderview) {
                        this.audioloaderview.hideLoadingIndicator();
                        this.audioloaderview.showProcessingInformation();
                    }

                    if (this.active)
                        this.context.decodeAudioData(request.response, this.initsound.bind(this), this.callback_error);
                }.bind(this);

                request.onload = loader;
                console.log('loading audio');
                this.request = request;
                this.request.send();
            }

            catch (e) {
                console.error(e);
                this.callback_error('Web Audio API is not supported in this browser');
                return;
            }
        },

        passloadingpercentage: function (evt) {
            if (evt.lengthComputable) {
                var percent = evt.loaded / evt.total;
                if (this.audioloaderview)
                    this.audioloaderview.setProgress(percent);

            }
        },

        initsound: function (buffer) {
            console.log('init sound');
            if (!this.active)
                return;
            var source = this.context.createBufferSource();
            source.buffer = buffer;
            source.connect(this.context.destination);
            source.onended = this.onended.bind(this);
            this.source = source;

            if (this.audioloaderview)
                this.audioloaderview.hideProcessingInformaion();

            this.callback_readytoplay();

        },

        start: function () {
            this.source.start(0);
            this.inittime = this.context.currentTime;
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

        },

        attachAudioLoadingView: function (audioloaderview) {
            this.audioloaderview = audioloaderview;
        }

    });
    return AudioController;
});