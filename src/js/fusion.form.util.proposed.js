class FB {
	constructor(selector, context) {
		const _this = this;
		const target = _init();
		_this.length = 0;
		
		target && target.forEach((element, idx) => {
			_this[idx] = element;
			_this.length++
		});
		
		function _init() {
			try {
				const _context = context && _this.#_initToArray(context)[0];
				
				if (_this.#_hasValidConstructor(selector)) {
					if (context) {
						const target = _this.#_initToArray(selector);
						
						if (target.length) {
							if (target.length < 2) {
								const _target = target[0], _selector = `#${_target.id}` || _target.tagName.toLowerCase();
								return _context.querySelectorAll(_selector);
							}
							
							_this.#_createTemporalContext(target); // Create Temp context for targets
							_this.classListAdd('fb-init-mark'); // mark targets
							
							const selected = document.querySelectorAll('.fb-init-mark'); // select marked targets
							_this.#_createTemporalContext(selected); // Create Temp context for marked targets
							
							_this.classListRemove('fb-init-mark'); // unmark targets
							_this.#_deleteTemporalContext(); // Delete created Temp context
							
							return selected;
						}
					}
					// return selector;
					return _this.#_initToArray(selector);
				}
				return context ? [].slice.call(_context.querySelectorAll(selector)) : document.querySelectorAll(selector);
			} catch (error) {
				/* Uncomment for debugging purposes only. */
				// console.error(error);
				return false;
			}
		}
		
		return _this
	}
	
	#_hasValidConstructor(element) {
		return element.constructor.name.toUpperCase() === 'FB' || element.constructor.name.toUpperCase() === 'NODELIST' || element.constructor.name.toUpperCase() === 'S' || element.constructor.name.toUpperCase() === 'JQUERY'
	}
	
	#_initToArray(element) {
		return this.#_hasValidConstructor(element) ? Array.from(element) : (Array.isArray(element) ? element : [element])
	}
	
	#_getTarget() {
		return this.internal ? this.#_initToArray(this.internal) : this.#_initToArray(this);
	}
	
	#_createTemporalContext(object) {
		this.internal = object;
		// this.originalLength = this.length;
		this.length = object.length;
	}
	
	#_deleteTemporalContext() {
		// this.length = this.originalLength
		delete this.internal
		// delete this.originalLength
	}
	
	/**
	 * Add given token(s) to the elements tokenList (class list).
	 * @param tokenList {...String} _String(s) representing the token (or tokens) to add to the tokenList._
	 * @returns {[HTMLElement]}
	 */
	classListAdd(...tokenList) {
		const target = this.#_getTarget();
		target.length && (target.forEach(element => tokenList.forEach(token => element.classList.add(token))));
		return target;
	}
	
	/**
	 * Remove given token(s) from the elements tokenList (class list).
	 * @param tokenList {...String} _String(s) representing the token (or tokens) to remove from the tokenList._
	 * @returns {[HTMLElement]}
	 */
	classListRemove(...tokenList) {
		const target = this.#_getTarget();
		target.length && (target.forEach(element => tokenList.forEach(token => element.classList.remove(token))));
		return target;
	}
	
	/**
	 * Get or Set the given attribute for the target element (If a String is passed to the key param).
	 *
	 * _Gets the attribute if only the name is given as a String._
	 *
	 * _Sets the attribute if key and value is given as a String._
	 *
	 * _Sets the given attributes if name is given as a plain Object (Key-Value Pair)._
	 * @param name {string|Object}
	 * @param value {string|null}
	 * @returns {touchAttribute|string}
	 */
	attribute(name, value = null) {
		const target = this.#_getTarget();
		return target.length && ((fbUtil.isObject(name) ?
			target.touchAttribute(name) :
			(name && value) ? target.touchAttribute(name, value) : target[0].getAttribute(name)));
	}
	
	/**
	 * Set the given attribute(s) for the target element.
	 *
	 * _Sets the attribute if key and value is given as String._
	 *
	 * _Sets the given attributes if key is given as Object (Key-Value Pair)._
	 * @param name {string|object}
	 * @param value {string|null}
	 * @returns {[HTMLElement]}
	 */
	touchAttribute(name, value = null) {
		const target = this.#_getTarget();
		target.length && ((fbUtil.isObject(name) && Object.keys(name).length && !value) ?
			Object.keys(name).forEach(attr => target.forEach(element => element.setAttribute(attr, name[attr]))) :
			target.forEach(element => element.setAttribute(name, value)));
		return target;
	}
	
	/**
	 * Get or Set the given property / properties for the target element (If a String is passed to the key param).
	 *
	 * _Gets the property if only the name is given as a String._
	 *
	 * _Sets the property if key and value is given as a String._
	 *
	 * _Sets the given properties if name is given as a plain Object (Key-Value Pair)._
	 * @param name {string|Object}
	 * @param value {any}
	 * @returns {touchProperty|string}
	 */
	property(name, value = null) {
		const target = this.#_getTarget();
		return target.length && ((fbUtil.isObject(name) ?
			this.touchProperty(name) :
			(name && value) ? this.touchProperty(name, value) : target[0][name]));
	}
	
	
	/**
	 * Set the given property / properties for the target element.
	 *
	 * _Sets the property if name and value is given as a String._
	 *
	 * _Sets the given properties if name is given as a plain Object (Key-Value Pair)._
	 * @param name {string|object}
	 * @param value {string|null}
	 * @returns {[HTMLElement]}
	 */
	touchProperty(name, value = null) {
		const target = this.#_getTarget();
		target.length && ((fbUtil.isObject(name) && Object.keys(name).length && !value) ?
			Object.keys(name).forEach(prop => target.forEach(element => element[prop] = name[prop])) :
			target.forEach(element => element[name] = value));
		return target;
	}
	
	/**
	 * Get or set the given data-* attribute(s) value of the target element (If a String is passed to the name param).
	 *
	 * _Gets the given data-* attribute if only the name is given as a String._
	 *
	 * _Sets the given data-* attribute if name and value is given as a String._
	 *
	 * _Sets the given data-* attributes if name given as a plain Object (Key-Value Pair)._
	 * @param name {string|Object}
	 * @param value
	 * @returns {string|touchDataAttribute}
	 */
	dataAttribute(name, value = null) {
		const target = this.#_getTarget();
		return target.length && (value ? this.touchDataAttribute(name, value) : target[0].dataset[name]);
	}
	
	/**
	 * Set the given data-* attribute(s) for the target element.
	 *
	 * _Sets the given data-* attribute if name and value is given as a String._
	 *
	 * _Sets the given data-* attributes if name is given as a plain Object (Key-Value Pair)._
	 * @param name {string|Object}
	 * @param value {string|null}
	 * @returns {[HTMLElement]}
	 */
	touchDataAttribute(name, value = null) {
		const target = this.#_getTarget();
		target.length && ((fbUtil.isObject(name) && Object.keys(name).length && !value) ?
			Object.keys(name).forEach(data => target.forEach(element => element[data] = name[data])) :
			target.forEach(element => element.dataset[name] = value));
		return target;
	}
	
	/**
	 * Set the given CSS style(s) for the target element.
	 *
	 * _Sets the given style if name and value is given as a String._
	 *
	 * _Sets the given styles if name is given as a plain Object (Key-Value Pair)._
	 * @param name {string|Object}
	 * @param value {string|null}
	 * @returns {[HTMLElement]}
	 */
	touchStyle(name, value) {
		const target = this.#_getTarget();
		target.length && ((fbUtil.isObject(name) && Object.keys(name).length && !value) ?
			Object.keys(name).forEach(key => target.forEach(element => element.style = name[key])) :
			target.forEach(element => element.style[name] = value));
		return target;
	}
	
	style(name, value) {
		const target = this.#_getTarget();
		return target.length && (value ? this.touchStyle(name, value) : this.cssProp().getPropertyValue(name));
	}
	
	cssProp() {
		const target = this.#_getTarget();
		return window.getComputedStyle(target[0]);
	}
	
	/**
	 * Returns the attributes of the given element as on Object.
	 * @returns {Object} A Key-Value pair Object representing the attribute as names and values
	 */
	listAttributes() {
		const attributesList = {}, target = this.#_getTarget();
		(Array.from(target[0].attributes)).forEach(attribute => attributesList[attribute.name] = attribute.value);
		return attributesList
	}
	
	/**
	 * Returns the properties of the given element as on Object.
	 * @returns {Object} A Key-Value pair Object representing the properties as names and values
	 */
	listProperties() {
		const propertiesList = {}, target = this.#_getTarget();
		Object.keys(target[0]).filter(value => isNaN(parseInt(value)) && target[0][value])
			.forEach(property => propertiesList[property] = target[0][property]);
		return propertiesList;
	}
}

Object.defineProperties(Object.prototype, {
	FUInit: {
		value: function () {
			return $fs(this);
		}, enumerable: false
	}
});

const fbUtil = {
	isObject: function (object) {
		return (typeof object).toUpperCase() === 'OBJECT' || object.constructor && object.constructor.name.toUpperCase() === 'OBJECT';
	}
}

const $fs = (selector, context) => new FB(selector, context);

const test = $fs('form');

test.touchProperty('test', 'true');
test.touchProperty({novalidate: true});

$('form').FUInit().property('test-prop', 'boss')

test.style('display', 'inline');
console.log(test.listProperties());

console.log(test.property('style'))
