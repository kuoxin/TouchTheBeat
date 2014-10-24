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
            this.tapobject.on('change:shape', this.changeShape, this);
        },

        events: {
            'click .shape': 'clickedShapeButton'
        },


        render: function (index) {
            var template = _.template(Template,
                {
                    index: index,
                    time: (Math.round(this.tapobject.get('tapTime') * 100) / 100).toFixed(2),
                    x: this.tapobject.get('x'),
                    y: this.tapobject.get('y'),
                    shapes: Object.keys(ShapeFactory.shapes),
                    currentShape: this.currentShape()
                });
            this.$el.html(template);
            this.getShapeElem(this.currentShape()).addClass(this.css_classname_active);
        },

        currentShape: function () {
            return this.tapobject.get('shape').type;
        },

        previousShape: function () {
            return this.tapobject.previous('shape').type;
        },

        clickedShapeButton: function (event) {
            var shapename = event.target.getAttribute('alt');
            this.tapobject.set({shape: {
                type: shapename,
                size: 'medium'
            }});
        },

        changeShape: function () {
            this.getShapeElem(this.previousShape()).removeClass(this.css_classname_active);
            this.getShapeElem(this.currentShape()).addClass(this.css_classname_active);
        },

        getShapeElem: function (shapename) {
            return this.$('.shape_' + shapename);
        }


    });

    return TapObjectRowView;
});