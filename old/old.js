BIND = function(root, data) {
	if (!data) data = {};
	var bindings = {};
	var valueElements = ['input', 'textarea', 'progress'];
	var setValue = function(el, val) {
		if (!val) return;
		if (valueElements.indexOf(el.tagName.toLowerCase()) > -1)
			el.value = val;
		else el.innerHTML = val;
	}
	var updateView = new Proxy(data, {
		set: function(target, prop, value) {
			// console.log('data change', target, prop, value);
			for (i in bindings[prop])
				setValue(bindings[prop][i], value);
			// bindings[prop][i].value = value;
			return Reflect.set(target, prop, value);
		}
	});
	Object.defineProperty(updateView, "bind", {
		enumerable: false,
		configurable: true,
		writable: false,
		value: function(dataKey, domElement, domProperty) {
			if (typeof domElement == 'string') domElement = root.querySelector(domElement);
			console.log('proxy-bind', domElement, dataKey);
			if (!bindings[dataKey]) bindings[dataKey] = [];
			bindings[dataKey].push(domElement);
			setValue(domElement, data[dataKey]);
			if (valueElements.indexOf(domElement.tagName.toLowerCase()) > -1) {
				domElement.addEventListener('keyup', updateModel.bind(updateView));
				domElement.addEventListener('change', updateModel.bind(updateView));
			}
		}
	});

	var updateModel = function(event) {
		var el = event.target;
		var key = el.getAttribute('bind');
		// console.log('e2o', el.value, this);
		this[key] = el.value;
	}

	return updateView;
}



// var updateModel = function(event) {
// 	var el = event.target;
// 	var key = el.getAttribute('bind');
// 	// console.log('e2o', el.value, this);
// 	this[key] = el.value;
// }


// if (valueElements.indexOf(domElement.tagName.toLowerCase()) > -1) {
// 	domElement.addEventListener('keyup', updateModel.bind(updateView));
// 	domElement.addEventListener('change', updateModel.bind(updateView));
// }


// var updateView = new Proxy(data, {
// 	set: function(target, prop, value) {
// 		// console.log('data change', target, prop, value);
// 		for (i in bindings[prop])
// 			setValue(bindings[prop][i], value);
// 		// bindings[prop][i].value = value;
// 		return Reflect.set(target, prop, value);
// 	}
// });


// var elements = root.querySelectorAll('[bind]');
// for (var i = 0; i < elements.length; i++) {
// 	var el = elements[i];
// 	var key = el.getAttribute('bind');
// 	if (!bindings[key]) bindings[key] = [];
// 	bindings[key].push(el);
// 	// this.data.watch(el.getAttribute('bind'), BIND.o2e.bind(el));
// 	setValue(el, data[key]);
// 	if (el.tagName == 'INPUT') {
// 		// if (data[key])
// 		// el.value = data[key];
// 		el.addEventListener('keyup', updateModel.bind(updateView));
// 		el.addEventListener('change', updateModel.bind(updateView));
// 	}
// 	console.log('BIND.js:', el);
// 	// if(el.tagName)
// }



// BIND = function(root, data) {
// 	this.root = root;
// 	this.data = data;
// 	this.links = {};
// 	var links = this.links;
// 	this.proxy = new Proxy(this.data, {
// 		set: function(target, prop, value) {
// 			// console.log('object.set ', target, prop, value);
// 			// console.log('action', links[prop]);
// 			links[prop].value = value;
// 			return Reflect.set(target, prop, value);
// 		}
// 	});
// 	this.e2o = function(event) {
// 		var el = event.target;
// 		// console.log('e2o', el.value, this);
// 		this.data[el.getAttribute('bind')] = el.value;
// 	}

// 	this.elements = this.root.querySelectorAll('[bind]');
// 	for (var i = 0; i < this.elements.length; i++) {
// 		var el = this.elements[i];
// 		this.links[el.getAttribute('bind')] = el;
// 		// this.data.watch(el.getAttribute('bind'), BIND.o2e.bind(el));
// 		if (el.tagName == 'INPUT')
// 			el.addEventListener('keyup', this.e2o.bind(this));
// 		console.log('BIND.js:', el);
// 		// if(el.tagName)
// 	}
// 	return this.proxy;
// }



// BIND = {
// 	e2o: function(event) {
// 		var el = event.target;
// 		console.log('e2o', el.value, this);
// 		this.data[el.getAttribute('bind')] = el.value;
// 	},
// 	o2e: function(key, oldValue, newValue) {
// 		console.log('o2e', newValue, this);
// 		this.value = newValue;
// 	}
// }


// // get: function(target, prop) {
// 	return Reflect.get(target, prop);
// },