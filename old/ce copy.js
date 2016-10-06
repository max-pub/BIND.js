CustomElements = {};
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
		document.querySelectorAll('template').forEach(template => {
			// console.log('template', template, template.id);
			root.querySelectorAll(template.id).forEach(tag => {
				todo.push([tag, template]);
			})
		});
		todo.forEach(([tag, template]) => {
			// console.log('do', item);
			console.log('add CustomElement', tag, template);
			// console.log('parent', tag.parentNode);
			tag.innerHTML = template.innerHTML;
			let ce = new CustomElements[template.id](tag);
			ce.DOM = tag;
			tag.CE = ce;
			if ('connectedCallback' in ce)
				ce.connectedCallback();
		})
	}

	addTags(document.body);
})