define([
    'jquery',
    'underscore',
    'Framework',
    'text!templates/components/levelpanel.html'
], function ($, _, Framework, LevelPanelTemplate) {
    var LevelPanelView = Framework.View.extend({
        tagName: "a",

        initialize: function (options) {
            this.model = options.model;
            this.callback = options.callback;
        },

        attributes: {
            class: 'list-group-item',
            href: '#'
        },

        render: function () {
            var template = _.template(LevelPanelTemplate, _.extend(this.model.toJSON(), {
                duration: this.model.getDurationString()
            }));
            this.$el.html(template);
            return this;
        },
        events: {
            'click': 'triggerCallback'
        },

        triggerCallback: function (event) {

            this.callback(this.model);
            event.preventDefault();
            event.returnValue = false;
            return false;
        }
    });
    return LevelPanelView;
});