let currentAnimation,
	// Short Functions
	isFunction = (value) => (typeof value).toUpperCase() === 'FUNCTION',
	isObject = (object) => (typeof object).toUpperCase() === 'OBJECT' || object.constructor && (object.constructor.name.toUpperCase() === 'OBJECT');

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
				
				if (_this.#_constructorIsHTMLElement(selector) || _this.#_hasValidConstructor(selector)) {
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
	
	#_constructorIsHTMLElement(element) {
		return element.constructor.name.toUpperCase().includes('HTML');
	}
	
	#_hasValidConstructor(element) {
		return element.constructor.name.toUpperCase() === 'FB' || element.constructor.name.toUpperCase() === 'NODELIST' || element.constructor.name.toUpperCase() === 'S' || element.constructor.name.toUpperCase() === 'JQUERY'
	}
	
	#_initToArray(element) {
		return this.#_hasValidConstructor(element) ? Array.from(element) : (this.#_constructorIsHTMLElement(element) ? [element] : (Array.isArray(element) ? element : [element]))
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
	
	#_handleEvent({event, prefix, callback}) {
		const handler = `${prefix}${event.type}`, eventsSource = [
			'onblur',
			'onchange',
			'onclick',
			'onfocus',
			'oninput',
			'onkeydown',
			'onkeypress',
			'onkeyup',
			'onmouseenter',
			'onmouseleave',
			'onmouseover'
		], allowedEvents = new Set(eventsSource);
		
		allowedEvents.has(handler.toLowerCase()) ?
			callback(event) :
			console.error(`Given Event - ${handler} - is not allowed.\r\nList of Allowed Events:\r\n [${eventsSource}]`);
	}
	
	/*#_runFunction(fn) {
		const action = () => {
			console.log(currentAnimation);
			return fn()
		};
		
		return !!currentAnimation ? currentAnimation.finished.then(() => action()) : action();
	}*/
	
	/**
	 * Perform called animations with optional callback
	 * @param animation {string}
	 * @param timeout {number}
	 * @param iterations {number|function}
	 * @param callback {null|function}
	 * @returns {*}
	 */
	async #_animations({animation, timeout = 300, iterations = 1, callback = null}) {
		let that = this, keyframesRule, defaultKeyframe, ongoingAnim;
		
		/**
		 * FadeIn Animation
		 * @param callback
		 * @returns {FB}
		 */
		const fadeIn = (callback) => {
			ongoingAnim = `fadeIn`;
			defaultKeyframe = [{opacity: 0}, {opacity: 0.3333333333333333}, {opacity: 0.6666666666666667}, {opacity: 1}];
			
			keyframesRule = {
				keyFrames: defaultKeyframe,
				timing: {duration: timeout, iterations: iterations}
			};
			
			target.forEach(element => {
				const elementDisplay = window.getComputedStyle(element).display;
				
				elementDisplay.toLowerCase() === 'none' && (element.style.display = 'block');
				currentAnimation = element.animate(keyframesRule.keyFrames, keyframesRule.timing);
				currentAnimation.id = ongoingAnim;
				
				currentAnimation.finished.then(() => isFunction(callback) && callback(element));
			});
			return this
		}
		
		/**
		 * FadeOut Animation
		 * @param callback
		 * @returns {FB}
		 */
		const fadeOut = (callback) => {
			ongoingAnim = `fadeOut`;
			defaultKeyframe = [{opacity: 1}, {opacity: 0.6666666666666667}, {opacity: 0.3333333333333333}, {opacity: 0}];
			
			keyframesRule = {
				keyFrames: defaultKeyframe,
				timing: {duration: timeout, iterations: iterations}
			};
			
			target.forEach(element => {
				const elementDisplay = window.getComputedStyle(element).display;
				
				elementDisplay.toLowerCase() === 'none' && (element.style.display = 'block');
				currentAnimation = element.animate(keyframesRule.keyFrames, keyframesRule.timing);
				currentAnimation.id = ongoingAnim;
				
				currentAnimation.finished.then(() => {
					element.style.display = 'none';
					isFunction(callback) && callback(element)
				});
			});
			return this
		}
		
		/**
		 * SlideIn-Down Animation
		 * @param callback
		 * @returns {FB}
		 */
		const slideInDown = (callback) => {
			ongoingAnim = `slideInDown`;
			defaultKeyframe = [{transform: 'translateY(-100vh)'}, {transform: 'translateY(-66.66666666666667vh)'}, {transform: 'translateY(-33.33333333333333vh)'}, {transform: 'translateY(0)'}];
			
			keyframesRule = {
				keyFrames: defaultKeyframe,
				timing: {duration: timeout, iterations: iterations}
			};
			
			target.forEach(element => {
				currentAnimation = element.animate(keyframesRule.keyFrames, keyframesRule.timing);
				currentAnimation.id = ongoingAnim;
				currentAnimation.finished.then(() => isFunction(callback) && callback(element));
			});
			return this
		}
		
		/**
		 * SlideIn-Up Animation
		 * @param callback
		 * @returns {FB}
		 */
		const slideInUp = (callback) => {
			ongoingAnim = `slideInUp`;
			defaultKeyframe = [{transform: 'translateY(100vh)'}, {transform: 'translateY(66.66666666666667vh)'}, {transform: 'translateY(33.33333333333333vh)'}, {transform: 'translateY(0)'}];
			
			keyframesRule = {
				keyFrames: defaultKeyframe,
				timing: {duration: timeout, iterations: iterations}
			};
			
			target.forEach(element => {
				currentAnimation = element.animate(keyframesRule.keyFrames, keyframesRule.timing);
				currentAnimation.id = ongoingAnim;
				currentAnimation.finished.then(() => isFunction(callback) && callback(element));
			});
			return this;
		};
		
		/**
		 * SlideOut-Up Animation
		 * @param callback
		 * @returns {FB}
		 */
		const slideOutUp = (callback) => {
			ongoingAnim = `slideOutUp`;
			defaultKeyframe = [{transform: 'translateY(0)'}, {transform: 'translateY(-33.33333333333333vh)'}, {transform: 'translateY(-66.66666666666667vh)'}, {transform: 'translateY(-100vh)'}];
			
			keyframesRule = {
				keyFrames: defaultKeyframe,
				timing: {duration: timeout, iterations: iterations}
			};
			
			target.forEach(element => {
				currentAnimation = element.animate(keyframesRule.keyFrames, keyframesRule.timing);
				currentAnimation.id = ongoingAnim;
				currentAnimation.finished.then(() => isFunction(callback) && callback(element));
			});
			return this
		}
		
		/**
		 * SlideOut-Down Animation
		 * @param callback
		 * @returns {FB}
		 */
		const slideOutDown = (callback) => {
			ongoingAnim = `slideOutDown`;
			defaultKeyframe = [{transform: 'translateY(0)'}, {transform: 'translateY(33.33333333333333vh)'}, {transform: 'translateY(66.66666666666667vh)'}, {transform: 'translateY(100vh)'}];
			
			keyframesRule = {
				keyFrames: defaultKeyframe,
				timing: {duration: timeout, iterations: iterations}
			};
			
			target.forEach(element => {
				currentAnimation = element.animate(keyframesRule.keyFrames, keyframesRule.timing);
				currentAnimation.id = ongoingAnim;
				currentAnimation.finished.then(() => isFunction(callback) && callback(element));
			});
			return this
		}
		
		const target = this.#_getTarget(), animations = {
			fadeInAnim: fadeIn,
			fadeOutAnim: fadeOut,
			slideInUpAnim: slideInUp,
			slideOutUpAnim: slideOutUp,
			slideInDownAnim: slideInDown,
			slideOutDownAnim: slideOutDown,
		}, targetAnimation = animations[animation];
		return await targetAnimation(callback);
	}
	
	/**
	 *
	 * @param animation
	 * @param timeout
	 * @param iterations
	 * @param callback
	 * @returns {Promise<FB>}
	 */
	#_callAnimation(animation, timeout, iterations, callback = null) {
		const callAnimation = () => isFunction(iterations) ?
			this.#_animations({animation: animation, timeout: timeout, callback: iterations}) :
			this.#_animations({animation: animation, timeout: timeout, iterations: iterations, callback: callback})
		return !!currentAnimation ? currentAnimation.finished.then(() => callAnimation()) : callAnimation();
	}
	
	/**
	 *
	 * @param timeout
	 * @param iterations
	 * @param callback
	 * @returns {Promise<FB>}
	 */
	fadein(timeout = 300, iterations = 1, callback = null) {
		return this.#_callAnimation('fadeInAnim', timeout, iterations, callback);
	}
	
	/**
	 *
	 * @param timeout
	 * @param iterations
	 * @param callback
	 * @returns {Promise<FB>}
	 */
	fadeout(timeout = 300, iterations = 1, callback = null) {
		return this.#_callAnimation('fadeOutAnim', timeout, iterations, callback);
	}
	
	/**
	 *
	 * @param timeout
	 * @param iterations
	 * @param callback
	 * @returns {Promise<FB>}
	 */
	slideInUp(timeout = 300, iterations = 1, callback = null) {
		return this.#_callAnimation('slideInUpAnim', timeout, iterations, callback);
	}
	
	/**
	 *
	 * @param timeout
	 * @param iterations
	 * @param callback
	 * @returns {Promise<FB>}
	 */
	slideInDown(timeout = 300, iterations = 1, callback = null) {
		return this.#_callAnimation('slideInDownAnim', timeout, iterations, callback);
	}
	
	/**
	 *
	 * @param timeout
	 * @param iterations
	 * @param callback
	 * @returns {Promise<FB>}
	 */
	slideOutUp(timeout = 300, iterations = 1, callback = null) {
		return this.#_callAnimation('slideOutUpAnim', timeout, iterations, callback);
	}
	
	/**
	 *
	 * @param timeout
	 * @param iterations
	 * @param callback
	 * @returns {Promise<FB>}
	 */
	slideOutDown(timeout = 300, iterations = 1, callback = null) {
		return this.#_callAnimation('slideOutDownAnim', timeout, iterations, callback);
	}
	
	/**
	 * Add given token(s) to the elements tokenList (class list).
	 * @param tokenList {...String} _String(s) representing the token (or tokens) to add to the tokenList._
	 * @returns {FB}
	 */
	classListAdd(...tokenList) {
		const target = this.#_getTarget();
		target.length && (target.forEach(element => tokenList.forEach(token => element.classList.add(token))));
		return this;
	}
	
	/**
	 * Remove given token(s) from the elements tokenList (class list).
	 * @param tokenList {...String} _String(s) representing the token (or tokens) to remove from the tokenList._
	 * @returns {FB}
	 */
	classListRemove(...tokenList) {
		const target = this.#_getTarget();
		target.length && (target.forEach(element => tokenList.forEach(token => element.classList.remove(token))));
		return this;
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
	 * @returns {FB<touchAttribute>|string}
	 */
	attribute(name, value = null) {
		const target = this.#_getTarget();
		return target.length && ((isObject(name) ?
			this.touchAttribute(name) :
			(name && value) ? this.touchAttribute(name, value) : target[0].getAttribute(name)));
	}
	
	/**
	 * Set the given attribute(s) for the target element.
	 *
	 * _Sets the attribute if name and value is given as String._
	 *
	 * _Sets the given attributes if name is given as Object (Key-Value Pair)._
	 * @param name {string|object}
	 * @param value {string|null}
	 * @returns {FB}
	 */
	touchAttribute(name, value = null) {
		const target = this.#_getTarget();
		target.length && ((isObject(name) && Object.keys(name).length && !value) ?
			Object.keys(name).forEach(attr => target.forEach(element => element.setAttribute(attr, name[attr]))) :
			target.forEach(element => element.setAttribute(name, value)));
		return this;
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
	 * @returns {FB<touchProperty>|string}
	 */
	property(name, value = null) {
		const target = this.#_getTarget();
		return target.length && ((isObject(name) ?
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
	 * @returns {FB}
	 */
	touchProperty(name, value = null) {
		const target = this.#_getTarget();
		target.length && ((isObject(name) && Object.keys(name).length && !value) ?
			Object.keys(name).forEach(prop => target.forEach(element => element[prop] = name[prop])) :
			target.forEach(element => element[name] = value));
		return this;
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
	 * @returns {FB<touchDataAttribute>|string}
	 */
	dataAttribute(name, value = null) {
		const target = this.#_getTarget();
		return target.length && ((isObject(name) ?
			this.touchDataAttribute(name) :
			target.length && ((name && value) ? this.touchDataAttribute(name, value) : target[0].dataset[name])));
	}
	
	/**
	 * Set the given data-* attribute(s) for the target element.
	 *
	 * _Sets the given data-* attribute if name and value is given as a String._
	 *
	 * _Sets the given data-* attributes if name is given as a plain Object (Key-Value Pair)._
	 * @param name {string|Object}
	 * @param value {string|null}
	 * @returns {FB}
	 */
	touchDataAttribute(name, value = null) {
		const target = this.#_getTarget()
		target.length && ((isObject(name) && Object.keys(name).length && !value) ?
			Object.keys(name).forEach(data => target.forEach(element => element.dataset[data] = name[data])) :
			target.forEach(element => element.dataset[name] = value));
		return this;
	}
	
	/**
	 * Set the given CSS style(s) for the target element.
	 *
	 * _Sets the given style if name and value is given as a String._
	 *
	 * _Sets the given styles if name is given as a plain Object (Key-Value Pair)._
	 * @param name {string|Object}
	 * @param value {string|null}
	 * @returns {FB}
	 */
	touchStyle(name, value = null) {
		const target = this.#_getTarget();
		target.length && ((isObject(name) && Object.keys(name).length && !value) ?
			Object.keys(name).forEach(key => target.forEach(element => element.style[key] = name[key])) :
			target.forEach(element => element.style[name] = value));
		return this;
	}
	
	/**
	 * Get or set the given CSS style(s) value of the target element (If a String is passed to the name param).
	 *
	 * _Gets the given style if only the name is given as a String._
	 *
	 * _Sets the given style if name and value is given as a String._
	 *
	 * _Sets the given styles if name is given as a plain Object (Key-Value Pair)._
	 * @param name {string|Object}
	 * @param value {string|null}
	 * @returns {string|touchDataAttribute}
	 */
	style(name, value = null) {
		const target = this.#_getTarget();
		return target.length && ((isObject(name) ?
			this.touchStyle(name) :
			target.length && ((name && value) ? this.touchStyle(name, value) : this.cssProp().getPropertyValue(name))));
	}
	
	/**
	 * Returns a computed object containing the values of all CSS properties of the given element
	 * @param pseudoElement
	 * @returns {CSSStyleDeclaration}
	 */
	cssProp(pseudoElement = null) {
		const target = this.#_getTarget();
		return window.getComputedStyle(target[0], pseudoElement);
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
		/*return this.#_runFunction(() => {*/
		Object.keys(target[0]).filter(value => Number.isNaN(parseInt(value)) && target[0][value])
			.forEach(property => propertiesList[property] = target[0][property]);
		return propertiesList;
		/*});*/
	}
	
	/**
	 * Add event listener(s) to the given element with callback event.
	 * @param events {string|Object|DocumentEventMap}
	 * @param callback {function|null}
	 * @param option {boolean}
	 * @returns {FB}
	 */
	upon(events, callback = null, option = false) {
		const target = this.#_getTarget();
		target.forEach(element => {
			isObject(events) ?
				Object.keys(events).forEach(event => element.addEventListener(event, (evt) => this.#_handleEvent({event: evt, prefix: 'on', callback: events[event]}), option)) :
				(isFunction(callback) ? element.addEventListener(events, (evt) => callback(evt), option) : console.error('Undefined Listener'));
		});
		return this;
	}
}

Object.defineProperties(Object.prototype, {
	FUInit: {
		value: function () {
			return $fs(this);
		}, enumerable: false
	}
});

window.isFunction = isObject;
window.isObject = isObject;

const $fs = (selector, context) => new FB(selector, context);

const test = $fs('form');

/*test.touchAttribute({test: true}).attribute('boss');*/
// test.touchProperty({novalidate: true}).listProperties();

// $('form').FUInit().property('test-prop', 'boss');

/*test.touchProperty({novalidate: true}).attribute({test: true}).slideInUp(800)
	.then(e => e.fadeout(1500)
		.then(e => e.fadein(1500)));
console.log(test.listAttributes());*/

test.upon({
	click: (e) => console.log(e.currentTarget)
});
