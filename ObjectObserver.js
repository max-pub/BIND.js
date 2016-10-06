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
		// console.log('DATA.fireChange', path, '=', newValue, '(' + oldValue + ')');
		this.changeHandlers.forEach(f => f({
			key: path,
			value: newValue,
			oldValue: oldValue
		}));
	}

	get(path, value) {
		let o = this.data;
		path.split('.').slice(0, -1).forEach(item => {
			o = o[item];
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

// let parts = path.split('.').slice(0, -1);
// for (let i in parts)
// 	o = o[parts[i]];


// for (let i in this.changeHandlers)
// 	this.changeHandlers[i](path, newValue, oldValue);

// setDataPath = function(object, path, value) {
// 	var path = path.split('.');
// 	for (var i = 0; i < path.length - 1; i++)
// 		object = object[path[i]];
// 	// console.log('now', object, path.slice(-1)[0]);
// 	object[path.slice(-1)[0]] = value;
// 	// console.log('now', object, object[path.slice(-1)[0]]);
// }



// var setter = (obj, key, value) => {
// 	if (value instanceof Object) value = DATA(value, prefix + key + '.')
// 	if (data[key] === value) return; // no change (oldValue==newValue)
// 	console.log('DATA.set', obj.prefix, prefix + prop, '=', value, '(' + data[prop] + ')');
// 	this.fireChange(prefix + key, value, data[key]);
// 	return Reflect.set(obj, key, value);
// };

// // console.log(key,data);
// for (var key in data)
// 	data[key] = new Proxy(data[key], {
// 		set: setter,
// 		prefix: () => {
// 			key + '.'
// 		}
// 	});

// new Proxy(data, {
// 	set: setter,
// 	prefix: '.'
// });