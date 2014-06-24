define(['jquery', 'underscore', 'backbone','tv4', 'schema'], function ($, _, Backbone, tv4, schema) {


    var levelvalidator = {};

    levelvalidator.validate = function(levelstring){
        try{
        var levelobject = JSON.parse(levelstring);
        }
        catch (err){
            return err;
        }
        console.log(levelobject);
        var result = tv4.validate(levelobject, schema);
        console.log((result ? true : tv4.error));
    }

    return levelvalidator;

});