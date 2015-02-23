define([
    'jquery',
    'underscore',
    'snap'
], function ($, _, Snap) {

	function getTriangleCoordinates(centerx, centery, cx, cy) {
		"use strict";

		function rotatePoint(pointX, pointY, originX, originY, angle) {
			angle = angle * Math.PI / 180.0;
			return {
				x: Math.cos(angle) * (pointX - originX) - Math.sin(angle) * (pointY - originY) + originX,
				y: Math.sin(angle) * (pointX - originX) + Math.cos(angle) * (pointY - originY) + originY
			};
		}

		return {
			a: rotatePoint(cx, cy, centerx, centery, 240),
			b: rotatePoint(cx, cy, centerx, centery, 120),
			c: {
				x: cx,
				y: cy
			}
		};
	}


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
		 * TODO: Refactor to remove code duplication
         */
        shapes: {
            "circle": function (snap, options) {
				var d = options.size;
				var obj = snap.circle(options.x, options.y, d);
				return obj;
            },
            "square_sidedown": function (snap, options) {
				var d = options.size;
				var obj = snap.rect(options.x - d, options.y - d, 2 * d, 2 * d);
				return obj;
            },
            "square_edgedown": function (snap, options) {
                var mx = options.x;
                var my = options.y;
				var d = options.size;
				var obj = snap.polygon(mx, my + d, mx - d, my, mx, my - d, mx + d, my);
				return obj;
            },
            "triangle_sidedown": function (snap, options) {
                var mx = options.x;
                var my = options.y;
				var d = options.size;
				var triangle = getTriangleCoordinates(mx, my, mx, my - d);
				var obj = snap.polygon(triangle.a.x, triangle.a.y, triangle.b.x, triangle.b.y, triangle.c.x, triangle.c.y);
				return obj;
            },
            "triangle_edgedown": function (snap, options) {
                // var obj = ShapeFactory.shapes["triangle_sidedown"](snap, options);
                // rotateObject(snap, obj, options.x, options.y, -180);
                // return obj;
                var mx = options.x;
                var my = options.y;
				var d = options.size;
				var triangle = getTriangleCoordinates(mx, my, mx, my + d);
				var obj = snap.polygon(triangle.a.x, triangle.a.y, triangle.b.x, triangle.b.y, triangle.c.x, triangle.c.y);
				return obj;
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
			name = "circle";
        }
		return _.defaults(ShapeFactory.shapes[name](snap, options), {
			markerPoint: {
				x: options.x,
				y: options.y
			}
		});
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
