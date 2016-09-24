BIND = function(root, data) {
	if (!data) data = {};
	var bindings = []; // each item = [dataPath, node, property]

	var model = DATA(data).onChange(function(event) {
		// console.log('BIND.dataChange', event);
		for (var i in bindings)
			if (event.key == bindings[i][0])
				view.find(bindings[i][1]).set(bindings[i][2], event.value);
	});
	var view = new TREE(root).onChange(function(node, property, value) {
		console.log('BIND.viewChange', node, property, value);
		for (var i in bindings)
			if (node == bindings[i][1])
				model.setPath(bindings[i][0], value);
	});

	Object.defineProperty(model, "bind", {
		// configurable: true,
		// writable: false,
		enumerable: false,
		value: function(dataKey, domElement, domProperty) {
			bindings.push([dataKey, domElement, domProperty]);
			view.find(domElement).set(domProperty, model[dataKey]);
		}
	});


	var bindNodeProperties = function(domElement) {
		var keys = domElement.attributes;
		for (var i = 0; i < keys.length; i++) {
			if (keys[i].name.split('-')[0] == 'bind')
				model.bind(keys[i].value, domElement, keys[i].name.split('-')[1]);
		}
	}
	root.querySelectorAll("*").forEach(bindNodeProperties);
	return model;
}



// var key = keys[i].name;
// console.log('--keys', keys[i].name);



// console.log('bindings', bindings);
// updateView(domElement, domProperty, data[dataKey]);



// if (!dataKey) return;
// if (!bindings[dataKey]) bindings[dataKey] = [];
// bindings[dataKey].push({
// 	element: domElement,
// 	attribute: domProperty
// });


// for (var i in bindings[event.key])
// 	view.set(bindings[event.key][i].element, bindings[event.key][i].attribute, event.value);
// updateView(bindings[event.key][i][0], bindings[event.key][i][1], event.value);

// for (var key in bindings)
// 	for (var i in bindings[key])
// 		if (event.node == bindings[key][i].element)
// 			model.setPath(key, event.value);
// console.log('setPath NOW');
// updateModel(modelObserver, key, event.value);
// console.log('bind', bindings);



// if (typeof domElement == 'string') domElement = root.querySelector(domElement);
// if (!domProperty)
// if (['input', 'textarea', 'progress'].indexOf(domElement.tagName.toLowerCase()) > -1)
// 	domProperty = 'value';
// else domProperty = 'html';
// console.log('bind', dataKey, domElement, domProperty);


// var updateModel = function(object, path, value) {
// 	var path = path.split('.');
// 	for (var i = 0; i < path.length - 1; i++)
// 		object = object[path[i]];
// 	// console.log('now', object, path.slice(-1)[0]);
// 	object[path.slice(-1)[0]] = value;
// 	// console.log('now', object, object[path.slice(-1)[0]]);
// }



// if (domProperty == 'value')
// 	if (domElement.value != value)
// 		return domElement.value = value;
// if (domProperty == 'html')
// 	if (domElement.innerHTML != value)
// 		return domElement.innerHTML = value;
// if (domProperty == 'visible')
// 	if (domElement.innerHTML != value)
// 		return domElement.hidden = value;
// if (domElement.getAttribute(domProperty) != value)
// 	domElement.setAttribute(domProperty, value);



// console.log('node', domElement);
// var keys = domElement.attributes.forEach(function(key) {
// 	console.log('key', key);
// });
// return;
// console.log('attr', keys);
// return;
// if(!keys.length)
// bind(domElement.getAttribute('bind'), domElement);