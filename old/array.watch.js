if (!Array.prototype.watch) {
	Object.defineProperty(Array.prototype, "watch", {
		enumerable: false,
		configurable: true,
		writable: false,
		value: function(key, callback) {
			var oldValue = this[key];
			var newValue = oldValue;

			if (delete this[key]) { // can't watch constants
				Object.defineProperty(this, key, {
					get: function() {
						return newValue;
					},
					set: function(value) {
						oldValue = newValue;
						return newValue = callback.call(this, key, oldValue, value);
					},
					enumerable: true,
					configurable: true
				});
			}
		}
	});
}