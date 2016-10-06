'use strict';
const CustomElements = {};
document.addEventListener('DOMContentLoaded', function() {
	new MutationObserver(function(mutations) {
		for (let i = 0; i < mutations.length; i++)
			addTags(mutations[i].target)
	}).observe(document.body, {
		childList: true,
		subtree: true
	});
	let addTags = function addTags(root) { // console.log('add Tags to', root);
		var todo = [];
		var templates = document.querySelectorAll('template');
		for (let i = 0; i < templates.length; i++) {
			var tags = root.querySelectorAll(templates[i].id);
			for (let j = 0; j < tags.length; j++) {
				todo.push([tags[j], templates[i]])
			}
		}
		for (let i = 0; i < todo.length; i++) {
			let tag = todo[i][0],
				template = todo[i][1];
			console.log('add CustomElement', tag, template); // console.log('parent', tag.parentNode);
			tag.innerHTML = template.innerHTML;
			let ce = new CustomElements[template.id](tag);
			ce.DOM = tag;
			tag.CE = ce;
			if ('connectedCallback' in ce) ce.connectedCallback()
		}
	};
	addTags(document.body)
});