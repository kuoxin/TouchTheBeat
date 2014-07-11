define([
  'jquery',
  'underscore',
  'backbone',
  'text!templates/levelbuilder.html',
  'text!templates/trackpanel.html',
  'utils/SoundcloudLoader',
  '../gameclasses/Game',
  'gameclasses/TapObject',
  'views/PlayView',
  '../utils/scripts',
  'bootstrap',

], function ($, _, Backbone, levelbuilderTemplate, trackPanelTemplate, SoundcloudLoader, Surface, TapObject, PlayView) {
	var LevelBuilderView = Backbone.View.extend({
        //TODO: create Templates for LevelEditor, improve code quality
		el: '#content',

        renderid : Math.random(),

		render: function (url) {
            console.log('render view '+url);
			var template = _.template(levelbuilderTemplate, {});
			this.$el.html(template);
			this.init();

            console.info('rendered view with id: '+this.renderid);
            if (url != null){
                $("#input_entertrack").val(url);
                this.enteredTrack();
            }
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
            console.log("open gameobject panel");
            console.log(this.player[0].duration);
			$("#btn_gameobjectpanel").attr("disabled", true);
			$("#progress").fadeIn();
			$("#btn_gameobjectpanel").fadeOut();
            $('#player').trigger("play");
            this.updateProgressIndicator();
		},

        start: function (){
          console.log('loaded metadata');
        },

		test: function test() {
			this.gameobjects.push(this.player[0].currentTime);
			console.log(this.gameobjects);
		},

		openPublish: function openPublish() {
            this.createLevel();
			$("#leveljsoncontainer").html(JSON.stringify(this.level));
            $("#publish").slideUp();
            $("#finished").slideDown();
		},

        playLevelNow: function(){
            var playview = new PlayView();
            playview.render(this.level);
        },

		init: function () {
			this.player = this.$('#player');
			this.gameobjects = [];
			this.randomtracks = [
                'https://soundcloud.com/maxfrostmusic/white-lies',
                'https://soundcloud.com/greco-roman/roosevelt-sea-1',
                'https://soundcloud.com/t-e-e-d/garden',
                'https://soundcloud.com/homoheadphonico/phantogram-don-t-move',
                'https://soundcloud.com/etagenoir/parov-stelar-catgroove',
                'https://soundcloud.com/fosterthepeoplemusic/pumpedupkicks',
                'https://soundcloud.com/benkhan/savage'
            ];

            $(window).keypress(this.handleKeyPress.bind(this));

		},

        handleKeyPress : function(e){
            var player = $('#player');
            if (!player[0].paused)
            {
                console.log("legitimate tapobject "+e.keyCode);
                if (e.keyCode == 32)
                {
                    console.info('added tapobject at '+player[0].currentTime+' in view-id: '+this.renderid);
                    var x = Game.prototype.getRandomInteger(TapObject.prototype.radius, Game.prototype.width - TapObject.prototype.radius);
                    var y = Game.prototype.getRandomInteger(TapObject.prototype.radius, Game.prototype.height - TapObject.prototype.radius);
                    this.addGameObject(player[0].currentTime,x,y);
                }
            }
        },

        addGameObject : function(time, x ,y){
            this.gameobjects.push({"type" : "Tap", "x": x, "y" : y, "taptime" : time});
        },

		enteredTrack: function () {
            console.info('clicked view with id: '+this.renderid);
            if ($("#input_entertrack").val() == ''){
                this.loading_error();
                return;
            }

            console.log('loading: '+$("#input_entertrack").val() );
			SoundcloudLoader.loadStream($("#input_entertrack").val(), this.loading_success.bind(this), this.loading_error.bind(this));
		},

		selectedRandomTrack: function () {
            var random = this.randomtracks[Math.floor(Math.random() * (this.randomtracks.length))];
            console.log('random: '+random);
            $("#input_entertrack").val(random);
			this.enteredTrack();
		},

		loading_success: function (sound) {
            console.log(sound);
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
            $('#player')[0].addEventListener('loadedmetadata', this.start.bind(this));
            this.player.attr('src', SoundcloudLoader.getStreamUrl(this.sound.stream_url));
			$("#trackinfo").fadeIn();
			$("#trackselection").slideUp();
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
			$("#gameObjectPanel").fadeOut();
			$("#instructions").slideUp();
			$("#publish").fadeIn();
		},

		updateProgressIndicator: function () {
			var percentage = this.player[0].currentTime * 1000 / this.sound.duration ;
            $("#progressbar").css('width', Math.floor(percentage * 1000) / 10 + '%');
			if (this.player[0].paused  && this.player[0].currentTime != 0) {
                this.capturingfinished();
			} else {
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