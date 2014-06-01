define([
  'jquery',
  'underscore',
  'backbone',
  'text!templates/levelbuilder.html',
  'utils/SoundcloudLoader'
], function ($, _, Backbone, levelbuilderTemplate, SoundcloudLoader) {
	var LevelBuilderView = Backbone.View.extend({
		el: '#content',
		init: function () {
			(function () {
				var lastTime = 0;
				var vendors = ['ms', 'moz', 'webkit', 'o'];
				for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
					window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
					window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
				}

				if (!window.requestAnimationFrame)
					window.requestAnimationFrame = function (callback, element) {
						var currTime = new Date().getTime();
						var timeToCall = Math.max(0, 16 - (currTime - lastTime));
						var id = window.setTimeout(function () {
								callback(currTime + timeToCall);
							},
							timeToCall);
						lastTime = currTime + timeToCall;
						return id;
					};

				if (!window.cancelAnimationFrame)
					window.cancelAnimationFrame = function (id) {
						clearTimeout(id);
					};
			}());

		},

		loader: new SoundcloudLoader(),

		render: function () {
			var template = _.template(levelbuilderTemplate, {});
			this.$el.html(template);
			this.init();
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