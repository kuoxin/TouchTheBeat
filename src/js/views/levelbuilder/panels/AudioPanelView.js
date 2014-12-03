define([
    'jquery',
    'underscore',
    'Framework',
    'app',
    'text!templates/levelbuilder/panels/audio.html',
    'text!templates/components/trackpanel.html',
    'models/Track',
    'views/ErrorMessageView',
    'util/scripts',
    'lib/bootstrap'
], function ($, _, Framework, app, mainTemplate, trackPanelTemplate, Track, ErrorMessageView) {
    var MetaDataPanelView = Framework.View.extend({

        initialize: function () {
            this.randomtracks = [
                'https://soundcloud.com/maxfrostmusic/white-lies',
                'https://soundcloud.com/greco-roman/roosevelt-sea-1',
                //'https://soundcloud.com/t-e-e-d/garden',
                'https://soundcloud.com/homoheadphonico/phantogram-don-t-move',
                //'https://soundcloud.com/etagenoir/parov-stelar-catgroove', it does no longer exist
                'https://soundcloud.com/fosterthepeoplemusic/pumpedupkicks',
                'https://soundcloud.com/benkhan/savage'
                //'https://soundcloud.com/kooksmusic/forgive-forget'
            ];
        },

        render: function (model) {
            this.model = model;
            this.track = new Track(this.model.get('audio').attributes);
            var template = _.template(mainTemplate, {});
            this.$el.html(template);
            if (this.track.get('title')) {
                this.$("#input_entertrack").val(audio.permalinkUrl);
                this.updateTrackPanel();
            }
            this.listenTo(this.model, 'change:audio', this.updateTrackPanel.bind(this));
        },

        onClose: function () {
            "use strict";
        },

        events: {
            'click #btn_entertrack': 'enteredTrack',
            'click #btn_recommendedtrack': 'selectedRandomTrack',
            'click #btn_gameobjectrecorder': 'openGameObjectRecorder',
            'input #input_entertrack': 'enteredTrack'
        },

        enteredTrack: _.debounce(function () {
            var self = this;
            this.track.clear({silent: true});

            // validating the url string locally
            var valid = this.track.set({
                url: this.$("#input_entertrack").val()
            }, {
                validate: true
            });
            if (valid) {
                // client validation succeeded

                //fetching server resource
                this.track.fetch({
                    data: this.track.toJSON(),
                    success: function (track) {
                        "use strict";
                        // the attribute url will be removed from the model if the response is a streamable track
                        if (!track.has('url')) {
                            self.model.set('audio', new Track(track.attributes));
                        }
                    },
                    error: function (track, errormessage) {
                        "use strict";
                        if (errormessage == 'AUDIOPROVIDER_ERROR')
                            errormessage = Track.errorMessages.SOUNDCLOUDERROR;
                        self.showError(errormessage);
                    }
                });
            }
            else {
                // client validation failed
                this.showError(this.track.validationError);
            }

        }, 300),

        selectedRandomTrack: function () {
            var random = this.randomtracks[Math.floor(Math.random() * (this.randomtracks.length))];
            $("#input_entertrack").val(random);
            this.enteredTrack();
        },

        showError: function (errorMessage) {
            this.$('#audio_inputgroup').removeClass('has-success').addClass('has-error');
            this.$('#trackcontainer').html('');
            var errorview = new ErrorMessageView();
            errorview.render(errorMessage);
            this.$('#alert_tracknotfound_container').html(errorview.$el);
        },

        updateTrackPanel: function updateTrackPanel() {
            this.$('#audio_inputgroup').removeClass('has-error').addClass('has-success');
            var track = this.model.get('audio');
            this.$('#alert_tracknotfound_container').html('');
            this.$("#input_entertrack").val(track.get('permalinkUrl'));
            var template = _.template(trackPanelTemplate, track.toJSON());
            this.$('#trackcontainer').html(template);
            this.$('#trackinfo').fadeIn();
        }



    });
    return MetaDataPanelView;
});
