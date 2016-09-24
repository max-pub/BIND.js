class DATA {
	constructor(data, prefix = '') {
		if (!(data instanceof Object)) return data;

		this.changeHandlers = [];

		// if (proxy[key] instanceof Object)
		for (var key in data)
			data[key] = DATA(data[key], prefix + key + '.');

		new Proxy(data, {
			set: function(obj, key, value) {
				if (value instanceof Object) value = DATA(value, prefix + key + '.')
				if (data[key] === value) return; // no change (oldValue==newValue)
				// console.log('DATA.set', prefix + prop, '=', value, '(' + data[prop] + ')');
				this.fireChange(prefix + key, value, data[key]);
				return Reflect.set(obj, key, value);
			}
		});
	}

	setPath(path, value) {
		let o = this;
		path = path.split('.');
		for (let i in path)
			o = o[path[i]];
		o[path.slice(-1)[0]] = value;
	}

	onChange(f) {
		this.changeHandlers.push(f);
		return this;
	}
	fireChange(path, newValue, oldValue) {
		for (let i in this.changeHandlers)
			this.changeHandlers[i](path, newValue, oldValue);
	}
}

// setDataPath = function(object, path, value) {
// 	var path = path.split('.');
// 	for (var i = 0; i < path.length - 1; i++)
// 		object = object[path[i]];
// 	// console.log('now', object, path.slice(-1)[0]);
// 	object[path.slice(-1)[0]] = value;
// 	// console.log('now', object, object[path.slice(-1)[0]]);
// }