define([
    'jquery',
    'underscore',
    'backbone',
    'snap'
], function ($, _, Backbone, Snap) {
    "use strict";
    var AudioLoaderView = Backbone.View.extend({
        // ToDo: Add error handling and track information
        el: '#svg',

        width: 1600,
        height: 1200,

        loadingindicatorwidth: 1000,
        loadingindicatorheight: 100,

        textattributes: function () {
            return {
                fill: "#FFFFFF",
                "font-size": "5em",
                textAnchor: 'middle',
                filter: this.snap.filter(Snap.filter.shadow(0, 2, 3))
            };
        },

        render: function (options) {
            this.options = options ? options : {};
            this.snap = new Snap('#svg');
            this.r = this.snap.rect(0, 0, "100%", "100%", 0);
            this.r.attr({
                fill: (this.options.bgcolor || '#000000')
            });

            this.loadingindicatorbackground = this.snap.rect(this.width / 2 - this.loadingindicatorwidth / 2,
                    0.6 * this.height - this.loadingindicatorheight / 2,
                this.loadingindicatorwidth,
                this.loadingindicatorheight);
            this.loadingindicatorbackground.attr({
                fill: "#000000",
                stroke: '#FFFFFF',
                strokeWidth: 2
            });

            this.loadingindicator = this.snap.rect(this.width / 2 - this.loadingindicatorwidth / 2,
                    0.6 * this.height - this.loadingindicatorheight / 2,
                0,
                this.loadingindicatorheight);
            this.loadingindicator.attr({
                fill: "#FFFFFF"
            });

            this.loadingtext = this.snap.text(this.width / 2, 0.4 * this.height, "Loading audio");
            this.loadingtext.attr(this.textattributes());

        },

        createStatusText: function (text) {
            var obj = this.snap.text(this.width / 2, 0.4 * this.height, text);
            obj.attr(this.textattributes());
            return obj;
        },

        setProgress: function (progress) {
            this.loadingindicator.attr({
                width: (this.loadingindicatorwidth * progress)
            });
        },

        hideLoadingIndicator: function () {
            if (this.loadingtext)
                this.loadingtext.remove();
            if (this.loadingindicator)
                this.loadingindicator.remove();
            if (this.loadingindicatorbackground)
                this.loadingindicatorbackground.remove();
        },

        showProcessingInformation: function () {
            this.processingText = this.snap.text(this.width / 2, this.height / 2, "Processing audio");
            this.processingText.attr(this.textattributes());
        },


        hideProcessingInformaion: function () {
            if (this.processingText)
                this.processingText.remove();

        }
    });

    return AudioLoaderView;
});