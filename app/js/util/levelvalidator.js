define(['jquery', 'underscore', 'backbone', 'tv4', 'schema'], function ($, _, Backbone, tv4, schema) {


    var levelvalidator = {};

    levelvalidator.validate = function (levelstring) {
        try {
            if (tv4.validate(JSON.parse(levelstring), schema)) {
                return true;
            }
            console.info('Level validation: ' + tv4.error.message);
        }
        catch (err) {
            console.info('Level validation: ' + err.message);
        }
        return false;

    };

    return levelvalidator;

});