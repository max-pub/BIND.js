class ObjectObserver {
	constructor(data = {}) {
		this.changeHandlers = [];
		this.data = this.observe(data);
	}

	observe(data, prefix = '') {
		if (!(data instanceof Object)) return data;
		// console.log('observe', prefix);

		for (var key in data)
			data[key] = this.observe(data[key], prefix + key + '.');

		return new Proxy(data, {
			set: (target, property, value, receiver) => {
				// console.log('SET', target, property, value, receiver);
				console.log('SET', property, value);
				if (value instanceof Object) // object? observe it too!
					value = this.observe(value, prefix + property + '.');
				if (data[property] === value) return true; // no change (oldValue==newValue)
				var ret = Reflect.set(target, property, value);
				this.fireChange(prefix + property, value, data[property]);
				return ret;
			}

			// get: (target, property, c, d) => {
			// 	console.log("GET", property);
			// 	switch (property) {
			// 		case 'push':
			// 			console.log('push', c, d);
			// 			break;
			// 		case 'unshift':
			// 			console.log('unshift', c, d, target);
			// 			break;
			// 	}
			// 	return Reflect.get(target, property);
			// }
		});
	}

	onChange(f) {
		this.changeHandlers.push(f);
		return this;
	}

	fireChange(path, newValue, oldValue) {
		// console.log('DATA.fireChange', path, '=', newValue, '(' + oldValue + ')');
		this.changeHandlers.forEach(f => f({
			key: path,
			value: newValue,
			oldValue: oldValue
		}));
	}

	getPath(path) {
		let o = this.data;
		path.split('.').slice(0, -1).forEach(item => {
			if (o[item]) o = o[item];
		});
		return o[path.split('.').slice(-1)[0]];
	}

	setPath(path, value) {
		// console.log('O.set', path, value);
		let o = this.data;
		path.split('.').slice(0, -1).forEach(item => {
			o = o[item];
		});
		o[path.split('.').slice(-1)[0]] = value;
	}

}