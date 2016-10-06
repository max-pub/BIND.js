const CustomElements = {};
document.addEventListener("DOMContentLoaded", () => {

	new MutationObserver(mutations => {
		mutations.forEach(event => {
			console.log('mutation on', event.target);
			addTags(event.target);
		})
	}).observe(document.body, {
		childList: true,
		subtree: true
	});

	let addTags = root => {
		// console.log('add Tags to', root);
		let todo = [];
		let templates = document.querySelectorAll('template');
		for (let i = 0; i < templates.length; i++) {
			let tags = root.querySelectorAll(templates[i].id);
			for (let j = 0; j < tags.length; j++)
				todo.push({
					tag: tags[j],
					template: templates[i]
				});

		}
		todo.forEach(todo => {
			// console.log('do', item);
			console.log('add CustomElement', todo.tag, todo.template);
			// console.log('parent', tag.parentNode);
			todo.tag.innerHTML = todo.template.innerHTML;
			let ce = new CustomElements[todo.template.id](todo.tag);
			ce.DOM = todo.tag;
			todo.tag.CE = ce;
			if ('connectedCallback' in ce)
				ce.connectedCallback();
		})
	}

	addTags(document.body);
})