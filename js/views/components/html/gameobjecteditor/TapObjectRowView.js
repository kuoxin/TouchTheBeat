define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/levelbuilder/gameobjecteditor/tapobjectrow.html',
    'gameclasses/ShapeFactory'
], function ($, _, Backbone, Template, ShapeFactory) {
    var TapObjectRowView = Backbone.View.extend({
        tagName: 'tr',

        css_classname_active: 'shape_selected',

        initialize: function (tapobject) {
            this.tapobject = tapobject;
            this.currentShape = 'circle';
        },

        events: {
            'click .shape': 'clickedShapeButton'
        },

        render: function (index) {
            var template = _.template(Template,
                {
                    index: index,
                    time: (Math.round(this.tapobject.taptime * 100) / 100).toFixed(2),
                    x: this.tapobject.x,
                    y: this.tapobject.y,
                    shapes: Object.keys(ShapeFactory.shapes),
                    currentShape: this.currentShape
                });
            this.$el.html(template);
            this.getShapeElem(this.currentShape).addClass(this.css_classname_active);
        },

        clickedShapeButton: function (event) {
            var shapename = event.target.getAttribute('alt');
            this.changeShape(shapename);
        },

        changeShape: function (shapename) {
            this.getShapeElem(this.currentShape).removeClass(this.css_classname_active);
            this.currentShape = shapename;
            this.getShapeElem(this.currentShape).addClass(this.css_classname_active);
        },

        getShapeElem: function (shapename) {
            return this.$('.shape_' + shapename);
        }


    });

    return TapObjectRowView;
});