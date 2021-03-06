// setDataPath = function(object, path, value) {
// 	var path = path.split('.');
// 	for (var i = 0; i < path.length - 1; i++)
// 		object = object[path[i]];
// 	// console.log('now', object, path.slice(-1)[0]);
// 	object[path.slice(-1)[0]] = value;
// 	// console.log('now', object, object[path.slice(-1)[0]]);
// }

DATA = function(data = {}, prefix, changeHandlers = []) {
	if (!(data instanceof Object)) return data;
	console.log('DATA', prefix, changeHandlers);
	// var changeHandlers = [];
	if (!prefix) prefix = '';

	for (var key in data)
	// if (proxy[key] instanceof Object)
		data[key] = DATA(data[key], prefix + key + '.');

	var proxy = new Proxy(data, {
		set: function(target, prop, value) {
			if (value instanceof Object)
				value = DATA(value, prefix + prop + '.', changeHandlers);
			// console.log('compare', data[prop], value);
			if (data[prop] === value) return true; // no change (oldValue==newValue)
			console.log('DATA.set', prefix + prop, '=', value, '(' + data[prop] + ')');
			// console.log(changeHandlers);
			for (var i = 0; i < changeHandlers.length; i++)
				changeHandlers[i]({
					key: prefix + prop,
					value: value,
					oldValue: data[prop]
				});
			return Reflect.set(target, prop, value);
		}
	});
	if (!prefix)
		Object.defineProperty(proxy, "setPath", {
			enumerable: false,
			value: function(path, value) {
				// console.log('DATA.setPath', path, value);
				var o = this;
				// console.log('setPath', this);
				var path = path.split('.');
				for (var i = 0; i < path.length - 1; i++)
					o = o[path[i]];
				o[path.slice(-1)[0]] = value;
			}
		});
	if (!prefix)
		Object.defineProperty(proxy, "onChange", {
			enumerable: false,
			value: function(f) {
				changeHandlers.push(f);
				// console.log('ch', changeHandlers);
				return this;
			}
		});
	return proxy;
};