define([
    'jquery',
    'underscore',
    'Framework',
    'app'
], function ($, _, Framework, app) {
    "use strict";
    /**
     * to be initialized with the following arguments:
     * callback_started,
     * callback_ended,
     * callback_readytoplay,
     * callback_error,
     * renderer - an instance of AudioLoadingRenderer (optional)
     * @type {*|void}
     */
    var AudioController = Framework.Controller.extend({
        /**
         * cross AudioController-instance cache of audio-buffers
         */
        cache: [],

        initialize: function(options){
            console.log(options);
            _.extend(this, _.pick(options, [
                'callback_started',
                'callback_ended',
                'callback_readytoplay',
                'callback_error',
                'renderer'
            ]));
            console.log(this);
        },

        // callbacks - defaults
        callback_started: function(){},
        callback_ended: function(){},
        callback_readytoplay: function(){},
        callback_error: function(){},


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

        load: function (stream_url) {

            this.notified_ended = false;
            this.active = true;

            this.inittime = null;

            this.stream_url = stream_url;

            try {
                if (typeof this.cache[stream_url] !== 'undefined') {
                    console.info('Reading audio-buffer from cache.');
                    this.initsound(this.cache[stream_url]);
                    return;
                }

                var request = new XMLHttpRequest();
                request.open('GET', stream_url, true);
                request.responseType = 'arraybuffer';

                request.addEventListener("progress", this.passloadingpercentage.bind(this), false);

                var loader = function () {
                    this.renderer.hideLoadingIndicator();
                    this.renderer.showProcessingInformation();

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
                this.renderer.setProgress(percent);
            }
        },

        initsound: function (buffer) {
            console.log('init sound');
            if (!this.active)
                return;

            if (typeof this.cache[this.stream_url] === 'undefined')
                this.cache[this.stream_url] = buffer;

            var source = app.audiocontext.createBufferSource();
            source.buffer = buffer;
            source.connect(app.audiocontext.destination);
            source.onended = this.onended.bind(this);
            this.source = source;

            this.renderer.hideProcessingInformaion();

            this.callback_readytoplay();

        },

        start: function () {
            this.source.start(0);
            this.inittime = app.audiocontext.currentTime;
            this.callback_started();
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