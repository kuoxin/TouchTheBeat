define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/components/levelexportmodal.html'
], function ($, _, Backbone, plainTemplate) {
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