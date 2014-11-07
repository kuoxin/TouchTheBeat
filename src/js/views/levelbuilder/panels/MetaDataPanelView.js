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

        render: function (model) {
            this.model = model;
            var template = _.template(mainTemplate,
                {
                    levelname: this.model.get('name'),
                    username: this.model.get('owner').get('username')
                }
            );
            this.$el.html(template);
        },

        onClose: function () {

        },

        events: {
            'click #btn_recordgameobjects': 'recordGameObjects',
            'input #levelname': 'saveLevelname'
        },

        saveLevelname: function () {
            console.log('levelname');
            this.model.set({
                name: this.$("#levelname").val()
            });
        }


    });
    return MetaDataPanelView;
});
