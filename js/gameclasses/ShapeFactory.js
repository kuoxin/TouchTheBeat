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

    /**
     * This method generates .symbol_SHAPENAME CSS rules that set the corresponding shape as background-image. It should be somehow integrated into the runtime or the build-process.
     */
    ShapeFactory.setCSSRules = function () {
        //var element = document.createElement('svg');
        //element.setAttribute("height","1000");
        //element.setAttribute("width","1000");
        var size = "medium";
        var template = " .symbol_<%= classname %>{ background-image: url(\'data:image/svg+xml;utf8,<%= svgstring %>\')}\n";
        var dim = ShapeFactory.sizes[size] * 2;

        var outputstring = "";
        for (var prop in ShapeFactory.shapes) {
            var snap = new Snap(dim, dim);
            var shape = ShapeFactory.createShape(snap, prop, {x: dim / 2, y: dim / 2, size: size});
            shape.attr({
                fill: '#000000',
                opacity: 0.75
            });
            shape = scaleObject(snap, shape, dim / 2, dim / 2, 0.8);
            outputstring = outputstring +
                _.template(template,
                    {
                        classname: prop,
                        svgstring: snap.toString()
                    }
                );
        }
        console.log(outputstring);
    };


    ShapeFactory.randomizeShapes = function (level) {
        var index;
        var a = level.gameobjects;
        for (index = 0; index < a.length; ++index) {
            console.log(a[index]);
        }
        return level;
    };

    return ShapeFactory;
});