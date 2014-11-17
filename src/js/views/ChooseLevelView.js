define([
    'jquery',
    'underscore',
    'Framework',
    'text!templates/leveloverview.html',
    'views/LevelPanelView',
    'collections/LevelCollection',
    'app',
    'views/LevelTextInputView'
], function ($, _, Framework, LevelOverviewTemplate, LevelPanel, LevelCollection, app, LevelTextInputView) {
    var ChooseLevelView = Framework.View.extend({

        render: function () {
            Framework.history.navigate('chooselevel', {trigger: false, replace: true});
            var template = _.template(LevelOverviewTemplate, {});
            this.$el.html(template);
            this.levelpanelviews = [];
            this.containerelement_packaged = $('#levelcontainer_packaged');
            this.containerelement_custom = $('#levelcontainer_custom');
            this.inputstatediv = $('#inputstatediv');
            this.containerelement_packaged.html('');

            var callback = app.startlevel.bind(app);
            var levels = new LevelCollection();
            levels.forEach(function (level) {
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