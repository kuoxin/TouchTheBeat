define([
    'jquery',
    'underscore',
    'backbone',
    'util/levelvalidator',
    'text!templates/leveloverview.html',
    'views/PlayView',
    'levelcontainer',
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
            'click #devbutton': 'devaction',
            'click #easy': 'starteasy',
            'click #intermediate': 'startintermediate',
            'click #hard': 'starthard'
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

        starteasy: function () {
            app.startlevel(levelcontainer.easylevel);
        },

        starthard: function () {
            app.startlevel(levelcontainer.test);
        }

    });
    return ChooseLevelView;
});