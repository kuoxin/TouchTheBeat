define([

], function () {

    var schema = {
        "$schema": "http://json-schema.org/draft-04/schema#",
        "type": "object",
        "properties": {
            "track": { "type": "string" },
            "levelname": { "type": "string" },
            "gameobjects": {
                "type": "array",
                "items": [
                    {
                        "type": "object",
                        "properties": {
                            "type": {
                                "type": "string",
                                "enum": ["Tap"]
                            },
                            "taptime": {
                                "type": "number"
                            },
                            "x": {
                                "type": "number"
                            },
                            "y": {
                                "type": "number"
                            }

                        },
                        "required": ["type", "time", "x", "y"]
                    }
                ],
                "minItems": 1,
                "uniqueItems": true
            }
        },
        "required": ["track", "levelname", "gameobjects"]
    };

    return schema;
})
;