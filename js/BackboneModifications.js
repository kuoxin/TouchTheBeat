define(['jquery', 'underscore', 'backbone'], function ($, _, Backbone) {
    _.extend(Backbone.View.prototype, {
        dispose: function () {
            //Will unbind all events this view has bound to
            //_.each(this.bindings, function (binding) {
            //     binding.model.unbind(binding.ev, binding.callback);
            // });

            // This will unbind all listeners to events from this view
            //this.unbind();
            //this.undelegateEvents();

            //this.bindings = [];

            if (this.onClose)
                this.onClose();

            this.remove();
            // Uses the default Backbone.View.remove() method which
            // removes this.el from the DOM and removes DOM events.
        }
    });

    var DEBUGDEEPCOPY = false;
    _.extend(Backbone.Model.prototype, {
        toJSON: function () {
            var obj = this.deepcopy(this.attributes);
            if (typeof this.id != 'undefined' && this.id != null)
                obj.id = this.id;
            return obj;
        },

        deepcopy: function (copyof) {
            var obj = (copyof instanceof Array) ? [] : {};

            for (var k in copyof) {
                if (typeof copyof[k] == "object" && copyof[k] !== null) {
                    if (DEBUGDEEPCOPY) console.log('found ' + typeof copyof[k] + ' ' + k);


                    if (typeof copyof[k].toJSON == "function") {
                        if (DEBUGDEEPCOPY) console.info('.toJSON() method used for nested model/collection ' + k);
                        obj[k] = copyof[k].toJSON();
                    }
                    else {
                        obj[k] = this.deepcopy(copyof[k]);
                    }
                }

                else {
                    if (DEBUGDEEPCOPY) console.log('copied leaf ' + k);
                    obj[k] = copyof[k];
                }
            }
            return obj;
        }
    });
});