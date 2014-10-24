/**
 * Created by Hermann on 24.10.2014.
 *  A Backbone View mixin for exchangeable sub-views. Subviews should be created in initialize or render and stored by calling addContent(key, view).
 *  The parent view's html has to contain a DOM element with the class 'content' functioning as a container.
 *  TODO: fix bug on second setContent-call with the same key
 */
define(['underscore'], function (_) {
    var ExchangeableContents = function () {
        var contents = {},
            currentContent = null,
            callback_before = null,
            callback_after = null,
            className = 'content',
            contentsareinstances = false;

        _.extend(this, {
            configureExchangableContents: function (options) {
                var opts = options || {};
                callback_after = opts.callback_after;
                callback_before = opts.callback_before;
                className = opts.className;
                if (typeof opts.contentsareinstances != 'undefined')
                    contentsareinstances = opts.contentsareinstances;
            },

            addContent: function addContent(key, view) {
                contents[key] = view;
            },

            addContents: function addContents(p_contents) {
                _.extend(contents, p_contents);
            },

            setContent: function setContent(key, args) {
                if (callback_before)
                    callback_before();

                if (currentContent != null) {
                    if (currentContent.onClose)
                        currentContent.onClose();
                    if (contentsareinstances)
                        currentContent.remove();
                }

                this.currentContent = contentsareinstances ? new this.getContent(key) : this.getContent(key);
                var container = this.$('.' + className).first();
                this.currentContent.render.apply(this.currentContent, args);
                container.html(this.currentContent.el);

                if (callback_after)
                    callback_after();

            },

            getContent: function getContent(key) {
                return contents[key] || contents[key + 'view'];
            },

            deleteContent: function deleteContent(key) {
                var content = this.getContent(key);
                if (typeof content != 'undefined') {
                    if (content.onClose)
                        content.onClose();
                    content.remove();
                    contents[key] = undefined;
                }
            },
            getCurrentContent: function getCurrentContent() {
                return currentContent;
            }
        });
    };

    return ExchangeableContents;
});