define([
    'jquery',
    'underscore',
    'backbone',
    'utils/levelvalidator',
    'text!templates/leveloverview.html',
    'views/PlayView',
    '../demolevel',
    'app'
], function ($, _, Backbone, levelvalidator, LevelOverviewtemplate, PlayView, demolevel, app) {
    var ChooseLevelView = Backbone.View.extend({
        render: function () {
            Backbone.history.navigate('chooselevel', {trigger: false, replace: true});
            var template = _.template(LevelOverviewtemplate, {});
            this.$el.html(template);
        },
        events: {
            'click #startlevel': 'startlevel',
            'click #demolevel': 'startdemo',
            'click #devbutton': 'devaction'
        },

        startlevel: function () {
            if (levelvalidator.validate($('#leveljsoninput').val())) {
                app.startlevel(JSON.parse($('#leveljsoninput').val()));
            }
            else {
                this.invalidLevelJSON();
            }
        },

        invalidLevelJSON: function () {
            this.$("#alert_invalidlevel").slideDown();
        },

        startdemo: function () {
            app.startlevel(demolevel);
        },

        devaction: function () {
            console.error("PENG!");
        }
    });
    return ChooseLevelView;
});