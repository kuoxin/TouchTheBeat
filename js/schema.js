define([

], function () {

    var schema = {
        "$schema": "http://json-schema.org/draft-04/schema#",
        "type": "object",
        "properties": {
            "audio": { "type": "object",
                "properties": {
                    "stream_url" : {
                        "type": "string"
                    },
                    "permalink_url" :{
                        "type": "string"
                    }
                },
                "required": ["stream_url", "permalink_url"]
            },
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