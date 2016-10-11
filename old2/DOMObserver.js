class DOMObserver {
	constructor(root) {
		this.changeHandlers = [];
		this.observe(root);
		// if ('shadowRoot' in root) this.observe(root.shadowRoot);
	}
	observe(root) {
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

	fireChange(node, attribute, value) {
		this.changeHandlers.forEach(f => f({
			node,
			attribute,
			value
		}))
	}

	find(node) {
		return new NODE(node);
	}
}