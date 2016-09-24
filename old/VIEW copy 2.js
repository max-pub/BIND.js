class TREE {
	constructor(root) {
		this.changeHandlers = [];
		new MutationObserver(mutations => {
			mutations.forEach(event => {
				if (event.type == 'attributes')
					this.fireChange(event.target, event.attributeName, this.find(event.target).get(event.attributeName));
			})
		}).observe(root, {
			attributes: true,
			childList: true,
			// characterData: true,
			subtree: true
		});

		root.addEventListener('input', event => {
			if (!this.find(event.target).isCheckElement())
				this.fireChange(event.path[0], 'value', event.path[0].value);
		});
		root.addEventListener('change', event => {
			if (this.find(event.target).isCheckElement())
				this.fireChange(event.target, 'checked', event.target.checked);
		});
	}

	onChange(f) {
		this.changeHandlers.push(f);
		return this;
	}

	fireChange(node, property, value) {
		this.changeHandlers.forEach(f => f(node, property, value))
	}

	find(node) {
		return new LEAF(node);
	}
}

// for (var i in this.changeHandlers)
// 	this.changeHandlers[i](node, property, value)



class LEAF {
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
		if (LEAF.isSpecialProperty(property))
			return this.node[property];
		if (property == 'html')
			return this.node.innerHTML;
		return this.node.getAttribute(property);
	}

	set(property, value) {
		if (!property) property = this.getDefaultProperty();
		if (this.get(property) == value) return;
		if (LEAF.isSpecialProperty(property))
			this.node[property] = value;
		else if (property == 'html')
			this.node.innerHTML = value;
		else
			this.node.setAttribute(property, value);
	}

	isCheckElement() {
		return ['radio', 'checkbox'].includes(this.node.type)
	}
	static isSpecialProperty(property) {
		return ['value', 'checked', 'hidden'].includes(property)
	}
}