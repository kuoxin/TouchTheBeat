define([
    'jquery',
    'underscore',
    'backbone',
    'snap'
], function ($, _, Backbone, Snap) {

    var ShapeFactory = {
        sizes: {
            small: 90,
            medium: 120,
            large: 150
        }
    };

    // helper functions:
    var rotateObject = function (snap, object, x, y, angle) {
        var matrix = new Snap.Matrix();
        matrix.rotate(angle, x, y);
        object.attr({transform: matrix});
        return object;
    }

    var scaleObject = function (snap, object, x, y, scale) {
        var matrix = new Snap.Matrix();
        matrix.scale(scale, scale, x, y);
        object.attr({transform: matrix});
        return object;

    }

    // factory methods for each predefined shape using snap.svg
    ShapeFactory.shapes = {
        "circle": function (snap, options) {
            return snap.circle(options.x, options.y, ShapeFactory.sizes[options.size]);
        },
        "square_sidedown": function (snap, options) {
            var d = ShapeFactory.sizes[options.size];
            return scaleObject(snap, snap.rect(options.x - d, options.y - d, 2 * d, 2 * d), options.x, options.y, 0.8);
        },
        "square_edgedown": function (snap, options) {
            var mx = options.x;
            var my = options.y;
            var d = ShapeFactory.sizes[options.size];
            return snap.polygon(mx, my + d, mx - d, my, mx, my - d, mx + d, my);
        },
        "triangle_sidedown": function (snap, options) {
            var mx = options.x;
            var my = options.y;
            var d = ShapeFactory.sizes[options.size];
            return snap.polygon(mx - d, my + d, mx, my - d, mx + d, my + d);
        },
        "triangle_edgedown": function (snap, options) {
            var obj = ShapeFactory.shapes["triangle_sidedown"](snap, options);
            rotateObject(snap, obj, options.x, options.y, -180);
            return obj;
        }
    };

    /**
     * @param snap a snap instance
     * @param name the name of a predefined Shape in ShapeFactory.shapes
     * @param options x, y and a size-key as predefined defined in ShapeFactory.sizes
     * @returns a new shape
     */
    ShapeFactory.createShape = function (snap, name, options) {
        if (!ShapeFactory.shapes[name]) {
            console.error('unknown shape type: ' + name);
            return ShapeFactory.shapes["circle"](snap, options);
        }
        else
            console.log(options);
        return ShapeFactory.shapes[name](snap, options);
    };

    return ShapeFactory;
});