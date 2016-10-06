class GLUE {
	constructor(root, data = {}) {
		this.bindings = []; // each item = [dataPath, node, property]
		this.root = root;

		this.view = new DOMObserver(root);
		if (data instanceof ObjectObserver) this.model = data;
		else this.model = new ObjectObserver(data);

		this.view.onChange((event) => {
			// console.log('GLUE.viewChange', node, property, value);
			this.bindings.map(item => {
				if (event.node == item[1])
					this.model.set(item[0], event.value);
			})
		});
		this.model.onChange(event => {
			// console.log('GLUE.dataChange', event);
			this.bindings.map(item => {
				if (event.key == item[0])
					this.view.find(item[1]).set(item[2], event.value);
			})
		});

		root.querySelectorAll("*").forEach(this.addNode.bind(this));
	}

	add(key, domElement, domProperty) {
		// return;
		// console.log('add', key, domElement, domProperty);
		// console.log('GLUE.add', this.model.data, key, this.model.get(key));
		this.bindings.push([key, domElement, domProperty]);
		// this.root.querySelector(domElement)
		this.view.find(domElement).set(domProperty, this.model.get(key));
	}

	addNode(domElement) {
		// console.log('addNode', domElement);
		var keys = domElement.attributes;
		for (var i = 0; i < keys.length; i++) {
			if (keys[i].name.split('-')[0] == 'bind')
				this.add(keys[i].value, domElement, keys[i].name.split('-')[1]);
		}
	}

}


// if ('setPath' in data) this.model = data;
// 
// for (var i in this.bindings)
// 	if (node == this.bindings[i][1])
// 		this.model.setPath(this.bindings[i][0], value);


// for (var i in this.bindings)
// 	if (event.key == this.bindings[i][0])
// 		this.view.find(this.bindings[i][1]).set(this.bindings[i][2], event.value);


// Object.defineProperty(this.model, "bind", {
// 	enumerable: false,
// 	value: (dataKey, domElement, domProperty) => {
// 		this.bindings.push([dataKey, domElement, domProperty]);
// 		this.view.find(domElement).set(domProperty, this.model[dataKey]);
// 	}
// });