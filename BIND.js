class BIND {
	constructor(root, data = {}) {
		this.bindings = []; // each item = [dataPath, node, property]
		this.view = new TREE(root).onChange((node, property, value) => {
			// console.log('BIND.viewChange', node, property, value);
			this.bindings.map(item => {
				if (node == item[1])
					this.model.setPath(item[0], value);
			})
		});
		this.model = DATA(data).onChange(event => {
			// console.log('BIND.dataChange', event);
			this.bindings.map(item => {
				if (event.key == item[0])
					this.view.find(item[1]).set(item[2], event.value);
			})
		});
		Object.defineProperty(this.model, "bind", {
			enumerable: false,
			value: (dataKey, domElement, domProperty) => {
				this.bindings.push([dataKey, domElement, domProperty]);
				this.view.find(domElement).set(domProperty, this.model[dataKey]);
			}
		});

		root.querySelectorAll("*").forEach(this.bindNodeProperties.bind(this));
	}

	bindNodeProperties(domElement) {
		var keys = domElement.attributes;
		for (var i = 0; i < keys.length; i++) {
			if (keys[i].name.split('-')[0] == 'bind')
				this.model.bind(keys[i].value, domElement, keys[i].name.split('-')[1]);
		}
	}

}
// for (var i in this.bindings)
// 	if (node == this.bindings[i][1])
// 		this.model.setPath(this.bindings[i][0], value);


// for (var i in this.bindings)
// 	if (event.key == this.bindings[i][0])
// 		this.view.find(this.bindings[i][1]).set(this.bindings[i][2], event.value);