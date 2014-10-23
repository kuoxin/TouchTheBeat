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

        render: function () {
            var template = _.template(mainTemplate, {});
            this.$el.html(template);
            var audio = app.getLevelEditorModel().get('audio');
            if (audio.get('title')) {
                this.$("#input_entertrack").val(audio.permalinkUrl);
                this.updateTrackPanel();
            }

            this.listenTo(app.getLevelEditorModel(), 'change:audio', this.updateTrackPanel.bind(this));
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
            if (this.$("#input_entertrack").val() == '') {
                this.loading_error();
                return;
            }

            var track = new Track();
            track.fetch({
                data: {
                    url: this.$("#input_entertrack").val()
                },
                success: function (track) {
                    console.log('setting audio');
                    app.getLevelEditorModel().set('audio', track);
                },
                error: this.loading_error.bind(this)
            });
        },

        selectedRandomTrack: function () {
            console.log('click');
            var random = this.randomtracks[Math.floor(Math.random() * (this.randomtracks.length))];
            console.log('random: ' + random);
            $("#input_entertrack").val(random);
            this.enteredTrack();
        },


        loading_error: function (errorMessage) {
            console.error(errorMessage);
            this.$('#audio_inputgroup').removeClass('has-success').addClass('has-error');
            this.$('#trackcontainer').html('');
            var errorview = new ErrorMessageView();
            console.log(errorview.render(errorMessage));
            this.$('#alert_tracknotfound_container').html(errorview.$el);

            //this.$("#alert_tracknotfound_text").html(errorMessage);
            //this.$("#alert_tracknotfound").slideDown();

        },

        updateTrackPanel: function updateTrackPanel() {
            this.$('#audio_inputgroup').removeClass('has-error').addClass('has-success');
            var track = app.getLevelEditorModel().get('audio');
            this.$('#alert_tracknotfound_container').html('');
            this.$("#input_entertrack").val(track.get('permalinkUrl'));
            console.log(track);
            var template = _.template(trackPanelTemplate, track.toJSON());
            this.$('#trackcontainer').html(template);
            this.$('#trackinfo').fadeIn();
        }



    });
    return MetaDataPanelView;
});
