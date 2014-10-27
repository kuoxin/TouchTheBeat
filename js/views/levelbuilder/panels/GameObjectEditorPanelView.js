define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/levelbuilder/panels/gameobjects.html',
    'views/levelbuilder/TapObjectRowView',
    'views/levelbuilder/ExportModalView',
    'app'
], function ($, _, Backbone, Template, TapObjectRowView, ExportModalView, app) {
    var GameObjectEditorPanelView = Backbone.View.extend({

        template: _.template(Template, {}),

        initialize: function () {
        },

        render: function (model) {
            this.model = model;
            this.$el.html(this.template);
            this.table = this.$('#tbody_gameobjects');
            this.table.html('');
            var i = 1;
            var gameobjects = this.model.get('gameObjects');
            gameobjects.forEach(function (gameobject) {
                if (gameobject.get('type') == 'Tap') {
                    var view = new TapObjectRowView(gameobject);
                    view.render(i++);
                    this.table.append(view.el);
                }

            }.bind(this));

        },

        events: {
            'click #record_gameobjects': 'recordGameObjects'
        },

        recordGameObjects: function recordgameobjects() {
            console.log('click');
            app.setFullScreenContent(app.router.views.levelbuilderview.getContent('gameobjectrecorder'), this.model);
        }
    });

    return GameObjectEditorPanelView;
});