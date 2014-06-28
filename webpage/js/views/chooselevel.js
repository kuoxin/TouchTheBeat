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
            if (levelvalidator.validate($('#leveljsoninput').val())){
                var level = JSON.parse($('#leveljsoninput').val());
                new PlayView().render(level);
            }
            else{
                this.invalidLevelJSON();
            }
		},

        invalidLevelJSON: function(){
            this.$("#alert_invalidlevel").slideDown();
        },

        startdemo : function(){
            var playview = new PlayView();
            playview.render(demolevel);
        },

        devaction : function(){
            console.error("PENG!");
        }
	});
	return ChooseLevelView;
});