define([
    'jquery',
    'underscore',
    'backbone',
    'app',
    'text!templates/levelbuilder/panels/audio.html',
    'text!templates/components/trackpanel.html',
    'util/SoundcloudLoader',
    'util/scripts',
    'bootstrap'
], function ($, _, Backbone, app, mainTemplate, trackPanelTemplate, SoundcloudLoader) {
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
            if (audio.title) {
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
            'click #btn_gameobjectrecorder': 'openGameObjectRecorder'
        },

        enteredTrack: function () {
            if (this.$("#input_entertrack").val() == '') {
                this.loading_error();
                return;
            }

            SoundcloudLoader.loadStream(this.$("#input_entertrack").val(), this.loading_success.bind(this), this.loading_error.bind(this));
        },

        selectedRandomTrack: function () {
            console.log('click');
            var random = this.randomtracks[Math.floor(Math.random() * (this.randomtracks.length))];
            console.log('random: ' + random);
            $("#input_entertrack").val(random);
            this.enteredTrack();
        },


        loading_success: function (data) {
            app.getLevelEditorModel().setSoundcloudAudio(data);
        },


        loading_error: function (errorMessage) {
            console.error(errorMessage);
            this.$("#alert_tracknotfound_text").html(errorMessage);
            this.$("#alert_tracknotfound").slideDown();
        },

        updateTrackPanel: function updateTrackPanel() {
            var sound = app.getLevelEditorModel().get('audio');
            this.$("#input_entertrack").val(sound.permalinkUrl);
            var template = _.template(trackPanelTemplate, sound);
            this.$('#trackcontainer').html(template);
            this.$('#trackinfo').fadeIn();
        }



    });
    return MetaDataPanelView;
});
