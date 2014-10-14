define([
    'jquery',
    'underscore',
    'backbone',
    'app',
    'text!templates/levelbuilder/panels/metadata.html',
    'util/scripts',
    'bootstrap'
], function ($, _, Backbone, app, mainTemplate) {
    var MetaDataPanelView = Backbone.View.extend({

        initialize: function () {
        },

        render: function () {
            var template = _.template(mainTemplate,
                {
                    levelname: app.getLevelEditorModel().get('name'),
                    username: app.getLevelEditorModel().get('owner').username
                }
            );
            this.$el.html(template);
        },

        onClose: function () {

        },

        events: {
            'click #btn_recordgameobjects': 'recordGameObjects',
            'input #username': 'saveUsername',
            'input #levelname': 'saveLevelname'
        },

        saveUsername: function () {
            var owner = _(app.getLevelEditorModel().get('owner')).clone();
            owner.username = this.$("#username").val();
            app.getLevelEditorModel().set({owner: owner});
        },

        saveLevelname: function () {
            console.log('levelname');
            app.getLevelEditorModel().set({
                name: this.$("#levelname").val()
            });
        }


    });
    return MetaDataPanelView;
});
