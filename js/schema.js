define([

], function () {

    var schema = {
        "$schema": "http://json-schema.org/draft-04/schema#",
        "type": "object",
        "properties": {
            "id": { "type": "string" },
            "name": { "type": "string" },
            "tags": {
                "type": "array",
                "items": {
                    "type": "string"
                }
            },
            "audio": {
                "type": "object",
                "properties": {
                    "artist": {
                        "type": "string"
                    },
                    "title": {
                        "type": "string"
                    },
                    "duration": {
                        "type": "number"
                    },
                    "streamUrl": {
                        "type": "string"
                    },
                    "permalinkUrl": {
                        "type": "string"
                    }
                },
                "required": ["artist", "title", "duration", "streamUrl", "permalinkUrl"]
            },
            "visuals": {
                "type": "object"
            },
            "gameObjects": {
                "type": "array",
                "items": [
                    {
                        "type": "object",
                        "properties": {
                            "type": {
                                "type": "string",
                                "enum": ["Tap"]
                            },
                            "tapTime": {
                                "type": "number"
                            },
                            "x": {
                                "type": "number"
                            },
                            "y": {
                                "type": "number"
                            },
                            "shape": {
                                "type": "object",
                                "properties": {
                                    "type": {
                                        "type": "string",
                                        "enum": ["circle", "square_sidedown", "square_edgedown", "triangle_sidedown", "triangle_edgedown" ]
                                    },
                                    "size": {
                                        "type": "string",
                                        "enum": ["small", "medium", "large"]
                                    }
                                },
                                "required": ["type", "size"]
                            }

                        },
                        "required": ["type", "tapTime", "x", "y", "shape"]
                    }
                ],
                "minItems": 1,
                "uniqueItems": true
            },
            "owner": {
                "type": "object",
                "properties": {
                    "id": {
                        "type": "string"
                    },
                    "username": {
                        "type": "string"
                    },
                    "homepage": {
                        "type": "string"
                    }
                },
                "required": ["id", "username"]
            }
        },
        "required": ["id", "name", "audio", "gameObjects"]
    };
    return schema;
})
;