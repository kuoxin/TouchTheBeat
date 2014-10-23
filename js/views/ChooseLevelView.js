define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/leveloverview.html',
    'views/LevelPanelView',
    'levelcontainer',
    'app',
    'views/LevelTextInputView'
], function ($, _, Backbone, LevelOverviewTemplate, LevelPanel, levelcontainer, app, LevelTextInputView) {
    var ChooseLevelView = Backbone.View.extend({

        render: function () {
            Backbone.history.navigate('chooselevel', {trigger: false, replace: true});
            var template = _.template(LevelOverviewTemplate, {});
            this.$el.html(template);
            this.levelpanelviews = [];
            this.containerelement_packaged = $('#levelcontainer_packaged');
            this.containerelement_custom = $('#levelcontainer_custom');
            this.inputstatediv = $('#inputstatediv');
            this.containerelement_packaged.html('');

            var callback = app.startlevel.bind(app);
            levelcontainer.forEach(function (level) {
                var view = new LevelPanel(callback);
                view.render(level);
                this.containerelement_packaged.append(view.el);
                this.levelpanelviews.push(view);
            }.bind(this));

            var manualinputview = new LevelTextInputView(callback);
            manualinputview.render();
            $('#manualinputcontainer').html(manualinputview.el);


        }
    });
    return ChooseLevelView;
});