define([
  'jquery',
  'underscore',
  'backbone',
    'app',
  'text!templates/levelbuilder.html',
  'text!templates/trackpanel.html',
  'utils/SoundcloudLoader',
  '../gameclasses/Game',
  'gameclasses/TapObject',
    'views/audio',
  '../utils/scripts',
    'bootstrap'


], function ($, _, Backbone, app, levelbuilderTemplate, trackPanelTemplate, SoundcloudLoader, Game, TapObject, AudioController) {
    var dispatcher = _.clone(Backbone.Events);

    var LevelBuilderView = Backbone.View.extend({
        //TODO: create Templates for LevelEditor, improve code quality
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
            this.gameobjects = [];
            var template = _.template(levelbuilderTemplate, {});
            this.$el.html(template);

            $(window).bind("keypress.levelbuilder", this.handleKeyPress.bind(this));

            if (url != null){
                $("#input_entertrack").val(url);
                this.enteredTrack();
            }


        },

        onClose: function () {
            $(window).unbind("keypress.levelbuilder");

            if (this.audiocontroller)
                this.audiocontroller.dispose();
            this.audiocontroller = null;

        },

		events: {
			'click #btn_entertrack': 'enteredTrack',
			'click #btn_recommendedtrack': 'selectedRandomTrack',
			'click #btn_gameobjectpanel': 'openGameObjectPanel',
			'click #btn_testbutton': 'test',
			'click #btn_publish': 'openPublish',
            'click #btn_playnow': 'playLevelNow'
		},

		openGameObjectPanel: function openGameObjectPanel() {
			$("#btn_gameobjectpanel").attr("disabled", true);
			$("#progress").fadeIn();
			$("#btn_gameobjectpanel").fadeOut();
            $('#player').trigger("play");
            this.updateProgressIndicator();
		},

		openPublish: function openPublish() {
            this.createLevel();
			$("#leveljsoncontainer").html(JSON.stringify(this.level));
            $("#publish").slideUp();
            $("#finished").slideDown();
		},

        playLevelNow: function(){
            app.startlevel(this.level);
        },


        handleKeyPress : function(e){
            var player = $('#player');
            if (!player[0].paused)
            {
                console.log("legitimate tapobject "+e.keyCode);
                if (e.keyCode == 32)
                {
                    console.info('added tapobject at ' + player[0].currentTime);
                    this.addTapObjectAtRandomPosition(player[0].currentTime);

                }
            }
        },

        addTapObjectAtRandomPosition: function (timestamp) {
            var x = Game.prototype.getRandomInteger(TapObject.prototype.radius, Game.prototype.width - TapObject.prototype.radius);
            var y = Game.prototype.getRandomInteger(TapObject.prototype.radius, Game.prototype.height - TapObject.prototype.radius);
            this.gameobjects.push({"type": "Tap", "x": x, "y": y, "taptime": timestamp});
        },


        enteredTrack: function () {
            if ($("#input_entertrack").val() == ''){
                this.loading_error();
                return;
            }

			SoundcloudLoader.loadStream($("#input_entertrack").val(), this.loading_success.bind(this), this.loading_error.bind(this));
		},

		selectedRandomTrack: function () {
            var random = this.randomtracks[Math.floor(Math.random() * (this.randomtracks.length))];
            console.log('random: '+random);
            $("#input_entertrack").val(random);
			this.enteredTrack();
		},

		loading_success: function (sound) {
            this.sound = sound;
			$("#alert_tracknotfound").slideUp();
            Backbone.history.navigate('/buildlevel/'+ encodeURIComponent($("#input_entertrack").val()));
            this.updateTrackPanel(
                {
                // if no track artwork exists, use the user's avatar.
                imageurl : this.sound.artwork_url ? this.sound.artwork_url : this.sound.user.avatar_url,
                artisturl : this.sound.user.permalink_url,
                trackurl :  this.sound.permalink_url,
                artist: this.sound.user.username,
                track: this.sound.title
            });

            this.audiocontroller = new AudioController();
            this.audiocontroller.setCallbacks(this.onAudioStarted.bind(this), this.capturingfinished.bind(this), this.onAudioReady.bind(this), this.onAudioError.bind(this));
            this.audiocontroller.render(SoundcloudLoader.getStreamUrl(this.sound.stream_url));
			$("#trackinfo").fadeIn();
			$("#trackselection").slideUp();
		},

        onAudioReady: function () {
            $('#btn_gameobjectpanel').removeAttr('disabled');
        },

        onAudioStarted: function () {
            this.audioisplaying = true;
            this.updateProgressIndicator();
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
		},

		capturingfinished: function () {
            this.audioisplaying = false;
			$("#gameObjectPanel").fadeOut();
			$("#instructions").slideUp();
			$("#publish").fadeIn();
		},

		updateProgressIndicator: function () {
            $("#progressbar").css('width', Math.floor(this.audiocontroller.getPercentage() * 1000) / 10 + '%');
            if (this.audioisplaying) {
                requestAnimationFrame(this.updateProgressIndicator.bind(this));
			}
		},

		createLevel: function () {
            var level = {};
            level.audio = {};
            level.audio.stream_url = this.sound.stream_url;
            level.audio.permalink_url = this.sound.permalink_url;
            level.gameobjects = this.gameobjects;
            level.name = $("#levelname").val();
            this.level = level;
		}
	});
	return LevelBuilderView;
});
