define([
	'underscore',
	'backbone'
], function (_, Backbone) {
	_.extend(Backbone.Model.prototype, {
		toJSON: function () {
			var obj = this.deepcopy(this.attributes);
			if (typeof this.id !== 'undefined' && this.id !== null)
				obj.id = this.id;
			return obj;
		},

		deepcopy: function (copyof) {
			var obj = (copyof instanceof Array) ? [] : {};

			for (var k in copyof) {
				if (typeof copyof[k] == "object" && copyof[k] !== null) {
					//console.log('found ' + typeof copyof[k] + ' ' + k);
					if (typeof copyof[k].toJSON == "function") {
						// console.info('.toJSON() method used for nested model/collection ' + k);
						obj[k] = copyof[k].toJSON();
					}
					else {
						obj[k] = this.deepcopy(copyof[k]);
					}
				}
				else {
					// console.log('copied leaf ' + k);
					if (copyof[k] !== null)
						obj[k] = copyof[k];
				}
			}
			return obj;
		}
	});
	return Backbone.Model;
});