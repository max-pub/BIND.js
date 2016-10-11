class GLUE {
	constructor(root, data = {}) {
		this.bindings = []; // each item = [dataPath, node, property]
		this.root = root;

		this.view = new DOMObserver(root);
		if (data instanceof ObjectObserver) this.model = data;
		else this.model = new ObjectObserver(data);

		this.view.onChange((event) => {
			// console.log('GLUE.viewChange', node, property, value);
			this.bindings.forEach(item => {
				if (event.node == item.node)
					this.model.set(item.key, event.value);
			})
		});
		this.model.onChange(event => {
			// console.log('GLUE.dataChange', event);
			this.bindings.forEach(item => {
				if (event.key == item.key)
					this.view.find(item.node).set(item.property, event.value);
			})
		});

		root.querySelectorAll("*").forEach(this.addNode.bind(this));
	}

	add(key, domElement, domProperty) {
		this.bindings.push({
			key: key,
			node: domElement,
			property: domProperty
		});
		// console.log('GLUE.add', key, domElement, domProperty, this.model.data, this.model.get(key));
		this.view.find(domElement).set(domProperty, this.model.get(key));
	}

	addNode(domElement) {
		var keys = domElement.attributes;
		for (var i = 0; i < keys.length; i++) {
			if (keys[i].name.split('-')[0] == 'bind')
				this.add(keys[i].value, domElement, keys[i].name.split('-')[1]);
		}
	}

}