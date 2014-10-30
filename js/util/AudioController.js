define([
    'jquery',
    'underscore',
    'backbone',
    'app'
], function ($, _, Backbone, app) {
    var AudioController = function () {
    };
    AudioController.prototype = _.extend(AudioController.prototype, {
        cache: [],

        dispose: function () {
            this.onClose();
        },

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
        },

        onended: function () {
            console.info('The audio has stopped');
            if (!this.notified_ended) {
                this.callback_ended();
                this.notified_ended = true;
            }
        },

        render: function (stream_url) {

            this.notified_ended = false;
            this.active = true;

            this.inittime = null;

            this.stream_url = stream_url;

            try {
                if (this.cache[stream_url] != undefined) {
                    console.info('Reading audio-buffer from cache.');
                    this.initsound(this.cache[stream_url]);
                    return;
                }

                var request = new XMLHttpRequest();
                request.open('GET', stream_url, true);
                request.responseType = 'arraybuffer';

                request.addEventListener("progress", this.passloadingpercentage.bind(this), false);

                var loader = function () {
                    if (this.audioloaderview) {
                        this.audioloaderview.hideLoadingIndicator();
                        this.audioloaderview.showProcessingInformation();
                    }

                    if (this.active) {
                        app.audiocontext.decodeAudioData(request.response, this.initsound.bind(this), this.callback_error);
                    }
                }.bind(this);

                request.onload = loader;
                this.request = request;
                this.request.send();
            }

            catch (e) {
                console.error(e);
                this.callback_error('Web Audio API is not supported in this browser');
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

            if (this.cache[this.stream_url] == undefined)
                this.cache[this.stream_url] = buffer;

            var source = app.audiocontext.createBufferSource();
            source.buffer = buffer;
            source.connect(app.audiocontext.destination);
            source.onended = this.onended.bind(this);
            this.source = source;

            if (this.audioloaderview)
                this.audioloaderview.hideProcessingInformaion();

            this.callback_readytoplay();

        },


        start: function () {
            this.source.start(0);
            this.inittime = app.audiocontext.currentTime;
            this.callback_started();
        },

        setCallbacks: function (callback_started, callback_ended, callback_readytoplay, callback_error) {
            this.callback_ended = callback_ended;
            this.callback_started = callback_started;
            this.callback_readytoplay = callback_readytoplay;
            this.callback_error = callback_error;
        },

        getCurrentTime: function () {
            return app.audiocontext.currentTime - this.inittime;
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