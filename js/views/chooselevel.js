define([
    'jquery',
    'underscore',
    'backbone',
    'util/levelvalidator',
    'text!templates/leveloverview.html',
    'views/levelpanel',
    'views/PlayView',
    'levelcontainer',
    'app'
], function ($, _, Backbone, levelvalidator, LevelOverviewTemplate, LevelPanel, PlayView, levelcontainer, app) {
    var ChooseLevelView = Backbone.View.extend({

        render: function () {
            Backbone.history.navigate('chooselevel', {trigger: false, replace: true});
            var template = _.template(LevelOverviewTemplate, {});
            this.$el.html(template);
            this.levelpanelviews = [];
            var containerelem = $('#levelcontainer');
            containerelem.html('');
            for (var i = 0; i < levelcontainer.length; i++) {
                var clevel = levelcontainer[i];
                var view = new LevelPanel();
                view.render(clevel);
                containerelem.append(view.el);
                this.levelpanelviews.push(view);
            }
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
        }
    });
    return ChooseLevelView;
});