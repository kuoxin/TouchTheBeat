define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/levelbuilder/gameobjecteditor.html',
    'views/components/html/gameobjecteditor/TapObjectRowView',
    'views/components/html/ExportModalView',
    'app'
], function ($, _, Backbone, Template, TapObjectRowView, ExportModalView, app) {
    var GameObjectEditorView = Backbone.View.extend({

        template: _.template(Template, {}),

        initialize: function () {
        },

        events: {
            'click #delete': 'delete',
            'click #export': 'export',
            'click #save': 'save'
        },

        delete: function () {
            console.log('triggered');
            app.models.levelEditorModel = null;
            var levelbuilderview = app.router.views.levelbuilderview;
            levelbuilderview.setContent(levelbuilderview.contents.startview);
        },

        export: function () {
            console.log(app.models.levelEditorModel.toJSON());
            this.exportmodalview.render(app.models.levelEditorModel.toJSON());
        },

        save: function () {
        },


        render: function () {
            // Will be changed to really use the model instead of the JSON object
            this.level = app.models.levelEditorModel.toJSON();
            this.$el.html(this.template);
            this.exportmodalview = new ExportModalView();
            this.$el.append(this.exportmodalview.el);
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