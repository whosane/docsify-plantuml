import skin from './skin';
import {
	encode
}
from 'plantuml-encoder';

var LANG = 'plantuml';
var SELECTOR = 'pre[data-lang="' + LANG + '"]';

export function plant(content, config) {
	content = skin(config.skin) + content;
	var urlPrefix = (config.serverPath || '//www.plantuml.com/plantuml/svg/');
	var svgUrl = urlPrefix + encode(createUrls(content));
	return '<object type="image/svg+xml" data="' + svgUrl + '" />';
}

function createUrls(content) {
	var location = window.location.toString();
	var currenturl = location.substring(0, location.lastIndexOf('/') + 1);

	return content.replace(/\[\[\$((?:\.?\.\/)*)/g, resolvePath);

	// solution taken from docsify codebase
	function resolvePath(_, path) {
		var segments = (currenturl + path).split('/');
		var resolved = [];
		for (var i = 0, len = segments.length; i < len; i++) {
			var segment = segments[i];
			if (segment === '..') {
				resolved.pop();
			} else if (segment !== '.') {
				resolved.push(segment);
			}
		}
		return '[[' + resolved.join('/');
	}
}

export function replace(content, selector, config) {
	var dom = window.Docsify.dom;
	var $ = dom.create('span', content);

	if (!$.querySelectorAll) {
		return content;
	}

	(dom.findAll($, selector) || []).forEach(function(element) {
		var parent = element.parentNode;
		var planted = dom.create('div', plant(element.innerText, config));
		if (parent) {
			planted.dataset.lang = LANG;
			element.parentNode.replaceChild(planted, element);
		}
	});
	return $.innerHTML;
}

export function install(hook, vm) {
	const config = Object.assign({}, {
		skin: 'default',
		renderSvgAsObject: true
	}, vm.config.plantuml);
	hook.afterEach(function(content) {
		return replace(content, SELECTOR, config);
	});
}
