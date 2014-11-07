define([
    'jquery',
    'underscore',
    'backbone',
    'app',
    'text!templates/levelbuilder/panels/audio.html',
    'text!templates/components/trackpanel.html',
    'models/Track',
    'views/ErrorMessageView',
    'util/scripts',
    'bootstrap'
], function ($, _, Backbone, app, mainTemplate, trackPanelTemplate, Track, ErrorMessageView) {
    var MetaDataPanelView = Backbone.View.extend({

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
            var template = _.template(mainTemplate, {});
            this.$el.html(template);
            var audio = this.model.get('audio');
            if (audio.get('title')) {
                this.$("#input_entertrack").val(audio.permalinkUrl);
                this.updateTrackPanel();
            }

            this.listenTo(this.model, 'change:audio', this.updateTrackPanel.bind(this));
        },

        onClose: function () {
        },

        events: {
            'click #btn_entertrack': 'enteredTrack',
            'click #btn_recommendedtrack': 'selectedRandomTrack',
            'click #btn_gameobjectrecorder': 'openGameObjectRecorder',
            'input #input_entertrack': 'enteredTrack'
        },

        enteredTrack: function () {
            var self = this;
            if (this.$("#input_entertrack").val() == '') {
                this.loading_error();
                return;
            }

            var track = new Track();
            track.fetch({
                data: {
                    url: this.$("#input_entertrack").val()
                },
                success: this.loading_success.bind(this),
                error: this.loading_error.bind(this)
            });
        },

        loading_success: function (track) {
            this.model.set('audio', track);
        },


        selectedRandomTrack: function () {
            var random = this.randomtracks[Math.floor(Math.random() * (this.randomtracks.length))];
            $("#input_entertrack").val(random);
            this.enteredTrack();
        },


        loading_error: function (errorMessage) {
            console.error(errorMessage);
            this.$('#audio_inputgroup').removeClass('has-success').addClass('has-error');
            this.$('#trackcontainer').html('');
            var errorview = new ErrorMessageView();
            errorview.render(errorMessage);
            this.$('#alert_tracknotfound_container').html(errorview.$el);

            //this.$("#alert_tracknotfound_text").html(errorMessage);
            //this.$("#alert_tracknotfound").slideDown();

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
