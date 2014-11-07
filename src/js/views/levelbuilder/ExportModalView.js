define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/components/levelexportmodal.html',
    'app'
], function ($, _, Backbone, plainTemplate, app) {
    var ExportModalView = Backbone.View.extend({

        tagName: 'div',

        template: _.template(plainTemplate, {}),

        initialize: function () {
        },

        events: {
        },

        render: function (level) {
            console.log(level);
            this.$el.html(this.template);
            this.$('#exportmodalcontent').html(JSON.stringify(level));
            this.$('#exportmodal').modal('show');

        }
    });

    return ExportModalView;
});