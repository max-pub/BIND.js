class NODE {
	constructor(node) {
		this.node = node;
	}
	getDefaultProperty() {
		if (this.isCheckElement()) return 'checked';
		if ('value' in this.node) return 'value';
		return 'html';
	}

	get(property) {
		if (!property) property = this.getDefaultProperty();
		if (['value', 'checked', 'hidden', 'innerHTML', 'textContent'].includes(property))
			return this.node[property];
		return this.node.getAttribute(property);
	}

	set(property, value) {
		// console.log('Node.set', this.node, property, this.get(property), value);
		// if (!property) property = this.getDefaultProperty();
		if (this.get(property) == value) return;
		if (['value', 'checked', 'hidden', 'innerHTML', 'textContent'].includes(property))
			this.node[property] = value;
		else
			this.node.setAttribute(property, value);
	}

	isCheckElement() {
		return ['radio', 'checkbox'].includes(this.node.type)
	}
}