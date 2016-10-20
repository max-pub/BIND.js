class GLUE {
	constructor(root, data = {}) {
		this.oneWay = [];
		this.twoWay = [];
		this.root = root;
		this.regex = new RegExp(/(\[\[[A-Za-z0-9\.]+\]\])/g);

		this.view = new DOMObserver(root);
		if (data instanceof ObjectObserver) this.model = data;
		else this.model = new ObjectObserver(data);

		this.view.onChange((event) => {
			// console.log('GLUE.viewChange', event);
			this.twoWay.forEach(glue => {
				// console.log('--test',event.node, glue.node, event.node == glue.node);
				if (event.node == glue.node)
					this.model.setPath(glue.keys[0], event.value);
			})
		});
		this.model.onChange(event => {
			// console.log('GLUE.dataChange', event);
			this.twoWay.forEach(glue => {
				if (glue.keys.includes(event.key))
					this.updateNode(glue)
			});
			this.oneWay.forEach(glue => {
				if (glue.keys.includes(event.key))
					this.updateNode(glue)
			});
		});

		root.querySelectorAll("*").forEach(this.checkNode.bind(this));
		DOMloop.findNodes(root, this.model);

		// console.log(this.oneWay);
		// console.log(this.twoWay);
	}
	updateNode(glue) {
		// console.log('updateNode', glue.keys);
		var string = glue.string;
		glue.keys.forEach(key => {
			string = string.replace('[[' + key + ']]', this.model.getPath(key));
		})
		new NODE(glue.node).set(glue.attribute, string);
	}
	add(domElement, domProperty, string, keys) {
		// console.log(domElement, domProperty, string, keys);
		var glue = {
			node: domElement,
			attribute: domProperty,
			keys: keys,
			string: string
		};
		if (domProperty == 'textContent') var attr = domElement.textContent;
		else var attr = domElement.getAttribute(domProperty);
		if (attr == '[[' + keys[0] + ']]')
			this.twoWay.push(glue);
		else
			this.oneWay.push(glue);
		this.updateNode(glue);
	}

	checkNode(domElement) {
		// console.log('check', domElement);
		var props = domElement.attributes;
		for (var i = 0; i < props.length; i++) {
			this.checkAttribute(domElement, props[i].name, props[i].value);
		}
		this.checkAttribute(domElement, 'textContent', domElement.textContent);
	}
	checkAttribute(node, key, val) {
		// console.log('check', node, key, val);
		if (this.regex.test(val)) { // contains bindings
			var keys = val.match(this.regex).map(item => {
				return item.slice(2, -2)
			});
			this.add(node, key, val, keys);
		}

	}

}