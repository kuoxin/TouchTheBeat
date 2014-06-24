define([
  'jquery',
  'underscore',
  'backbone',
  'utils/levelvalidator',
  'text!templates/leveloverview.html',
  'views/PlayView',
  '../demolevel'
], function ($, _, Backbone, levelvalidator, LevelOverviewtemplate, PlayView, demolevel) {
	var ChooseLevelView = Backbone.View.extend({
		el: '#content',
		render: function () {
			var template = _.template(LevelOverviewtemplate, {});
			this.$el.html(template);
		},
		events: {
			'click #startlevel': 'startlevel',
            'click #demolevel': 'startdemo',
            'click #devbutton' : 'devaction'
		},

		startlevel: function () {

		},

        startdemo : function(){
            var playview = new PlayView();
            playview.render(demolevel);
        },

        devaction : function(){
            console.log(levelvalidator.validate($('#leveljsoninput').val()));
        }
	});
	return ChooseLevelView;
});