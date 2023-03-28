
/*const $el = function (selector, external = false) {
	Object.prototype.ElementsArray = !external ? _selectElement() : selector;
	
	function _selectElement() {
		return document.querySelectorAll(selector);
	}
	
	console.log(selector)
	
	ElementsArray.makeBlue = function () {
		for (var i = 0; i < ElementsArray.length; i++) {
			ElementsArray[i].style.backgroundColor = "blue";
		}
		// so elementsArray will now have function to make all of its
		// div blues. but if you want to have chain like that, we have to return this array not just make all of it blue
		return ElementsArray;
	}
	
	ElementsArray.makeRed = function () {
		for (var i = 0; i < ElementsArray.length; i++) {
			ElementsArray[i].style.backgroundColor = "red";
		}
		return ElementsArray;
	}
	return ElementsArray;
}

Object.prototype.ElementsArray = function () {
	return $el(this, true);
}*/


/*
!function (e, t) {
	"use strict";
	"object" == typeof module && "object" == typeof module.exports ? module.exports = e.document ? t(e, !0) : function (e) {
		if (!e.document) throw new Error("jQuery requires a window with a document");
		return t(e)
	} : t(e)
}("undefined" != typeof window ? window : this, function (C, e) {
	"use strict";
*/

/*const version = 'v2.0.0', fbUtil = function (selector, context) {
	return new fbUtil.fb.init(selector, context)
}

fbUtil.fb = fbUtil.prototype = {
	length: 0,
	constructor: fbUtil,
	FBValidator: version,
	hasValidConstructor: function (element) {
		return element.constructor.name.toUpperCase() === 'NODELIST' || element.constructor.name.toUpperCase() === 'S' || element.constructor.name.toUpperCase() === 'JQUERY'
	},
	initToArray: function (element) {
		return this.hasValidConstructor(element) ? Array.from(element) : (Array.isArray(element) ? element : [element])
	}
}

let util = fbUtil.fb, init = util.init = function (selector, context) {
	const elem = _init();
	let _this = this
	
	elem && elem.forEach((node, idx) => {
		_this[idx] = node;
		_this.length++;
	});
	
	function _init() {
		try {
			const _context = context && util.initToArray(context)[0];
			stretch.classAdd(util.initToArray(selector), 'marked');
			
			if (util.hasValidConstructor(selector)) {
				if (context) {
					const target = util.initToArray(selector);
					
					if (target.length) {
						let _target = target[0];
						
						if (target.length < 2) {
							const _selector = `#${_target.id}` || _target.tagName.toLowerCase();
							return _context.querySelectorAll(_selector);
						}
						// target.forEach(element => element.classList.add(className))
						target.classListAdd('fb-marked');
						const selected = _context.querySelectorAll('.fb-marked');
						target.classListRemove('fb-marked');
						selected.classListRemove('fb-marked');
						return selected;
					}
				}
				return selector;
			}
			return context ? [].slice.call(_context.querySelectorAll(selector)) : document.querySelectorAll(selector);
		} catch (error) {
			/!* Uncomment for debugging purposes only. *!/
			// console.error(error);
			return false;
		}
	}
	
	return this;
}, stretch = util.stretch = {
	classAdd: function (element, ...tokenList) {
		element.forEach((node, idx) => {
			util[idx] = node
			util.length++;
		});
		util.classListAdd(...tokenList);
	}
}
init.prototype = fbUtil.fb;

fbUtil.fb.classListAdd = function (...tokenList) {
	console.log(this, tokenList)
	return this;
}

window.fbUtil = window.$fs = fbUtil;
/!*init.prototype = $el.fb;
root = $(document);*!/

/!*})*!/
// $fs($('div'), document.querySelector('html'));
$fs('form').stretch.classAdd(['form'])*/


/*
const forms = {
	login: '#login-form',
};

Object.keys(forms).filter((form, idx) => {
	let validator = {},
		formSelector = forms[form],
		_form = $el(formSelector);
	
	if (_form.length) {
		validator[form] = _form.FBValidator(form_group);
		const formValidator = validator[form];
		
		if (formValidator === validator.login)
			formValidator.validationConfig = {
				validatePassword: true
			}
		
		formValidator.initValidation();
		console.log(formValidator.validationConfig);
	}
});
*/

// const validator = $el('#login-form').FBValidator(form_group);

/*const validator = document.querySelector('#login-form').FBValidator(form_group);
validator.validationConfig = {
	validateEmail: true,
	validateName: true
}*/
/*
validator.touchConfig({
	validateEmail: true
}, validator.validationConfig);
console.log(validator, validator.config)
*/

// const utils = $fs('#login-form');

// utils.dataAttribute('id');
