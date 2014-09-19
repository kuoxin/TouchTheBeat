define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/levelbuilder/gameobjecteditor.html',
    'views/components/html/gameobjecteditor/TapObjectRowView'
], function ($, _, Backbone, Template, TapObjectRowView) {
    var GameObjectEditorView = Backbone.View.extend({

        template: _.template(Template, {}),

        initialize: function (level) {
            this.level = level;
            this.gameobjectscounter = 0;
        },

        render: function () {
            this.$el.html(this.template);
            this.table = this.$('#tbody_gameobjects');
            this.table.html('');

            for (var i = 0; i < this.level.gameobjects.length; i++) {
                var gameobject = this.level.gameobjects[i];

                if (gameobject.type == 'Tap') {
                    var view = new TapObjectRowView(gameobject);
                    view.render(++this.gameobjectscounter);
                    this.table.append(view.el);
                }
            }

        }
    });

    return GameObjectEditorView;
});