define([
  'jquery',
  'underscore',
  'backbone',
  'text!templates/levelbuilder.html',
  'text!templates/trackpanel.html',
  'utils/SoundcloudLoader',
  'gameclasses/Surface',
  'gameclasses/TapObject',
  'views/PlayView',
  '../utils/scripts',
  'bootstrap',

], function ($, _, Backbone, levelbuilderTemplate, trackPanelTemplate, SoundcloudLoader, Surface, TapObject, PlayView) {
	var LevelBuilderView = Backbone.View.extend({
        //TODO: create Templates for LevelEditor, improve code quality
		el: '#content',

		render: function () {
			var template = _.template(levelbuilderTemplate, {});
			this.$el.html(template);
			this.init();
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
			$("#btn_gameobjectpanel").setOpacity();
			$('#player').trigger("play");
			console.log(this);
			this.updateProgressIndicator();

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
			this.loader = new SoundcloudLoader(null, null);
			this.gameobjects = [];
			this.randomtracks = [
                'https://soundcloud.com/maxfrostmusic/white-lies',
                'https://soundcloud.com/greco-roman/roosevelt-sea-1',
                'https://soundcloud.com/t-e-e-d/garden',
                'https://soundcloud.com/homoheadphonico/phantogram-don-t-move',
                'https://soundcloud.com/etagenoir/parov-stelar-catgroove',
                'https://soundcloud.com/fosterthepeoplemusic/pumpedupkicks'
            ];

			this.trackInfoPanel = document.getElementById('trackInfoPanel');
			this.infoImage = document.getElementById('infoImage');
			this.infoArtist = document.getElementById('infoArtist');
			this.infoTrack = document.getElementById('infoTrack');
			this.artistLink = document.createElement('a');
			this.trackLink = document.createElement('a');

            $(window).keypress(this.handleKeyPress.bind(this));

		},

        handleKeyPress : function(e){
            var player = $('#player');
            if (!player[0].paused)
            {
                console.log("legitimate tapobject "+e.keyCode);
                if (e.keyCode == 32)
                {

                    console.log(Surface.prototype);
                    var x = Surface.prototype.getRandomInteger(TapObject.prototype.radius, Surface.prototype.width - TapObject.prototype.radius);
                    var y = Surface.prototype.getRandomInteger(TapObject.prototype.radius, Surface.prototype.height - TapObject.prototype.radius);
                    console.log(x);
                    console.log(y);
                    this.addGameObject(player[0].currentTime,x,y);
                }
            }
        },

        addGameObject : function(time, x ,y){
            this.gameobjects.push({"type" : "Tap", "x": x, "y" : y, "taptime" : time});
        },

		enteredTrack: function () {
			console.log(this.loader);
			this.loader.loadStream($("#input_entertrack").val(), this.loading_success.bind(this), this.loading_error.bind(this));
		},

		selectedRandomTrack: function () {
			$("#input_entertrack").val(this.randomtracks[Math.floor(Math.random() * (this.randomtracks.length - 1))]);
			this.enteredTrack();
		},

		loading_success: function () {
			$("#alert_tracknotfound").slideUp();
			this.updateTrackPanel();
			this.player.attr('src', this.loader.streamUrl());
			$("#trackinfo").fadeIn();
			$("#trackselection").slideUp();
		},

		loading_error: function () {
			var self = this;
			console.log("error");
			console.log(this);
			console.log(self);
			this.$("#alert_tracknotfound_text").html(this.loader.errorMessage);
			this.$("#alert_tracknotfound").slideDown();
		},

		updateTrackPanel: function updateTrackPanel() {
            var template = _.template(trackPanelTemplate,
                {
                    // if no track artwork exists, use the user's avatar.
                    imageurl : this.loader.sound.artwork_url ? this.loader.sound.artwork_url : this.loader.sound.user.avatar_url,
                    artisturl : this.loader.sound.user.permalink_url,
                    trackurl :  this.loader.sound.permalink_url,
                    artist: this.loader.sound.user.username,
                    track: this.loader.sound.title
                });

            $('#trackcontainer').html(template);

			$('#trackinfo').fadeIn();

		},

		clearTrackPanel: function clearTrackPanel() {

			// first clear the current contents
			this.infoArtist.innerHTML = "";
			this.infoTrack.innerHTML = "";
			this.trackInfoPanel.className = 'hidden';

		},

		capturingfinished: function () {
			$("#gameObjectPanel").setOpacity();
			$("#instructions").slideUp();
			$("#publish").fadeIn();
		},

		updateProgressIndicator: function () {
			var percentage = this.player[0].currentTime / this.player[0].duration * 100;
			$("#progressbar").css('width', Math.floor(percentage * 10) / 10 + '%');
			if (this.player[0].currentTime != this.player[0].duration) {
				requestAnimationFrame(this.updateProgressIndicator.bind(this));
			} else {
				this.capturingfinished();
			}
		},

		createLevel: function () {
				var level = {};
                var loader = this.loader;

				level.track = loader.sound.permalink_url;
				level.gameobjects = this.gameobjects;
				level.taglist = loader.sound.tag_list;
				level.name = $("#levelname").val();
                this.level = level;
		}
	});
	return LevelBuilderView;
});