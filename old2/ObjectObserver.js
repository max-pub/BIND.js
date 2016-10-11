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
			set: (target, prop, value) => {
				if (value instanceof Object) // object? observe it too!
					value = this.observe(value, prefix + prop + '.');
				if (data[prop] === value) return true; // no change (oldValue==newValue)
				this.fireChange(prefix + prop, value, data[prop]);
				return Reflect.set(target, prop, value);
			}
		});
	}

	onChange(f) {
		this.changeHandlers.push(f);
		return this;
	}

	fireChange(path, newValue, oldValue) {
		console.log('DATA.fireChange', path, '=', newValue, '(' + oldValue + ')');
		this.changeHandlers.forEach(f => f({
			key: path,
			value: newValue,
			oldValue: oldValue
		}));
	}

	get(path, value) {
		let o = this.data;
		path.split('.').slice(0, -1).forEach(item => {
			if (o[item]) o = o[item];
		});
		return o[path.split('.').slice(-1)[0]];
	}

	set(path, value) {
		let o = this.data;
		path.split('.').slice(0, -1).forEach(item => {
			o = o[item];
		});
		o[path.split('.').slice(-1)[0]] = value;
	}

}