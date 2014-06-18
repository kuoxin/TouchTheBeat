define([
  'jquery',
  'underscore',
  'backbone',
  'text!templates/levelbuilder.html',
  'utils/SoundcloudLoader',
  'utils/RequestAnimationFrame',
  'bootstrap'
], function ($, _, Backbone, levelbuilderTemplate, SoundcloudLoader) {
	var LevelBuilderView = Backbone.View.extend({

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
		},

		openGameObjectPanel: function openGameObjectPanel() {
			$("#btn_gameobjectpanel").attr("disabled", true);
			$("#progress").fadeIn();
			$("#btn_gameobjectpanel").fadeOut();
			$('#player').trigger("play");
			console.log(this);
			this.updateProgressIndicator();

		},

		test: function test() {
			this.gameobjects.push(this.player[0].currentTime);
			console.log(this.gameobjects);
		},

		openPublish: function openPublish() {
			$("#publish").slideUp();
			$("#finished").slideDown();
			console.log(this.createLevelJSON());
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


			this.artistLink.setAttribute('href', this.loader.sound.user.permalink_url);
			this.artistLink.innerHTML = this.loader.sound.user.username;

			this.trackLink.setAttribute('href', this.loader.sound.permalink_url);

			if (this.loader.sound.kind == "playlist") {
				this.trackLink.innerHTML = "<p>" + this.loader.sound.tracks[this.loader.streamPlaylistIndex].title + "</p>" + "<p>" + this.loader.sound.title + "</p>";
			} else {
				this.trackLink.innerHTML = this.loader.sound.title;
			}

			var image = this.loader.sound.artwork_url ? this.loader.sound.artwork_url : this.loader.sound.user.avatar_url; // if no track artwork exists, use the user's avatar.
			this.infoImage.setAttribute('src', image);

			this.infoArtist.innerHTML = '';
			this.infoArtist.appendChild(this.artistLink);

			this.infoTrack.innerHTML = '';
			this.infoTrack.appendChild(this.trackLink);

			$('#trackinfo').fadeIn();

		},

		clearTrackPanel: function clearTrackPanel() {

			// first clear the current contents
			this.infoArtist.innerHTML = "";
			this.infoTrack.innerHTML = "";
			this.trackInfoPanel.className = 'hidden';

		},

		capturingfinished: function () {
			$("#gameObjectPanel").fadeOut();
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


		createLevelJSON: function () {
			function createlevelJSON() {
				var level = {};
				level.source = loader.sound.permalink_url;
				level.duration = loader.sound.duration;
				level.gameobjects = gameobjects;
				level.trackname = loader.sound.permalink;
				level.tracktitle = loader.sound.title;
				level.taglist = loader.sound.tag_list;
				level.name = $("#levelname").val();
				return JSON.stringify(level);
			}
		}
	});
	return LevelBuilderView;
});