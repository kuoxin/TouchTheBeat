define([
    'jquery',
    'underscore',
    'backbone',
    'app',
    'text!templates/levelbuilder/audioselector.html',
    'text!templates/trackpanel.html',
    'util/SoundcloudLoader',
    'util/scripts',
    'bootstrap'


], function ($, _, Backbone, app, audioselectorTemplate, trackPanelTemplate, SoundcloudLoader) {
    var AudioSelectorView = Backbone.View.extend({
        el: '#content',

        initialize: function () {
            this.randomtracks = [
                'https://soundcloud.com/maxfrostmusic/white-lies',
                'https://soundcloud.com/greco-roman/roosevelt-sea-1',
                'https://soundcloud.com/t-e-e-d/garden',
                'https://soundcloud.com/homoheadphonico/phantogram-don-t-move',
                'https://soundcloud.com/etagenoir/parov-stelar-catgroove',
                'https://soundcloud.com/fosterthepeoplemusic/pumpedupkicks',
                'https://soundcloud.com/benkhan/savage',
                'https://soundcloud.com/kooksmusic/forgive-forget'
            ];
        },

        render: function (url) {
            var template = _.template(audioselectorTemplate, {});
            this.$el.html(template);


            if (url != null) {
                $("#input_entertrack").val(url);
                this.enteredTrack();
            }


        },

        onClose: function () {
            // the audiocontroller will be passed to another view and that is why it cannot be disposed here
        },

        events: {
            'click #btn_entertrack': 'enteredTrack',
            'click #btn_recommendedtrack': 'selectedRandomTrack',
            'click #btn_gameobjectrecorder': 'openGameObjectRecorder'
        },

        enteredTrack: function () {
            if ($("#input_entertrack").val() == '') {
                this.loading_error();
                return;
            }

            SoundcloudLoader.loadStream($("#input_entertrack").val(), this.loading_success.bind(this), this.loading_error.bind(this));
        },

        selectedRandomTrack: function () {
            var random = this.randomtracks[Math.floor(Math.random() * (this.randomtracks.length))];
            console.log('random: ' + random);
            $("#input_entertrack").val(random);
            this.enteredTrack();
        },

        openGameObjectRecorder: function openGameObjectRecorder() {
            app.setFullScreenContent(app.router.levelbuilder_gameobjectrecorderview, this.sound);
        },

        loading_success: function (sound) {
            this.sound = sound;
            $("#alert_tracknotfound").slideUp();
            Backbone.history.navigate('/buildlevel/' + encodeURIComponent($("#input_entertrack").val()));
            this.updateTrackPanel(
                {
                    // if no track artwork exists, use the user's avatar.
                    imageurl: this.sound.artwork_url ? this.sound.artwork_url : this.sound.user.avatar_url,
                    artisturl: this.sound.user.permalink_url,
                    trackurl: this.sound.permalink_url,
                    artist: this.sound.user.username,
                    track: this.sound.title
                });

            $("#trackinfo").fadeIn();
            $("#trackselection").slideUp();
        },

        onAudioError: function () {
            this.audioisplaying = false;
            this.loading_error('There was an error during audio playback. Sorry!');
            this.audiocontroller.dispose();
        },

        loading_error: function (errorMessage) {
            console.log("error");
            this.$("#alert_tracknotfound_text").html(errorMessage);
            this.$("#alert_tracknotfound").slideDown();
        },

        updateTrackPanel: function updateTrackPanel(data) {
            var template = _.template(trackPanelTemplate, data);

            $('#trackcontainer').html(template);

            $('#trackinfo').fadeIn();
        }

    });
    return AudioSelectorView;
});
