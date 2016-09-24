VIEW = function(node) {
	var changeHandlers = [];
	this.onChange = function(f) {
		changeHandlers.push(f);
		return this;
	}
	var callback = function(event) {
		// for (var i = 0; i < changeHandlers.length; i++)
		for (var i in changeHandlers)
			changeHandlers[i](event)
	}
	new MutationObserver(function(mutations) {
		mutations.forEach(function(event) {
			// console.log('dom-change', event);
			// if (event.type == 'childList')
			// 	if (event.addedNodes.length)
			// 		if (event.addedNodes[0].nodeType == 1)
			// 			for (var i = 0; i < changeHandlers.length; i++)
			// 				changeHandlers[i]({
			// 					node: event.target,
			// 					children: event.addedNodes
			// 						// removed: event.removedNodes
			// 				});
			if (event.type == 'attributes') {
				// var value = event.target.getAttribute(event.attributeName);
				// if (event.attributeName == 'hidden') value = event.target.hidden;
				callback({
					node: event.target,
					key: event.attributeName,
					value: getProperty(event.target, event.attributeName)
				});
			}
		})
	}).observe(node, {
		attributes: true,
		childList: true,
		// characterData: true,
		subtree: true
	});

	var checked = function(domElement) {
		return (['radio', 'checkbox'].indexOf(domElement.type) > -1)
	}

	node.addEventListener('input', function(event) {
		if (checked(event.target)) return;
		callback({
			node: event.target,
			key: 'value',
			value: event.target.value
		});
	});
	node.addEventListener('change', function(event) {
		if (!checked(event.target)) return;
		callback({
			node: event.target,
			key: 'checked',
			value: event.target.checked
		});
	});
	var defaultProperty = function(domElement) {
		if (checked(domElement)) return 'checked';
		if ('value' in domElement) return 'value';
		// if (domElement.value !== undefined) return value;
		// if (['INPUT', 'TEXTAREA', 'PROGRESS'].indexOf(domElement.tagName) > -1) return 'value';
		return 'html';
	};
	var specialProperty = function(domProperty) {
		return (['value', 'checked', 'hidden'].indexOf(domProperty) > -1)
	}
	var getProperty = function(domElement, domProperty) {
		// console.log('VIEW.getProperty', domElement);
		// if (typeof domElement == 'string') domElement = node.querySelector(domElement);
		if (!domProperty) domProperty = defaultProperty(domElement);

		if (specialProperty(domProperty))
			return domElement[domProperty];
		if (domProperty == 'html')
			return domElement.innerHTML;
		return domElement.getAttribute(domProperty);
		// switch (domProperty) {
		// 	case 'value':
		// 	case 'checked':
		// 	case 'hidden':
		// 		return domElement[domProperty];
		// 		// return domElement.checked;
		// 		// return domElement.hidden;
		// 	case 'html':
		// 		return domElement.innerHTML;
		// 	default:
		// 		return domElement.getAttribute(domProperty);
		// }
	};
	var setProperty = function(domElement, domProperty, value) {
		// if (value === undefined) return;
		// if (typeof domElement == 'string') domElement = node.querySelector(domElement);
		if (!domProperty) domProperty = defaultProperty(domElement);
		if (getProperty(domElement, domProperty) == value) return;
		// console.log('VIEW.setProperty', domElement, value);
		// console.log('defaultProperty', domProperty);
		if (specialProperty(domProperty))
			domElement[domProperty] = value;
		else if (domProperty == 'html')
			domElement.innerHTML = value;
		else
			domElement.setAttribute(domProperty, value);
		// switch (domProperty) {
		// 	case 'value':
		// 	case 'checked':
		// 	case 'hidden':
		// 		return domElement[domProperty] = value;
		// 		// return domElement.checked = value;
		// 		// return domElement.hidden = value;
		// 	case 'html':
		// 		return domElement.innerHTML = value;
		// 	default:
		// 		return domElement.setAttribute(domProperty, value);
		// }
	}

	this.get = getProperty;
	this.set = setProperty;

}


// if (['radio', 'checkbox'].indexOf(event.target.type) > -1) return;
// if (['radio', 'checkbox'].indexOf(event.target.type) == -1) return;


// console.log('VIEW.defaultProperty', domElement);
// if (['radio', 'checkbox'].indexOf(domElement.type) > -1)


// var updateView = function(domElement, domProperty, value) {
// 	if (value === undefined) return;
// 	console.log('update', domElement, domProperty, value, getProp(domElement, domProperty));
// 	// return;
// 	if (getProp(domElement, domProperty) != value)
// 		setProp(domElement, domProperty, value);
// }



// var input = function(event) {
// 	// console.log('change-event', event);
// 	var domElement = event.target;
// 	var value = domElement.value;
// 	if (domElement.type == 'checkbox') value = domElement.checked;
// 	callback({
// 		node: event.target,
// 		key: 'value',
// 		value: value
// 	});
// }

// // console.log('change-event', event);
// var domElement = event.target;
// var value = domElement.value;
// if (domElement.type == 'checkbox') value = domElement.checked;
// node.addEventListener('keyup', input);
// node.addEventListener('change', input);