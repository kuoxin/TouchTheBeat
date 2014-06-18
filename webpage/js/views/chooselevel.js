define([
  'jquery',
  'underscore',
  'backbone',
  'text!templates/leveloverview.html',
  'views/play',
  'utils/testlevel'
], function ($, _, Backbone, LevelOverviewtemplate, PlayView, testlevel) {
	var ChooseLevelView = Backbone.View.extend({
		el: '#content',
		render: function () {
			var template = _.template(LevelOverviewtemplate, {});
			this.$el.html(template);
		},
		events: {
			'click .startlevelbutton': 'startlevel'
		},

		startlevel: function () {
			var playview = new PlayView();
			playview.render(testlevel, this);
		}
	});
	return ChooseLevelView;
});