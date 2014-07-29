define([
    'jquery',
    'underscore',
    'backbone',
    'utils/levelvalidator',
    'text!templates/leveloverview.html',
    'views/PlayView',
    '../levelcontainer',
    'app'
], function ($, _, Backbone, levelvalidator, LevelOverviewtemplate, PlayView, levelcontainer, app) {
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
            app.startlevel(levelcontainer.easylevel);
        },

        devaction: function () {

        }
    });
    return ChooseLevelView;
});