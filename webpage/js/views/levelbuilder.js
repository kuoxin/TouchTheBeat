define([
  'jquery',
  'underscore',
  'backbone',
  'text!templates/levelbuilder.html',
  'utils/SoundcloudLoader',
  'utils/RequestAnimationFrame'
], function ($, _, Backbone, levelbuilderTemplate, SoundcloudLoader) {
	var LevelBuilderView = Backbone.View.extend({

		el: '#content',

		render: function () {
			var template = _.template(levelbuilderTemplate, {});
			this.$el.html(template);
			this.init();
		},

		events: {
			'click #btn_entertrack': 'enteredTrack'
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
		},

		enteredTrack: function () {
			this.loader.loadStream($("#input_entertrack").val(), this.loading_success, this.loading_error);
		},

		loading_success: function () {
			this.$("#alert_tracknotfound").slideUp();
			uiupdater.update();
			this.player.attr('src', loader.streamUrl());
			this.$("#trackinfo").fadeIn();
			this.$("#trackselection").slideUp();
		},

		loading_error: function () {
			console.log("error");
			this.$("#alert_tracknotfound_text").html(loader.errorMessage);
			this.$("#alert_tracknotfound").slideDown();
		},

		capturingfinished: function () {
			this.$("#gameObjectPanel").fadeOut();
			this.$("#instructions").slideUp();
			this.$("#publish").fadeIn();
		},

		updateProgressIndicator: function () {
			var percentage = player[0].currentTime / player[0].duration * 100;
			this.$("#progressbar").css('width', Math.floor(percentage * 10) / 10 + '%');
			if (player[0].currentTime != player[0].duration) {
				requestAnimationFrame(this.updateProgressIndicator);
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