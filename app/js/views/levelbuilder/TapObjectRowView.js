define([
    'jquery',
    'underscore',
    'Framework',
    'text!templates/levelbuilder/gameobjecteditor/tapobjectrow.html',
    'game/ShapeFactory'
], function ($, _, Framework, Template, ShapeFactory) {
    var TapObjectRowView = Framework.View.extend({
        tagName: 'tr',

        css_classname_active: 'shape_selected',

        initialize: function (tapobject) {
            this.tapobject = tapobject;
        },

        events: {
            'click .shape': 'clickedShapeButton',
            'click': 'clickRow',
            'click .checkbox_rowselection': 'clickSelectionToggle'
            //'click .select_td': 'clickRow'
        },


        render: function () {
            var data = _.extend(this.tapobject.toJSON(), {
                time: (Math.round(this.tapobject.get('tapTime') * 100) / 100).toFixed(2),
                shapes: Object.keys(ShapeFactory.shapes),
                cid: this.tapobject.cid
            });

            var template = _.template(Template, data);
            this.$el.html(template);
            this.getShapeElem(this.currentShape()).addClass(this.css_classname_active);

            this.listenTo(this.tapobject, 'change:shape', this.changeShape, this);
            this.listenTo(this.tapobject, 'selected', this.setSelected, this);
            this.listenTo(this.tapobject, 'deselected', this.setDeselected, this);
            return this;
        },

        clickRow: function (e) {
            if (e.target.tagName === 'TD') {
                this.tapobject.toggleSelected();
            }
        },
        clickSelectionToggle: function () {
            this.tapobject.toggleSelected();
        },

        setSelected: function () {
            console.log('model ' + this.tapobject.cid + ' was selected');
            this.$('.checkbox_rowselection').prop('checked', true);
            this.$el.addClass('active');
        },

        setDeselected: function () {
            console.log('model ' + this.tapobject.cid + ' was deselected');
            this.$('.checkbox_rowselection').prop('checked', false);
            this.$el.removeClass('active');
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