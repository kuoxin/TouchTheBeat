define([
    'jquery',
    'underscore',
    'snap'
], function ($, _, Snap) {

    /**
     * @type {{sizes: {small: number, medium: number, large: number}}}
     */
    var ShapeFactory = {
        sizes: {
            small: 90,
            medium: 120,
            large: 150
        },

        /**
         * factory methods for each predefined shape using snap.svg
         */
        shapes: {
            "circle": function (snap, options) {
                return snap.circle(options.x, options.y, ShapeFactory.sizes[options.size]);
            },
            "square_sidedown": function (snap, options) {
                var scale = 0.85;
                var d = scale * ShapeFactory.sizes[options.size];
                return snap.rect(options.x - d, options.y - d, 2 * d, 2 * d);
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
                // var obj = ShapeFactory.shapes["triangle_sidedown"](snap, options);
                // rotateObject(snap, obj, options.x, options.y, -180);
                // return obj;
                var mx = options.x;
                var my = options.y;
                var d = ShapeFactory.sizes[options.size];
                return snap.polygon(mx, my + d, mx - d, my - d, mx + d, my - d);
            }
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
            return ShapeFactory.shapes.circle(snap, options);
        }
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
        var scale = 0.85;
        var template = " .shape_<%= classname %>{ background-image: url(\'data:image/svg+xml;utf8,<%= svgstring %>\') !important}\n";
        var dim = ShapeFactory.sizes[size] * 2;

        var outputstring = "";
        for (var prop in ShapeFactory.shapes) {
            var snap = new Snap(dim / scale, dim / scale);
            var shape = ShapeFactory.createShape(snap, prop, {x: dim / (2 * scale), y: dim / (2 * scale), size: size}).attr({ // jshint ignore:line
                fill: '#000000',
                opacity: 0.75
            });
            //shape = scaleObject(snap, shape, dim / 2, dim / 2, 0.8);
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