define([
    'jquery',
    'underscore',
    'backbone',
    'util/levelvalidator',
    'collections/GameObjectCollection'
], function ($, _, Backbone, Validator, GameObjectCollection) {
    var Level = Backbone.Model.extend({
        defaults: {
        },

        initialize: function () {

        },

        parse: function (data) {
            console.log('parsing');
            console.log(data);
            var obj = {};
            for (var k in data) {
                switch (k) {
                    case 'gameobjects':
                        obj[k] = new GameObjectCollection(data[k]);
                        break;

                    default:
                        obj[k] = data[k];
                }
            }
            return obj;

        },

        toJSON: function () {
            return this.deepcopy(this.attributes);
        },

        deepcopy: function (copyof) {
            var obj = {};
            for (var k in copyof) {
                if (typeof copyof[k] == "object" && copyof[k] !== null) {

                    if (typeof copyof[k].toJSON == "function") {
                        console.info('.toJSON() method used for nested model/collection ' + k);
                        obj[k] = copyof[k].toJSON();
                    }
                    else {
                        obj[k] = this.deepcopy(copyof[k]);
                    }
                }

                else {
                    obj[k] = copyof[k];
                }
            }
            return obj;
        },

        validate: function (attributes) {

        }
    });

    return Level;
});