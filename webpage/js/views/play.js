define([
  'jquery',
  'underscore',
  'backbone',
  'text!templates/play.html'
], function ($, _, Backbone, playTemplate) {
	var PlayView = Backbone.View.extend({
		el: '#content',
		render: function () {
			var template = _.template(playTemplate, {});
			this.$el.html(template);
		},
		events: {
			'click #btn_start': 'test'
		},
		test: function () {
			console.log('click');
			$.getJSON('leveltest.json', function (json) {
				console.log(json);
			});
		}
	});
	return PlayView;
});