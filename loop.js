class DOMloop {
	constructor(root, data) { // data gotta be a list
		this.root = root;
		this.data = data;
		data._push = data.push
		data.push = LIST.push;
		Object.defineProperty(data, "_loop", {
			// configurable: true,
			// writable: false,
			enumerable: false,
			value: () => {
				return this;
			}
		});
		this.data.forEach(this.addItem.bind(this));
	}
	addItem(item) {
		// this.data._loop = this;
		let clone = this.root.content.querySelector('*').cloneNode(true);
		this.root.parentNode.insertBefore(clone, this.root.nextSibling);
		// this.root.insertBefore(clone, this.root);
		new GLUE(clone, item);
	}

	static findNodes(root, data) {
		// if (!(data instanceof ObjectObserver))
		// 	data = new ObjectObserver(data);
		root.querySelectorAll('template[loop]').forEach(item => {
			let list = data.data[item.getAttribute('loop')];
			new DOMloop(item, list);
		});
	}
}

LIST = {
	push: function(a) {
		console.log("MAX PUSH", a, this._loop());
		this._push(a);
	}
}