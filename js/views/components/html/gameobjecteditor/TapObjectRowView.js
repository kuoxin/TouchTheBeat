define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/levelbuilder/gameobjecteditor/tapobjectrow.html',
    'gameclasses/ShapeFactory'
], function ($, _, Backbone, Template, ShapeFactory) {
    var TapObjectRowView = Backbone.View.extend({
        tagName: 'tr',

        initialize: function (tapobject) {
            this.tapobject = tapobject;
        },

        render: function (index) {
            var template = _.template(Template,
                {
                    index: index,
                    time: Math.round(this.tapobject.taptime * 100) / 100,
                    x: this.tapobject.x,
                    y: this.tapobject.y,
                    shapes: Object.keys(ShapeFactory.shapes)
                });
            this.$el.html(template);
        }
    });

    return TapObjectRowView;
});