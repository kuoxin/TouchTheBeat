define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/levelbuilder/gameobjecteditor.html',
    'views/components/html/gameobjecteditor/TapObjectRowView',
    'app'
], function ($, _, Backbone, Template, TapObjectRowView, app) {
    var GameObjectEditorView = Backbone.View.extend({

        template: _.template(Template, {}),

        initialize: function () {
        },

        render: function () {
            // Will be changed to really use the model instead of the JSON object
            this.level = app.models.levelEditorModel.toJSON();
            this.$el.html(this.template);
            this.table = this.$('#tbody_gameobjects');
            this.table.html('');

            for (var i = 0; i < this.level.gameobjects.length; i++) {
                var gameobject = this.level.gameobjects[i];

                if (gameobject.type == 'Tap') {
                    var view = new TapObjectRowView(gameobject);
                    view.render(i + 1);
                    this.table.append(view.el);
                }
            }

        }
    });

    return GameObjectEditorView;
});