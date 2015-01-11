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
            this.startOffset = 0;
        },

        // callbacks - defaults
        callback_started: function(){},
        callback_ended: function(){},
        callback_readytoplay: function(){},
        callback_error: function(){},

        onClose: function () {
            if (this.active) {
                this.active = false;
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
            }
        },

        onended: function () {
            if (this.isPaused()) {
                console.info('The audio was paused at ' + this.getCurrentTime());
            }
            else {
                console.info('The audio has stopped');
                if (!this.notified_ended) {
                    this.callback_ended();
                    this.notified_ended = true;
                }
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
					this.renderer.hideLoadingIndicator();
					this.renderer.showProcessingInformation();
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
			if (!this.active) {
				return;
			}

			if (typeof this.cache[this.stream_url] === 'undefined') {
				this.cache[this.stream_url] = buffer;
			}

            this.buffer = buffer;

            this.renderer.hideProcessingInformaion();

            this.callback_readytoplay();

        },
        // thanks to http://chimera.labs.oreilly.com/books/1234000001552/ch02.html#s02_2 for the tutorial on how to pause and resume
        play: function () {
            this.inittime = app.audiocontext.currentTime;
            this.paused = false;

            var source = app.audiocontext.createBufferSource();
            source.buffer = this.buffer;
            source.connect(app.audiocontext.destination);
            source.onended = this.onended.bind(this);

            this.source = source;

            this.source.start(0, this.startOffset % this.buffer.duration);
			//console.info('The audio started at ' + this.getCurrentTime());
            this.callback_started();
        },

        pause: function () {
            this.source.stop();
            this.startOffset = this.getCurrentTime();
            this.paused = true;
        },

        getCurrentTime: function () {
			if (this.paused) {
				return this.startOffset % this.buffer.duration;
			}
			else {
				return app.audiocontext.currentTime - this.inittime + this.startOffset;
			}
        },

        isPaused: function () {
            return this.getCurrentTime() < this.getDuration();
        },

        getPercentage: function () {
            return this.getCurrentTime() / this.getDuration();
        },

        getDuration: function () {
            return this.buffer.duration;
        },

        attachAudioLoadingView: function (audioloaderview) {
            this.audioloaderview = audioloaderview;
        }

    });
    return AudioController;
});
