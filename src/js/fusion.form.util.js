let currentAnimation,
	buttonLoader = '.button-loader',
	globalMessageTag = '#global-message-wrapper',
	globalModalWrapper = '#global-modal-wrapper';

const alert_d = 'alert-danger';
const alert_i = 'alert-info';
const alert_s = 'alert-success';

const fa_check = 'far fa-1x fa-check';
const fa_check_c = 'far fa-1x fa-check-circle';
const fa_check_d = 'far fa-1x fa-check-double';
const fa_exc = 'far fa-1x fa-exclamation';
const fa_exc_c = 'far fa-1x fa-exclamation-circle';
const fa_info = 'far fa-1x fa-info';
const fa_info_c = 'far fa-1x fa-info-circle';
const fa_wifi_s = 'far fa-1x fa-wifi-slash';

const errorBag = {}, errorCount = {};

/** Short Functions **/
/**
 * Creates new FBUtil Object with selected element.
 *
 * _Returns an empty Object if the element is not found_
 * @param selector {string|Iterable|Object} HTMLString or Iterable
 * @param context {string|Iterable|Object|null} The Element context to select from. Accepts HTMLString or Iterable
 * @return {FBUtil<HTMLElement>} A new FBUtil Object
 */
const $fs = (selector, context = null) => new FBUtil(selector, context);

/**
 * Checks if the given Value is a function
 * @param value {*}
 * @return {boolean}
 */
const isFunction = (value) => (typeof value).toUpperCase() === 'FUNCTION';

/**
 * Checks id the given Value is a String
 * @param value {*}
 * @return {boolean}
 */
const isString = (value) => (typeof value).toUpperCase() === 'STRING';

/**
 * Checks if the given value is an Object
 * @param object {*}
 * @return {boolean}
 */
const isObject = (object) => !!object && ((typeof object).toUpperCase() === 'OBJECT' || object.constructor && (object.constructor.name.toUpperCase() === 'OBJECT'));

/**
 * Creates a new instance of Bootstrap Alert on the given element.
 * @param element
 * @returns {Alert}
 */
const newBsAlert = (element) => new bootstrap.Alert(element);

/**
 * Creates a new instance of Bootstrap Modal on the given element.
 * @param element
 * @param options
 * @returns {Modal}
 */
const newBsModal = (element, options) => new bootstrap.Modal(element, options);

/**
 *
 * @param number {number}
 * @return {string}
 */
const formatNumber = (number) => number.toLocaleString('en-US', {minimumFractionDigits: 2})

const checkLuhn = (input) => {
	const sumDigit = (c) => (c < 10) ? c :
		sumDigit(Math.trunc(c / 10) + (c % 10));
	
	return input.split('').reverse()
		.map(Number)
		.map((c, i) => i % 2 !== 0 ? sumDigit(c * 2) : c)
		.reduce((acc, v) => acc + v) % 10 === 0;
}

const modalCallback = (callback) => {
	$fs('.modal').target.forEach(modal => {
		let _target = $fs(modal),
			id = _target.attribute('id');
		callback(_target, id);
	});
}

/**
 * Parses the given value as a boolean returns true if the value is any of:
 *
 * _[true, 'true', 1, '1', 'on', 'yes']_;
 *
 * Returns false otherwise.
 * @param value {*}
 * @return {boolean}
 */
const parseBool = (value) => {
	switch (value) {
		case true:
		case 'true':
		case 1:
		case '1':
		case 'on':
		case 'yes':
			return true;
		default:
			return false;
	}
}

/**
 * Converts spaces to commas in a string.
 * @param value {string}
 * @return {string}
 */
const spaceToComma = (value) => {
	return value.trim().split(/[ ,]+/g).filter((val) => {
		return val !== '';
	}).join(', ');
}

/**
 * Converts given string case to Title-Case with optional string replacement using RegExp
 * @param value {string} String to convert
 * @param regExpReplace {RegExp} Regular Expression
 * @return {string} Converted String
 */
const titleCase = (value, regExpReplace = /[-_]/gi) => {
	let replaced = '',
		replace = value.replaceAll(regExpReplace, ' '),
		nameSplit = replace.split(/\s+/gi);
	
	nameSplit.forEach((split, idx) => {
		let splinted = split.split(''),
			firstWord = splinted[0]
		splinted[0] = firstWord.toUpperCase();
		replaced += idx === (nameSplit.length - 1) ? splinted.join('') : `${splinted.join('')} `;
	});
	return replaced;
}

/**
 * Checks if the given string or Response is JSON Parsable
 * @param JSONString {string|Response}
 * @return {boolean}
 */
const canParseJSON = (JSONString) => {
	try {
		JSON.parse(JSONString)
		return true
	} catch (e) {
		return false
	}
}

/**
 * Perform a fetch request using the [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API).
 *
 *
 * @param uri {string}
 * @param method {string}
 * @param data {Object|null}
 * @param dataType {string}
 * @param beforeSend {function|null}
 * @param onComplete {function|null}
 * @param onSuccess {function|null}
 * @param onError {function|null}
 */
const fetchReq = ({uri = '', method = 'get', data = null, dataType = 'json', beforeSend, onComplete, onSuccess, onError}) => {
	const allowedErrorStatuses = new Set([401, 402, 422, 423, 426, 451, 511]);
	let status,
		statusText,
		responseData;
	isFunction(beforeSend) && beforeSend();
	
	fetch(uri, {
		method: method,
		body: data,
	}).then(response => {
		responseData = response;
		status = responseData.status;
		statusText = responseData.statusText;
		
		try {
			const consumed = response[dataType]();
			return (response.ok || (status > 299 && status < 400) || allowedErrorStatuses.has(status)) ? consumed : Promise.reject(response);
		} catch (e) {
			return console.error(e)
		}
	}).then(data => {
		responseData.responseText = canParseJSON(data) ? data : JSON.stringify(data);
		responseData.responseJSON = dataType === 'json' ? (canParseJSON(data) ? JSON.parse(data) : data) : null
		
		status > 199 && status < 300 && isFunction(onSuccess) && onSuccess(responseData, status, statusText);
		isFunction(onComplete) && onComplete(responseData, status, statusText);
	}).catch(err => isFunction(onError) && onError(err, status, statusText));
}

/*classes*/
/**
 * Base
 *
 * _Base Component_
 */
class FBBase {
	/**
	 *
	 * @param selector {string|Iterable|Object|null}
	 * @param context {string|Iterable|Object|null}
	 * @return {FBBase}
	 */
	constructor(selector, context = null) {
		const _this = this;
		const target = _init();
		const initDocumentArray = this.#_initToArray(document);
		
		_this.length = 0;
		_this.prev = {};
		_this.prev.length = 0;
		
		initDocumentArray.forEach((e, i) => {
			_this.prev[i] = e
			_this.prev.length++;
		});
		
		target && target.forEach((element, idx) => {
			_this[idx] = element;
			_this.length++
		});
		
		function _init() {
			try {
				const _context = context && ((!_this.#_hasValidConstructor(context) && !_this.#_constructorIsHTMLElement(context)) ?
					_this.#_initToArray(document.querySelectorAll(context))[0] :
					_this.#_initToArray(context)[0]);
				
				if (_this.#_constructorIsHTMLElement(selector) || _this.#_isIterable(selector)) {
					const target = _this.#_initToArray(selector);
					
					if (context)
						if (target.length) {
							if (target.length < 2) {
								const _target = target[0], _selector = `#${_target.id}` || _target.tagName.toLowerCase();
								return _context.querySelectorAll(_selector);
							}
							
							_this.#_createTemporalContext(target); // Create Temp context for targets
							_this.internal.forEach(element => element.classList.add('fb-init-mark')); // mark targets;*/
							
							const selected = _context.querySelectorAll('.fb-init-mark'); // select marked targets
							_this.internal.forEach(element => element.classList.remove('fb-init-mark')); // unmark targets*/
							_this.#_deleteTemporalContext(); // Delete created Temp context
							
							return selected;
						}
					// return selector;
					return target;
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
		return element.constructor.name.toUpperCase().includes('FB') || element.constructor.name.toUpperCase() === 'NODELIST' || element.constructor.name.toUpperCase() === 'S' || element.constructor.name.toUpperCase() === 'JQUERY'
	}
	
	#_isIterable(element) {
		return this.#_hasValidConstructor(element) || element.constructor.name.toUpperCase().includes('COLLECTION') || Array.isArray(element);
	}
	
	#_initToArray(element) {
		return this.#_isIterable(element) ? Array.from(element) : (this.#_constructorIsHTMLElement(element) ? [element] : [element]);
	}
	
	#_getTarget() {
		return this.internal ? this.#_initToArray(this.internal) : this.#_initToArray(this);
	}
	
	#_createTemporalContext(object) {
		this.internal = object;
	}
	
	#_deleteTemporalContext() {
		delete this.internal;
		this.length = Object.keys(this).length;
	}
	
	/**
	 * Converts the given data to an array.
	 * @return {unknown[] | [*] | [*]}
	 */
	get target() {
		return this.#_getTarget();
	}
	
	/**
	 *
	 * @return {FBUtil}
	 */
	get util() {
		return new FBUtil(this)
	}
	
	/**
	 * Returns the previously selected Object
	 * @return {*|{}}
	 */
	prevObject() {
		return this.prev;
	}
	
	/**
	 * Returns the {id and type} attributes and [data-fb-role] attribute of a field
	 * @return {{role: (""|string), id: (""|string), type: (""|string)}|void}
	 */
	getFieldAttribute() {
		if (this.length) {
			return {
				id: this.util.attribute('id') && this.util.attribute('id').toLowerCase(),
				type: this.util.attribute('type') && this.util.attribute('type').toLowerCase(),
				role: this.util.dataAttribute('fb-role') && this.util.dataAttribute('fb-role').toLowerCase(),
			}
		}
		return console.error('ReferenceError: Element is undefined');
	}
	
	/**
	 * Plugins Current Version
	 * @return {string}
	 */
	static VERSION() {
		return '2.0.0';
	}
	
	static NAME() {
		return 'FB Util & Validator';
	}
}

/**
 * Util
 *
 * _Util Components_
 */
class FBUtil extends FBBase {
	/**
	 *
	 * @param selector {string|Iterable|Object|null}
	 * @param context {string|Iterable|Object|null}
	 */
	constructor(selector, context = null) {
		super(selector, context)
	}
	
	/**
	 *
	 * @return {FBClassList}
	 */
	get classlist() {
		return new FBClassList(this);
	}
	
	/**
	 *
	 * @return {FBHtml}
	 */
	get html() {
		return new FBHtml(this);
	}
	
	/**
	 *
	 * @return {FBBSModal}
	 */
	get modal() {
		return new FBBSModal(this);
	}
	
	/**
	 *
	 * @return {FBValidator}
	 */
	get validator() {
		return new FBValidator(this);
	}
	
	static NAME() {
		return 'FB Util';
	}
	
	/**
	 * Returns the specified action for the element.
	 *
	 * _Makes use of the action attribute of the element if available;_
	 *
	 * _Makes use of the [data-action] attribute otherwise_
	 * @return {string|void}
	 */
	get action() {
		const _target = this, target = _target.target;
		if (target.length) {
			return this.isFormElement(target[0]) ?
				(_target.attribute('action') || target[0].action) :
				_target.dataAttribute('action')
		}
		return console.error('ReferenceError: Element is Undefined.', this);
	}
	
	/**
	 * Returns the submission method of the given form.
	 * @return {string|void}
	 */
	get formMethod() {
		const _target = this, target = _target.target;
		if (target.length) {
			return this.isFormElement(target[0]) ?
				(target[0].method ?? _target.attribute('method')) :
				console.error('ReferenceError: Non Form element given.', this);
		}
		return console.error('ReferenceError: Element is Undefined.', this);
	}
	
	/**
	 *
	 * @return {unknown[] | [*] | [*]}
	 */
	#_getTarget() {
		return this.target;
	}
	
	/**
	 * Returns true if the given element is a Form element. Returns false otherwise.
	 * @param element {HTMLElement|null}
	 * @return {boolean}
	 */
	isFormElement(element = null) {
		return !!element ?
			element.tagName.toUpperCase() === 'FORM' :
			this[0].tagName.toUpperCase() === 'FORM';
	}
	
	/**
	 * Checks if the given form field element is an Email field.
	 * @return {boolean|void}
	 */
	isEmailField() {
		const target = this.target;
		if (target.length) {
			const attributes = this.getFieldAttribute();
			return !!((attributes.type && attributes.type.includes('email')) || (attributes.role && attributes.role.includes('email')) || (attributes.id && attributes.id.match(/(mail)/gi)));
		}
		return console.warn('ReferenceError: Element is Undefined');
	}
	
	/**
	 * Checks if the given form field element is a Name field.
	 * @return {boolean|void}
	 */
	isNameField() {
		const target = this.target;
		if (target.length) {
			const attributes = this.getFieldAttribute();
			return !!((attributes.role && attributes.role.includes('name')) || (attributes.id && attributes.id.match(/(name)/gi)));
		}
		return console.warn('ReferenceError: Element is Undefined');
	}
	
	/**
	 * Checks if the given form field element is a Password field.
	 * @param passwordId {string|null}
	 * @return {boolean|void}
	 */
	isPasswordField(passwordId = null) {
		const target = this.target;
		if (target.length) {
			const attributes = this.getFieldAttribute();
			return !!(attributes.type === 'password' || (passwordId && (attributes.id && attributes.id.includes(passwordId.toLowerCase()))));
		}
		return console.warn('ReferenceError: Element is Undefined');
	}
	
	/**
	 * Checks if the given form field element is a Phone number field.
	 * @return {boolean|void}
	 */
	isPhoneField() {
		const target = this.target;
		if (target.length) {
			const attributes = this.getFieldAttribute();
			return !!((attributes.type && attributes.type.includes('tel')) || (attributes.role && attributes.role.includes('phone')) || (attributes.id && attributes.id.match(/(phone)/gi)));
		}
		return console.warn('ReferenceError: Element is Undefined');
	}
	
	/**
	 * Checks if the given form field element is a Username field.
	 * @return {boolean|void}
	 */
	isUsernameField() {
		const target = this.target;
		if (target.length) {
			const attributes = this.getFieldAttribute();
			return !!((attributes.role && attributes.role.includes('username')) || (attributes.id && attributes.id.match(/(username)/gi)));
		}
		return console.warn('ReferenceError: Element is Undefined');
	}
	
	/**
	 *
	 * @param prevObject {FBUtil}
	 */
	#_setPrevObject(prevObject) {
		this.prev = new FBUtil();
		this.prev = prevObject;
	}
	
	/**
	 * @param event
	 * @param prefix
	 * @param callback
	 * @return {Error|*}
	 */
	#_handleEvent({event, prefix, callback}) {
		const handler = isString(event) ? `${prefix}${event}` : `${prefix}${event.name}`, /*handler = `${prefix}${event.type}`,*/ eventsSource = [
			'onblur',
			'onchange',
			'onclick',
			'ondomcontentloaded',
			'onfocus',
			'oninput',
			'onkeydown',
			'onkeypress',
			'onkeyup',
			'onload',
			'onmouseenter',
			'onmouseleave',
			'onmouseover',
			'onreset',
			'onsubmit',
			'onclose.bs.alert',
			'onshow.bs.modal',
			'onhide.bs.modal',
			'onshown.bs.modal',
			'onhidden.bs.modal',
		], allowedEvents = new Set(eventsSource);
		
		if (!allowedEvents.has(handler.toLowerCase())) {
			console.error(`Given Event - ${handler} - is not allowed.\r\nList of Allowed Events:\r\n [${eventsSource}]`);
			return new Error(`Given Event - ${handler} - is not allowed.\r\nList of Allowed Events:\r\n [${eventsSource}]`);
		}
		return callback;
	}
	
	/**
	 * Perform called animations with optional callback
	 * @param animation {string}
	 * @param timeout {number}
	 * @param iterations {number|function}
	 * @param callback {null|function}
	 * @returns {*}
	 */
	async #_animations({animation, timeout = 300, iterations = 1, callback = null}) {
		let keyframesRule, defaultKeyframe, ongoingAnim;
		
		/**
		 * FadeIn Animation
		 * @param callback
		 * @returns {FBUtil}
		 */
		const fadein = (callback) => {
			let animationsFinished = 0;
			ongoingAnim = `fadein`;
			defaultKeyframe = [{opacity: 0}, {opacity: 0.3333333333333333}, {opacity: 0.6666666666666667}, {opacity: 1}];
			
			keyframesRule = {
				keyFrames: defaultKeyframe,
				timing: {duration: timeout, iterations: iterations}
			};
			
			return new Promise(resolve => {
				target.forEach(element => {
					const elementDisplay = window.getComputedStyle(element).display;
					
					// elementDisplay.toLowerCase() === 'none' && (element.style.display = 'block');
					currentAnimation = element.animate(keyframesRule.keyFrames, keyframesRule.timing);
					currentAnimation.id = ongoingAnim;
					currentAnimation.finished.then(() => {
						animationsFinished += 1;
						if (animationsFinished === target.length) {
							// element.style.display = 'none';
							isFunction(callback) && callback(element);
							resolve(this);
						}
					});
				});
			});
		}
		
		/**
		 * FadeOut Animation
		 * @param callback
		 * @returns {FBUtil}
		 */
		const fadeout = (callback) => {
			let animationsFinished = 0;
			ongoingAnim = `fadeout`;
			defaultKeyframe = [{opacity: 1}, {opacity: 0.6666666666666667}, {opacity: 0.3333333333333333}, {opacity: 0}];
			
			keyframesRule = {
				keyFrames: defaultKeyframe,
				timing: {duration: timeout, iterations: iterations}
			};
			
			return new Promise(resolve => {
				target.forEach(element => {
					const elementDisplay = window.getComputedStyle(element).display;
					
					// elementDisplay.toLowerCase() === 'none' && (element.style.display = 'block');
					currentAnimation = element.animate(keyframesRule.keyFrames, keyframesRule.timing);
					currentAnimation.id = ongoingAnim;
					currentAnimation.finished.then(() => {
						animationsFinished += 1;
						if (animationsFinished === target.length) {
							// element.style.display = 'none';
							isFunction(callback) && callback(element);
							resolve(this);
						}
					});
				});
			});
		}
		
		/**
		 * SlideIn-Down Animation
		 * @param callback
		 * @returns {FBUtil}
		 */
		const slideInDown = (callback) => {
			let animationsFinished = 0;
			ongoingAnim = `slideInDown`;
			defaultKeyframe = [{transform: 'translateY(-100vh)'}, {transform: 'translateY(-66.66666666666667vh)'}, {transform: 'translateY(-33.33333333333333vh)'}, {transform: 'translateY(0)'}];
			
			keyframesRule = {
				keyFrames: defaultKeyframe,
				timing: {duration: timeout, iterations: iterations}
			};
			
			return new Promise(resolve => {
				target.forEach(element => {
					currentAnimation = element.animate(keyframesRule.keyFrames, keyframesRule.timing);
					currentAnimation.id = ongoingAnim;
					currentAnimation.finished.then(() => {
						animationsFinished += 1;
						if (animationsFinished === target.length) {
							isFunction(callback) && callback(element);
							resolve(this);
						}
					});
				});
			});
		}
		
		/**
		 * SlideIn-Up Animation
		 * @param callback
		 * @returns {FBUtil}
		 */
		const slideInUp = (callback) => {
			let animationsFinished = 0;
			ongoingAnim = `slideInUp`;
			defaultKeyframe = [{transform: 'translateY(100vh)'}, {transform: 'translateY(66.66666666666667vh)'}, {transform: 'translateY(33.33333333333333vh)'}, {transform: 'translateY(0)'}];
			
			keyframesRule = {
				keyFrames: defaultKeyframe,
				timing: {duration: timeout, iterations: iterations}
			};
			
			return new Promise(resolve => {
				target.forEach(element => {
					currentAnimation = element.animate(keyframesRule.keyFrames, keyframesRule.timing);
					currentAnimation.id = ongoingAnim;
					currentAnimation.finished.then(() => {
						animationsFinished += 1;
						if (animationsFinished === target.length) {
							isFunction(callback) && callback(element);
							resolve(this);
						}
					});
				});
			});
		};
		
		/**
		 * SlideOut-Up Animation
		 * @param callback
		 * @returns {FBUtil}
		 */
		const slideOutUp = (callback) => {
			let animationsFinished = 0;
			ongoingAnim = `slideOutUp`;
			defaultKeyframe = [{transform: 'translateY(0)'}, {transform: 'translateY(-33.33333333333333vh)'}, {transform: 'translateY(-66.66666666666667vh)'}, {transform: 'translateY(-100vh)'}];
			
			keyframesRule = {
				keyFrames: defaultKeyframe,
				timing: {duration: timeout, iterations: iterations}
			};
			
			return new Promise(resolve => {
				target.forEach(element => {
					currentAnimation = element.animate(keyframesRule.keyFrames, keyframesRule.timing);
					currentAnimation.id = ongoingAnim;
					currentAnimation.finished.then(() => {
						animationsFinished += 1;
						if (animationsFinished === target.length) {
							isFunction(callback) && callback(element);
							resolve(this);
						}
					});
				});
			});
		}
		
		/**
		 * SlideOut-Down Animation
		 * @param callback
		 * @returns {FBUtil}
		 */
		const slideOutDown = (callback) => {
			let animationsFinished = 0;
			ongoingAnim = `slideOutDown`;
			defaultKeyframe = [{transform: 'translateY(0)'}, {transform: 'translateY(33.33333333333333vh)'}, {transform: 'translateY(66.66666666666667vh)'}, {transform: 'translateY(100vh)'}];
			
			keyframesRule = {
				keyFrames: defaultKeyframe,
				timing: {duration: timeout, iterations: iterations}
			};
			
			return new Promise(resolve => {
				target.forEach(element => {
					currentAnimation = element.animate(keyframesRule.keyFrames, keyframesRule.timing);
					currentAnimation.id = ongoingAnim;
					currentAnimation.finished.then(() => {
						animationsFinished += 1;
						if (animationsFinished === target.length) {
							isFunction(callback) && callback(element);
							resolve(this);
						}
					});
				});
			});
		}
		
		const target = this.#_getTarget(), animations = {
			fadeInAnim: fadein,
			fadeOutAnim: fadeout,
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
	 * @returns {Promise<FBUtil>}
	 */
	#_callAnimation(animation, timeout, iterations, callback = null) {
		const callAnimation = () => isFunction(iterations) ?
			this.#_animations({animation: animation, timeout: timeout, callback: iterations}) :
			this.#_animations({animation: animation, timeout: timeout, iterations: iterations, callback: callback})
		return !!currentAnimation ? currentAnimation.finished.then(() => callAnimation()) : callAnimation();
	}
	
	/**
	 * Add fadein Animation to target element.
	 * @param timeout {number} The animations duration
	 * @param iterations {number} Number of times to run the animation
	 * @param callback {function|null} Optional Callback
	 * @returns {Promise<FBUtil>} Returns a promise after the animation is done.
	 */
	fadein(timeout = 300, iterations = 1, callback = null) {
		return this.#_callAnimation('fadeInAnim', timeout, iterations, callback);
	}
	
	/**
	 * Add fadeout Animation to target element.
	 * @param timeout {number} The animations duration
	 * @param iterations {number} Number of times to run the animation
	 * @param callback {function|null} Optional Callback
	 * @returns {Promise<FBUtil>} Returns a promise after the animation is done.
	 */
	fadeout(timeout = 300, iterations = 1, callback = null) {
		return this.#_callAnimation('fadeOutAnim', timeout, iterations, callback);
	}
	
	/**
	 * Add SlideIn-up Animation to target element.
	 * @param timeout {number} The animations duration
	 * @param iterations {number} Number of times to run the animation
	 * @param callback {function|null} Optional Callback
	 * @returns {Promise<FBUtil>} Returns a promise after the animation is done.
	 */
	slideInUp(timeout = 300, iterations = 1, callback = null) {
		return this.#_callAnimation('slideInUpAnim', timeout, iterations, callback);
	}
	
	/**
	 * Add SlideIn-down Animation to target element.
	 * @param timeout {number} The animations duration
	 * @param iterations {number} Number of times to run the animation
	 * @param callback {function|null} Optional Callback
	 * @returns {Promise<FBUtil>} Returns a promise after the animation is done.
	 */
	slideInDown(timeout = 300, iterations = 1, callback = null) {
		return this.#_callAnimation('slideInDownAnim', timeout, iterations, callback);
	}
	
	/**
	 * Add SlideOut-up Animation to target element.
	 * @param timeout {number} The animations duration
	 * @param iterations {number} Number of times to run the animation
	 * @param callback {function|null} Optional Callback
	 * @returns {Promise<FBUtil>} Returns a promise after the animation is done.
	 */
	slideOutUp(timeout = 300, iterations = 1, callback = null) {
		return this.#_callAnimation('slideOutUpAnim', timeout, iterations, callback);
	}
	
	/**
	 * Add SlideOut-down Animation to target element.
	 * @param timeout {number} The animations duration
	 * @param iterations {number} Number of times to run the animation
	 * @param callback {function|null} Optional Callback
	 * @returns {Promise<FBUtil>} Returns a promise after the animation is done.
	 */
	slideOutDown(timeout = 300, iterations = 1, callback = null) {
		return this.#_callAnimation('slideOutDownAnim', timeout, iterations, callback);
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
	 * @returns {FBUtil}
	 */
	touchAttribute(name, value = null) {
		const target = this.#_getTarget();
		target.length && ((isObject(name) && Object.keys(name).length && !value) ?
			Object.keys(name).forEach(attr => target.forEach(element => element.setAttribute(attr, name[attr]))) :
			target.forEach(element => element.setAttribute(name, value)));
		return this;
	}
	
	/**
	 * Removes the given attributes from the element.
	 * @param name {...string}
	 * @return {FBUtil}
	 */
	removeAttribute(...name) {
		const target = this.#_getTarget();
		(target.length && name) && name.forEach(attribute => target.forEach(element => element.removeAttribute(attribute)));
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
	 * @returns {FBUtil}
	 */
	touchProperty(name, value = null) {
		const target = this.#_getTarget();
		target.length && ((isObject(name) && Object.keys(name).length && !value) ?
			Object.keys(name).forEach(prop => target.forEach(element => element[prop] = name[prop])) :
			target.forEach(element => element[name] = value));
		return this;
	}
	
	/**
	 * Get or set the given [data-*] attribute(s) value of the target element (If a String is passed to the name param).
	 *
	 * _Gets the given [data-*] attribute if only the name is given as a String._
	 *
	 * _Sets the given [data-*] attribute if name and value is given as a String._
	 *
	 * _Sets the given [data-*] attributes if name given as a plain Object (Key-Value Pair)._
	 * @param name {string|Object}
	 * @param value
	 * @returns {FB<touchDataAttribute>|string}
	 */
	dataAttribute(name, value = null) {
		const target = this.#_getTarget();
		
		if (!isObject(name)) {
			let replaced = '',
				nameSplit = name.split('-')
			
			nameSplit.forEach((split, idx) => {
				if (idx) {
					let splinted = split.split(''),
						firstWord = splinted[0]
					splinted[0] = firstWord.toUpperCase();
					replaced += splinted.join('');
				}
			});
			name = `${nameSplit[0]}${replaced}`
		}
		
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
	 * @returns {FBUtil}
	 */
	touchDataAttribute(name, value = null) {
		const target = this.#_getTarget();
		target.length && ((isObject(name) && Object.keys(name).length && !value) ?
			Object.keys(name).forEach(data => target.forEach(element => element.dataset[data] = name[data])) :
			target.forEach(element => element.dataset[name] = value));
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
	 * @returns {string|touchStyle}
	 */
	style(name, value = null) {
		const target = this.#_getTarget();
		return target.length && ((isObject(name) ?
			this.touchStyle(name) :
			target.length && ((name && value) ? this.touchStyle(name, value) : this.cssProp().getPropertyValue(name))));
	}
	
	/**
	 * Set the given CSS style(s) for the target element.
	 *
	 * _Sets the given style if name and value is given as a String._
	 *
	 * _Sets the given styles if name is given as a plain Object (Key-Value Pair)._
	 * @param name {string|Object}
	 * @param value {string|null}
	 * @returns {FBUtil}
	 */
	touchStyle(name, value = null) {
		const target = this.#_getTarget();
		target.length && ((isObject(name) && Object.keys(name).length && !value) ?
			Object.keys(name).forEach(key => target.forEach(element => element.style[key] = name[key])) :
			target.forEach(element => element.style[name] = value));
		return this;
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
	 * Disables the element.
	 * @param enable {boolean}
	 * @return {FBUtil}
	 */
	disable(enable = false) {
		const _target = this, target = _target.target;
		
		if (target.length) {
			target.forEach(element => {
				const tagName = element.tagName && element.tagName.toLowerCase(), _element = $fs(element);
				
				tagName !== 'a' ?
					(!enable ? _element.property({disabled: true}) : _element.property({disabled: false})) :
					(!enable ? _element.classlist.put('disabled') : _element.classlist.remove('disabled'));
			});
			return this
		}
	}
	
	/**
	 * Returns the attributes of the given element as on Object.
	 * @returns {Object} A Key-Value pair Object representing the attribute as names and values
	 */
	listAttributes() {
		const attributesList = {}, target = this.#_getTarget();
		(Array.from(target[0].attributes)).forEach(attribute => attributesList[attribute.name] = attribute.value);
		return attributesList;
	}
	
	/**
	 * Returns the properties of the given element as on Object.
	 * @returns {Object} A Key-Value pair Object representing the properties as names and values
	 */
	listProperties() {
		const propertiesList = {}, target = this.#_getTarget();
		Object.keys(target[0]).filter(value => Number.isNaN(parseInt(value)) && target[0][value])
			.forEach(property => propertiesList[property] = target[0][property]);
		return propertiesList;
	}
	
	/**
	 * Returns the direct descendants (Children) of the target element.
	 *
	 * _Returns the child that matches the selector if the selector is given else the direct previous sibling is returned._
	 * @param selector {string|null}
	 * @return {FBUtil<HTMLElement>}
	 */
	children(selector = null) {
		const target = this.#_getTarget(), children = [];
		
		$fs(target[0].children).target.forEach(child => {
			if (isString(selector)) {
				if ($fs(child).selectorMatches(selector)) {
					children.push(child)
				}
			} else {
				children.push(child)
			}
		});
		const _children = $fs(children);
		_children.#_setPrevObject(this)
		return _children;
	}
	
	/**
	 * Returns the elements siblings.
	 *
	 * _Returns the sibling that matches the selector if the selector is given else the direct previous sibling is returned._
	 * @param selector {string|null}
	 * @return {FBUtil<HTMLElement>}
	 */
	siblings(selector = null) {
		const target = this.#_getTarget(), siblings = [];
		
		$fs(target[0].parentNode.children).target.filter(sibling => {
			if (isString(selector)) {
				if (sibling !== target[0] && $fs(sibling).selectorMatches(selector)) {
					siblings.push(sibling)
				}
			} else {
				if (sibling !== target[0]) {
					siblings.push(sibling)
				}
			}
		});
		const _siblings = $fs(siblings);
		_siblings.#_setPrevObject(this);
		return _siblings;
	}
	
	/**
	 * Returns the Previous siblings of the target element.
	 *
	 * _Returns the sibling that matches the selector if the selector is given else the direct previous sibling is returned._
	 * @param selector {string|null}
	 * @return {FBUtil<HTMLElement>}
	 */
	prevSiblings(selector = null) {
		const prevSiblings = [], target = this.#_getTarget();
		
		let _prevSibling = target[0].previousElementSibling;
		
		while (_prevSibling) {
			if (isString(selector)) {
				if ($fs(_prevSibling).selectorMatches(selector)) {
					prevSiblings.push(_prevSibling);
					break;
				}
			} else {
				if (_prevSibling !== target[0])
					prevSiblings.push(_prevSibling);
			}
			_prevSibling = _prevSibling.previousElementSibling;
		}
		const _prevSiblings = $fs(prevSiblings);
		_prevSiblings.#_setPrevObject(this);
		return _prevSiblings;
	}
	
	/**
	 * Returns all descendants of the target element.
	 *
	 * _Returns the descendant that matches the selector if the selector is given else the direct previous sibling is returned._
	 * @param selector {string|null}
	 * @return {FBUtil<HTMLElement>}
	 */
	descendants(selector = null) {
		const target = this.#_getTarget(), descendants = [];
		
		$fs('*', target[0]).target.forEach(descendant => {
			if (isString(selector)) {
				if ($fs(descendant).selectorMatches(selector)) {
					descendants.push(descendant);
				}
			} else {
				descendants.push(descendant);
			}
		});
		
		const _descendants = $fs(descendants);
		_descendants.#_setPrevObject(this);
		return _descendants;
	}
	
	/**
	 * Checks if the target element has the given element.
	 *
	 * _Returns the element if true else an empty array Object returned._
	 * @param selector {FBUtil|string|null}
	 * @return {FBUtil}
	 */
	has(selector) {
		const target = this.#_getTarget(), matches = [];
		
		$fs('*', target[0]).target.forEach(node => {
			if (isString(selector)) {
				if ($fs(node).selectorMatches(selector))
					matches.push(node)
			} else {
				$fs(selector).target.forEach(e => {
					if (e === node)
						matches.push(e)
				});
			}
		});
		const _matches = $fs(matches);
		_matches.#_setPrevObject(this);
		return _matches;
	}
	
	/**
	 * Checks if the mouse cursor is over the element.
	 * @return {Promise<boolean>}
	 */
	mouseIsOver() {
		const target = this.#_getTarget();
		
		return new Promise(async resolve => {
			await target.forEach(element => {
				resolve($fs(element).selectorMatches(':hover'))
			});
		});
	}
	
	/**
	 * Checks the status of given CSS Pseudo selector on the target element.
	 * @param selector {string}
	 * @return {boolean}
	 */
	selectorMatches(selector) {
		const target = this.#_getTarget();
		// this.#_setPrevObject();
		return (target[0].matches || target[0].matchesSelector || target[0].msMatchesSelector || target[0].mozMatchesSelector || target[0].webkitMatchesSelector || target[0].oMatchesSelector).call(target[0], selector);
	}
	
	/**
	 * Add event listener(s) to the given element with callback event.
	 * @param events {string|Object|DocumentEventMap}
	 * @param callback {function|null}
	 * @param option {boolean}
	 * @returns {FBUtil}
	 */
	upon(events, callback = null, option = true) {
		const _target = this, target = _target.#_getTarget();
		target.forEach(element => {
			isObject(events) ?
				Object.keys(events).forEach(event => element.addEventListener(event, this.#_handleEvent({event: events[event], prefix: 'on', callback: events[event]}), option)) :
				(isFunction(callback) ? element.addEventListener(events, this.#_handleEvent({event: events, prefix: 'on', callback: callback}), option) : console.error(`Argument 2 [callback] expects Function. ${typeof callback} given.`));
		});
		return this;
	}
	
	step(event) {
		const _target = this, target = _target.#_getTarget();
		const newEvent = new Event(event, {
			bubbles: true,
			cancelable: true
		});
		target.forEach(element => element.dispatchEvent(newEvent));
	}
	
	/**
	 * Check if the target element has a scrollbar in the given direction.
	 *
	 * Default direction is vertical.
	 * @param direction
	 * @return {boolean|Error}
	 */
	hasScrollBar(direction = 'vertical') {
		const _target = this, target = _target.#_getTarget();
		let scrollType = direction === 'vertical' ? 'scrollHeight' : 'scrollWidth',
			clientType = scrollType === 'scrollHeight' ? 'clientHeight' : 'clientWidth';
		
		return !!direction ?
			(direction === 'vertical' || direction === 'horizontal' ?
				target[0][scrollType] > target[0][clientType] :
				new Error(`Specified direction [${direction}] does not meet required arguments: 'vertical' or 'horizontal'`)) :
			new Error('Scroll direction not specified!');
	}
	
	/**
	 * Toggle the disabled state (property) of button.
	 *
	 * _Also toggle the button loader if available._
	 * @param processIsDone {boolean}
	 */
	toggleButtonState(processIsDone = false) {
		const _target = this, target = _target.target;
		
		if (target.length) {
			const buttonLoaderElement = $fs(buttonLoader, _target);
			if ((!_target.property('disabled') || (_target.attribute('disabled') && _target.attribute('disabled').toLowerCase() !== 'disabled')) && !processIsDone) {
				buttonLoaderElement.length && buttonLoaderElement.touchStyle({opacity: 0, display: 'inline-flex'}).fadein().then(element => element.touchStyle({opacity: 1}));
				_target.disable();
			}
			
			if (processIsDone) {
				buttonLoaderElement.length && buttonLoaderElement.fadeout().then(element => element.touchStyle({opacity: 0, display: 'none'}));
				_target.disable(true);
			}
		}
	}
	
	/**
	 * Manipulate the buttons state of a Form Submit form.
	 *
	 * _(**N.B:** ***Depends on the toggleButtonState() function***)._
	 * @param processIsDone {boolean}
	 */
	toggleSubmitButtonState(processIsDone = false) {
		const _target = this, target = _target.target;
		
		if (target.length) {
			if (this.isFormElement(target[0])) {
				const submitButton = $fs('button[type="submit"]', _target).length ? $fs('button[type="submit"]', _target) : $fs(`button[form="${target[0].id}"]`);
				submitButton.toggleButtonState(processIsDone);
			}
		}
	}
	
	/**
	 * Load the given modal with a callback.
	 * @param options {Object|function|null}
	 * @param callback {function|null}
	 * @return {void|FBUtil}
	 */
	onBSModalLoad(options, callback = null) {
		const _target = this, target = _target.target;
		if (target.length) {
			_target[0].addEventListener('show.bs.modal', isFunction(callback) ? callback : (isFunction(options) && options));
			if (target.length > 1)
				target.forEach(element => newBsModal(element, isObject(options) ? options : null).show());
			else
				newBsModal(target[0], isObject(options) ? options : null).show();
			return this;
		}
		return console.error('ReferenceError: Element is undefined.');
	}
	
	/**
	 * Dispose the given modal with a callback.
	 * @param callback
	 */
	onBSModalClose(callback) {
		const _target = this, target = _target.target;
		if (target.length) {
			_target.upon('hide.bs.modal', function (e) {
				if (target.length > 1)
					target.forEach(element => newBsModal(element).hide());
				else
					newBsModal(target[0]).hide();
				isFunction(callback) && callback(e);
			});
		}
	}
	
	/**
	 * Loads specified Page/HTML into the target element from given URI.
	 *
	 * _If the selector parameter is specified, then it will load the content of the specified element for the given URI._
	 * @param uri {string}
	 * @param selector {string|null}
	 * @param data {Object|null}
	 * @param overlay
	 * @param dataType {string}
	 * @param slug {string|null}
	 * @param beforeSend {function|null}
	 * @param callback {function|null}
	 * @return {Promise<unknown>}
	 */
	loadPageData({uri = '', selector = null, data = null, overlay = null, dataType = 'text', slug = 'Page', beforeSend, callback} = {}) {
		const _target = this, target = _target.target;
		
		const requestType = !data ? 'get' : 'post';
		const params = !data ? null : new URLSearchParams(data);
		
		return new Promise((resolve, reject) => {
			target.forEach(element => {
				const _element = $fs(element);
				fetchReq({
					uri: uri,
					method: requestType,
					data: params,
					dataType: dataType,
					beforeSend: beforeSend,
					onError: err => {
						console.error(`${err.status} HTTP error: ${err.statusText} for ${requestType.toUpperCase()} request from URL: ${err.url}`)
						if (overlay)
							if ($fs(overlay).style('display').toString().toLowerCase() !== 'none')
								$fs(overlay).fadeout().then(element => element.touchStyle({display: 'none'}).classlist.remove('overlay-shown'));
						reject(err);
					},
					onSuccess: (data) => {
						let error,
							newData,
							hasError = false;
						
						if (selector) {
							try {
								newData = (new XMLSerializer().serializeToString(new DOMParser().parseFromString(data.responseText, "text/html").querySelector(selector)));
							} catch (e) {
								try {
									// newData = (new XMLSerializer().serializeToString(new DOMParser().parseFromString(data.responseText, "text/html").querySelector(selector)));
									newData = (new XMLSerializer().serializeToString(new DOMParser().parseFromString(data.responseText.replaceAll(/(\\")+/gi, '"').replaceAll(/(\\r)+(\\n)+(\\t)+/gi, ''), "text/html").querySelector(selector)));
									hasError = false;
								} catch (e) {
									error = e;
									hasError = true
								}
							}
							
							if (!hasError) {
								_element.html.insert(newData);
								typeof callback === 'function' && callback();
								resolve({response: data.responseText, status: data.status});
							}
							reject(error)
						} else {
							_element.html.insert(data);
							typeof callback === 'function' && callback();
							resolve({response: data.responseText, status: data.status});
						}
					}
				});
			});
		});
	}
	
	/**
	 * Handle the submission of the target form using the [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
	 *
	 * Returns a promise which can be used to handle actions after response of the resource.
	 * @param uri {string}
	 * @param method {string}
	 * @param data {Object|null}
	 * @param dataType {string}
	 * @param beforeSend {function|null}
	 * @return {Promise<unknown>}
	 */
	handleFormSubmit({uri = '', method = 'get', data = null, dataType = 'json', beforeSend = null} = {}) {
		const _target = this, target = _target.target, _globalMessageTag = $fs(globalMessageTag);
		
		return new Promise((resolve, reject) => {
			target.forEach(function (element) {
				if (_target.isFormElement(element)) {
					const _element = $fs(element);
					const formData = new FormData(element);
					const messageTag = _element.validator.messageTag;
					const form = {
						hasErrors: !!(_element.validator.getErrors.count),
						errors: _element.validator.getErrors.errors
					};
					data && Object.keys(data).length && Object.keys(data).forEach(key => formData.append(key, data[key]));
					let _messageTag = messageTag.length ? messageTag : (_globalMessageTag.length && _globalMessageTag);
					
					!form.hasErrors ? fetchReq({
						uri: uri,
						method: method,
						data: formData,
						dataType: dataType,
						beforeSend: () => {
							_element.toggleSubmitButtonState();
							messageTag.html.insert(_element.validator.waitText).fadein().then();
						},
						onError: (err, status) => {
							setTimeout(() => {
								_messageTag.renderMessage(fa_wifi_s, alert_d, 'Server error occurred, please try again.', null, element, true);
								_element.toggleSubmitButtonState(true);
								reject({response: err, status: status, messageTag: _messageTag, form: element});
							}, 1500);
						},
						onComplete: xhr => {
							let response = xhr.responseJSON,
								responseText = xhr.responseText,
								status = xhr.status;
							
							setTimeout(() => {
								if ((status > 199 && status < 300 || status === 308)) {
									if (status === 308 && dataType === 'json') {
										if (_messageTag.length) {
											_messageTag.renderMessage(fa_check_c, alert_s, response.message, null, element, false, true);
											_messageTag === messageTag ?
												setTimeout(() => _messageTag.fadeout().then(() => setTimeout(() => location.href = response.redirect, 2000)), 1000) :
												_messageTag === _globalMessageTag && _messageTag.slideInDown().then(target => setTimeout(() => target.slideOutUp().then(() => location.href = response.redirect), 1500));
										}
									} else {
										_messageTag.renderMessage(fa_check_c, alert_s, response.message, null, element, true);
										// _element.toggleSubmitButtonState(true);
										resolve({JSON: response, text: responseText, form: _element, messageTag: _messageTag});
									}
								} else {
									if (dataType === 'json') {
										if (status === 419)
											_messageTag.length && _messageTag.renderMessage(alert_d, fa_exc_c, response.message, null, element, true);
										// location.href = response.redirect
										else if (status === 422 || status === 501) {
											_messageTag.length ?
												!!response.errors && _element.validator.renderValidationErrors(response.errors, response.message) :
												_messageTag.renderMessage(fa_exc_c, alert_d, response.message, null, element, true);
											_messageTag === _globalMessageTag && _messageTag.slideInDown({timeout: 800});
										} else {
											console.error('Server Failure', xhr);
											reject({response: xhr, status: status, messageTag: _messageTag, form: element});
										}
									} else {
										console.error('Server Failure', xhr);
										reject({response: xhr, status: status, messageTag: _messageTag, form: element});
									}
									_element.toggleSubmitButtonState(true);
								}
							}, 1500);
						},
					}) : $fs(element).validator.renderValidationErrors(form.errors, 'Given Data is invalid');
				}
			});
		});
	}
}

/**
 * Classlist
 *
 * _Manipulate DOMElements Classlist_
 */
class FBClassList extends FBUtil {
	constructor(selector, context) {
		super(selector, context);
	}
	
	static NAME() {
		return 'FB Classlist';
	}
	
	#_classList() {
		return this.target[0].classList;
	}
	
	/**
	 * Performs the specified action for each item in the elements classlist.
	 * @param callback {function} A function that accepts upto two arguments. _the class and the index position of the class in the list_
	 * @return {*|void}
	 */
	each(callback) {
		return this.#_classList().length ?
			this.#_classList().forEach((value, idx) => callback(value, idx)) :
			console.warn('classList for element is empty');
	}
	
	/**
	 * Returns true if the element has the given class, else returns false.
	 * @param token {string}
	 * @return {Boolean}
	 */
	includes(token) {
		return this.#_classList().contains(token);
	}
	
	/**
	 * Add given token(s) to the elements tokenList (class list).
	 * @param tokenList {...String} _String(s) representing the token (or tokens) to add to the tokenList._
	 * @return {FBClassList}
	 */
	put(...tokenList) {
		this.target.length && (this.target.forEach(element => tokenList.forEach(token => element.classList.add(token))));
		return this;
	}
	
	/**
	 * Remove given token(s) from the elements tokenList (class list).
	 * @param tokenList {...String} _String(s) representing the token (or tokens) to remove from the tokenList._
	 * @return {FBClassList}
	 */
	remove(...tokenList) {
		this.target.length && (this.target.forEach(element => tokenList.forEach(token => element.classList.remove(token))));
		return this;
	}
	
	/**
	 * Replaces the OldToken with the newToken.
	 *
	 * _Adds the newToken to the elements tokenList if the oldToken does not exist_
	 * @param oldToken {string} _String representing the token to be replaced._
	 * @param newToken {string} _String representing the token to replace the old token._
	 * @return {FBClassList}
	 */
	replace(oldToken, newToken) {
		this.target.length && (this.target.forEach(element => (element.classList.contains(oldToken)) ?
			element.classList.replace(oldToken, newToken) :
			element.classList.add(newToken)
		));
		return this;
	}
	
	/**
	 * Return an array of all classes in the elements classlist
	 * @return {*[]}
	 */
	get collect() {
		const classList = [];
		this.#_classList() && this.each(value => classList.push(value))
		return classList;
	}
	
	/**
	 * Logs an array of all classes in the elements classlist to the console
	 */
	get log() {
		console.log(this.collect);
	}
}

/**
 * Element HTML
 *
 * _Insert HTML at different positions_
 */
class FBHtml extends FBUtil {
	constructor(selector, context) {
		super(selector, context);
	}
	
	static NAME() {
		return 'FB HTML';
	}
	
	/**
	 * Inserts given HTML string to the target element (inner HTML).
	 * @param value
	 * @return {FBHtml}
	 */
	insert(value) {
		const target = this.target
		target.forEach(element => element.innerHTML = value);
		return this;
	}
	
	/**
	 * Inserts given HTML string just at the end of the target element.
	 * @param value
	 * @return {FBHtml}
	 */
	affix(value) {
		const target = this.target;
		target.forEach(element => element.insertAdjacentHTML('beforeend', value));
		return this;
	}
	
	/**
	 * Inserts given HTML string after the beginning of the target element.
	 * @param value
	 * @return {FBHtml}
	 */
	prefix(value) {
		const target = this.target;
		target.forEach(element => element.insertAdjacentHTML('afterbegin', value));
		return this;
	}
	
	/**
	 * Inserts given HTML string before the beginning of the target element (Before element).
	 * @param value
	 * @return {FBHtml}
	 */
	insertBefore(value) {
		const target = this.target;
		target.forEach(element => element.insertAdjacentHTML('beforebegin', value));
		return this;
	}
	
	/**
	 * Inserts given HTML string after the end of the target element (After element).
	 * @param value
	 * @return {FBHtml}
	 */
	insertAfter(value) {
		const target = this.target;
		target.forEach(element => element.insertAdjacentHTML('afterend', value));
		return this;
	}
	
	/**
	 * Returns the HTML content of the element.
	 * @return {string|string|*|string}
	 */
	get collect() {
		return this[0].innerHTML;
	}
	
	/**
	 * Logs the HTML content of the element to the console.
	 */
	get log() {
		console.log(this.collect);
	}
}

/**
 * Modal
 *
 * _Load Modals Asynchronously_
 */
class FBBSModal extends FBUtil {
	constructor(selector, context) {
		super(selector, context);
	}
	
	static NAME() {
		return 'FB BS-Modal';
	}
	
	/**
	 *
	 * @param route
	 * @param modal
	 * @param options
	 * @param beforeOpen
	 * @param onComplete
	 */
	loadModal({route, modal, options, beforeOpen, onComplete}) {
		const _target = this;
		
		if (_target.length)
			_target.length && _target.loadPageData({
				uri: route, selector: modal, beforeSend: beforeOpen, callback: () => {
					$fs(modal).onBSModalLoad(options, function (e) {
						isFunction(onComplete) && onComplete({target: e, response: $fs(modal), status: 'success'});
					});
				}
			}).catch(r => isFunction(onComplete) && onComplete({response: r, status: 'failed'}));
	}
	
	/**
	 *
	 * @param beforeOpen {function|null}
	 * @param onComplete {function|null}
	 * @param options {Object|null}
	 */
	onClickOpen({beforeOpen = null, options = null, onComplete = null} = {}) {
		const _target = this;
		
		if (_target.length)
			_target.upon('click', function (e) {
				e.preventDefault();
				let target = this,
					route = $fs(target).dataAttribute('modal-route'),
					targetModal = $fs(target).dataAttribute('modal-target'),
					targetWrapper = $fs(target).dataAttribute('modal-wrapper'),
					_targetWrapper = $fs(targetWrapper);
				_targetWrapper.length && _targetWrapper.modal.loadModal({route: route, modal: targetModal, beforeOpen: beforeOpen, onComplete: onComplete});
			});
	}
}

/**
 * Validator
 *
 * _Validate Forms_
 */
class FBValidator extends FBUtil {
	#_formFieldGroup = '.form-field-group';
	_defaultConfig = {
		regExp: {
			name: /^([a-zA-Z]{2,255})(\s[a-zA-Z]{2,255}){1,2}$/gi,
			username: /^[a-zA-Z]+(_?[a-zA-Z]){2,255}$/gi,
			email: /^\w+([.-]?\w+)*@\w+([.-]?\w{2,3})*(\.\w{2,3})$/gi,
			phone: /^(\+\d{1,3}?\s)(\(\d{3}\)\s)?(\d+\s)*(\d{2,3}-?\d+)+$/g,
			cardCVV: /[0-9]{3,4}$/gi,
			cardNumber: /^[0-9]+$/gi,
		},
		icons: {
			validIcon: '<i class="far fa-1x fa-check"></i>',
			invalidIcon: '<i class="far fa-1x fa-exclamation-circle"></i>',
			passwordToggleIcon: '<i class="fa fa-eye"></i>',
			passwordCapslockAlertIcon: '<i class="far fa-exclamation-triangle"></i>',
		},
		config: {
			showIcons: true,
			showPassword: true,
			capslockAlert: true,
			validateCard: false,
			validateName: false,
			validateEmail: false,
			validatePhone: false,
			validatePassword: true,
			validateUsername: false,
			nativeValidation: false,
			useDefaultStyling: true,
			passwordId: 'password',
			passwordConfirmId: 'password_confirmation',
			initWrapper: '.form-group',
		},
		texts: {
			capslock: 'Capslock active',
		},
	};
	#_init = false;
	#_originals = {};
	#_fbValidatorConfig = this._defaultConfig
	
	constructor(selector, context) {
		super(selector, context);
	}
	
	static NAME() {
		return 'FB Validator';
	}
	
	/**
	 * Returns the error bag of the given form.
	 * @return {*|null}
	 */
	get errorBag() {
		return (this.length && this.isFormElement() && Object.keys(errorBag[this[0].id])) ? errorBag[this[0].id] : null;
	}
	
	/**
	 * Returns the error count of the given form.
	 * @return {*|number}
	 */
	get errorCount() {
		return (this.length && this.isFormElement() && Object.keys(errorCount[this[0].id])) ? errorCount[this[0].id] : 0;
	}
	
	/**
	 * Returns the Forms Response message element created by this plugin.
	 *
	 * _Make sure to initialize the validator._
	 * @return {void|FBValidator}
	 */
	get messageTag() {
		if (this.length && this.isFormElement()) {
			const messageTag = $fs('.form-message .response-text', this);
			messageTag.length && this.#_resetFBObject(messageTag);
			return this;
		}
		return console.error('ReferenceError: Non Form Element given.', this);
	}
	
	/**
	 * Returns the Forms Submission process text element created by this plugin.
	 *
	 * _Make sure to initialize the validator._
	 * @return {string|*|string|void}
	 */
	get waitText() {
		if (this.length && this.isFormElement()) {
			const waitTextWrapper = $fs('.form-message .waiting-text', this);
			return waitTextWrapper.length ? waitTextWrapper.html.collect : 'Please Wait...';
		}
		return console.error('ReferenceError: Non Form Element given.', this);
	}
	
	static passwordCapslockAlertClass() {
		return 'capslock-alert';
	}
	
	static passwordTogglerIconClass() {
		return 'password-toggler-icon';
	}
	
	/**
	 * Returns an Object containing both errors and error count of the given form element(s).
	 * @return {{}|{count: (number), errors: (Object)}|void}
	 */
	get getErrors() {
		const _target = this, target = _target.target;
		
		if (target.length) {
			if (target.length > 1) {
				let errors = {}
				
				target.forEach(element => {
					if (element.tagName && element.tagName.toLowerCase() === 'form') {
						errors[element.id] = {
							count: $fs(element).validator.errorCount,
							errors: $fs(element).validator.errorBag
						};
					}
				});
				return errors;
			}
			return {
				count: this.errorCount,
				errors: this.errorBag
			};
		}
		return console.warn('ReferenceError: Element is undefined.');
	}
	
	/**
	 * Returns the Validation configuration for the form element.
	 * @return {{texts: {capslock: string}, icons: {passwordToggleIcon: string, invalidIcon: string, validIcon: string, passwordCapslockAlertIcon: string}, config: {passwordConfirmId: string, initWrapper: string, validateUsername: boolean, validateCard: boolean, validateName: boolean, validateEmail: boolean, nativeValidation: boolean, passwordId: string, validatePassword: boolean, showPassword: boolean, validatePhone: boolean, useDefaultStyling: boolean, showIcons: boolean, capslockAlert: boolean}, regExp: {cardCVV: RegExp, phone: RegExp, name: RegExp, email: RegExp, cardNumber: RegExp, username: RegExp}}}
	 */
	get validatorConfig() {
		return this.#_fbValidatorConfig;
	}
	
	/**
	 *
	 * @return {{texts: {capslock: string}, icons: {passwordToggleIcon: string, invalidIcon: string, validIcon: string, passwordCapslockAlertIcon: string}, config: {passwordConfirmId: string, initWrapper: string, validateUsername: boolean, validateCard: boolean, validateName: boolean, validateEmail: boolean, nativeValidation: boolean, passwordId: string, validatePassword: boolean, showPassword: boolean, validatePhone: boolean, useDefaultStyling: boolean, showIcons: boolean, capslockAlert: boolean}, regExp: {cardCVV: RegExp, phone: RegExp, name: RegExp, email: RegExp, cardNumber: RegExp, username: RegExp}}}
	 */
	get defaultValidatorConfig() {
		return new FBValidator()._defaultConfig;
	}
	
	#_passwordCapslockWrapper(icon, text) {
		return `<div class="valid-text ${FBValidator.passwordCapslockAlertClass()} d-flex"><small class="bg-white shadow-sm text-danger m-auto p-1">${icon} ${text}</small></div>`;
	}
	
	#_passwordTogglerWrapper(icon) {
		return `<a class="text-muted toggle ${FBValidator.passwordTogglerIconClass()}">${icon}</a>`;
	}
	
	#_invalidIconWrapper(icon) {
		return `<small class="text-danger validation-icon invalid">${icon}</small>`;
	}
	
	#_validIconWrapper(icon) {
		return `<small class="text-success validation-icon valid">${icon}</small>`;
	}
	
	#_touchConfig(config) {
		if (isObject(config)) {
			const validatorConfig = this.validatorConfig;
			
			Object.keys(validatorConfig).forEach(option => {
				if (option in config && isObject(config[option])) {
					const validatorConfigOptions = validatorConfig[option], configOptions = config[option];
					
					if (Object.keys(configOptions).length) {
						Object.keys(validatorConfigOptions).forEach(subOption => {
							if (subOption in configOptions) {
								if (configOptions[subOption] !== undefined && configOptions[subOption] !== null && configOptions[subOption] !== '') {
									validatorConfigOptions[subOption] = configOptions[subOption];
								}
							}
						});
					}
				}
			});
		}
	}
	
	#_isPasswordField(inputElement) {
		return !!($fs(inputElement).length && ($fs(inputElement).attribute('type') && $fs(inputElement).attribute('type').toUpperCase() === 'PASSWORD' || ($fs(inputElement)[0].id && $fs(inputElement)[0].id.toLowerCase().includes('password'))));
	}
	
	#_isDefaultPasswordField(element, passwordId) {
		return $fs(element).length && $fs(element).attribute('id') && $fs(element).attribute('id').toLowerCase() === passwordId.toString().toLowerCase();
	}
	
	/**
	 *
	 * @param elements
	 * @param returnObject
	 * @return {FBValidator}
	 */
	#_resetFBObject(elements, returnObject = false) {
		const target = this.target;
		target.splice(target.length, null, [this.prev]);
		
		Object.keys(this).forEach(idx => delete this[idx]);
		this.length = 0;
		this.prev = new FBUtil();
		this.prev.length = 0;
		
		target.forEach((element, idx) => {
			if (idx !== (target.length - 1)) {
				this.prev[idx] = element
				this.prev.length++;
			} else {
				if (element.length)
					this.prev.prev = element[0];
			}
		});
		
		elements.target.forEach(element => {
			this[this.length] = element;
			this.length++;
		});
		
		if (returnObject)
			return this;
	}
	
	#_onAlertCLose(context, originals = {}) {
		const _target = this;
		
		$fs('.alert').upon('close.bs.alert', (e) => {
			const target = e.currentTarget;
			const targetElementId = target.dataset['alertId'];
			
			if ((context && targetElementId && targetElementId.length)) {
				_target.#_resetFBObject($fs(targetElementId));
				_target.removeValidationProps({context: context}, originals);
			}
		});
	}
	
	#_placeBaseElements(target, originalIcon, originalLabel, originalField, fieldGroup, inputGroup, fieldId, fieldValidation, hasFloatingLabel) {
		fieldValidation.classList.add('valid-text');
		fieldValidation.setAttribute('id', `${fieldId}Valid`);
		
		if ($fs(target).has(originalField).length) {
			originalLabel.target.forEach(child => target.removeChild(child));
			originalField.target.forEach(child => {
				if ($fs(child, target).length && !$fs(child).classlist.collect.deepIncludes('dropify'))
					try {
						target.removeChild(child)
					} catch (e) {
						console.error(e, child, $fs(child, target).length)
					}
			});
		}
		
		originalIcon.length && inputGroup.append(originalIcon[0]);
		
		hasFloatingLabel ?
			fieldGroup.append(originalField[0], originalLabel[0]) :
			fieldGroup.append(originalField[0]);
		inputGroup.append(fieldGroup);
		hasFloatingLabel ?
			target.append(inputGroup, fieldValidation) :
			target.append(originalLabel[0], inputGroup, fieldValidation);
		
	}
	
	#_defineBaseElements(target, originalIcon, fieldId, fieldGroup, fieldValidation, hasFloatingLabel) {
		let flexDiv;
		const _originalChildren = $fs(target).children();
		const _originalLabel = $fs('label', target);
		
		fieldValidation.classList.add('valid-text');
		fieldValidation.setAttribute('id', `${fieldId}Valid`);
		
		$fs(target).children().target.forEach(child => $fs(child, target).length ? target.removeChild(child) : null);
		_originalChildren.target.forEach(child => fieldGroup.append(child));
		
		if (originalIcon.length) {
			flexDiv = document.createElement('div');
			flexDiv.classList.add('d-flex', 'flex-nowrap', 'align-items-stretch')
			flexDiv.append(originalIcon[0], fieldGroup);
		}
		
		originalIcon.length ?
			target.append(flexDiv, fieldValidation) :
			target.append(fieldGroup, fieldValidation);
	}
	
	#_placeResponseMessageWrapper(form) {
		let messageWrapper;
		const _messageWrapper = form.has('.form-message');
		const waitingTextWrapper = document.createElement('div');
		const waitingIcon = document.createElement('i');
		const waitingText = document.createElement('span');
		const responseTextWrapper = document.createElement('div');
		
		responseTextWrapper.classList.add('response-text', 'small');
		waitingText.classList.add('text-primary');
		waitingText.innerText = 'Please Wait...';
		waitingIcon.classList.add('fa', 'fa-1x', 'fa-exclamation-circle', 'text-danger');
		waitingTextWrapper.classList.add('waiting-text', 'd-none');
		waitingTextWrapper.append(waitingIcon, waitingText);
		
		if (_messageWrapper.length) {
			const assumedChildren = _messageWrapper.children()
			assumedChildren.length && assumedChildren.target.forEach(child => child.remove())
			messageWrapper = _messageWrapper[0];
		} else {
			messageWrapper = document.createElement('div');
			messageWrapper.classList.add('form-message');
		}
		messageWrapper.append(waitingTextWrapper, responseTextWrapper)
	}
	
	#_formValidate(forms) {
		this.#_init = true;
		
		forms.forEach(form => {
			this.#_resetFBObject($fs(form));
			form = $fs(form);
			let validatorConfig = this.validatorConfig,
				regExp = validatorConfig.regExp,
				config = validatorConfig.config,
				icons = validatorConfig.icons,
				texts = validatorConfig.texts,
				capslockWrapper = this.#_passwordCapslockWrapper,
				togglerWrapper = this.#_passwordTogglerWrapper,
				invalidWrapper = this.#_invalidIconWrapper,
				validWrapper = this.#_validIconWrapper;
			
			if (form.attribute('id')) {
				let formId = form.attribute('id'),
					selector = `#${formId} ${config.initWrapper}`;
				errorBag[formId] = {};
				errorCount[formId] = 0;
				
				this.#_placeResponseMessageWrapper(form)
				
				config.nativeValidation ? form.property({noValidate: false}) : form.property({noValidate: true});
				
				$fs(selector).length ? $fs(selector).target.forEach(target => {
					const selectElement = 'select', textAreaElement = 'textarea', inputElement = 'input:not(.bs-searchbox > input)';
					const element = `${inputElement}, ${selectElement}, ${textAreaElement}`;
					
					if ($fs(target).has($fs(element)).length) {
						/*---- Prepare Elements ----*/
						// Get Original Elements (User created)
						const originalIcon = $fs(target).has('.icon');
						const originalLabel = $fs(target).has('label');
						const originalField = $fs(target).has('*:not(label):not(option):not(.icon)');
						
						// Get element user options
						const isOptional = $fs(target).classlist.includes('optional');
						const hasFloatingLabel = $fs(target).classlist.includes('floating-label');
						
						// Create base elements
						const inputGroup = document.createElement('div');
						const fieldGroup = document.createElement('div');
						
						// Add and remove appropriate classes to base elements (Using user options also)
						target.classList.remove('floating-label', 'required');
						inputGroup.classList.add('input-group', 'align-items-stretch', 'flex-nowrap');
						fieldGroup.classList.add('form-field-group', 'w-100');
						
						originalIcon.length && (originalIcon.classlist.put('m-auto', 'pe-2'));
						
						!isOptional && hasFloatingLabel ?
							fieldGroup.classList.add('form-label-group', 'required') :
							(!isOptional ? fieldGroup.classList.add('required') : (hasFloatingLabel && fieldGroup.classList.add('form-label-group')));
						isOptional && (originalField.touchDataAttribute({fbValidate: false}));
						
						if (originalLabel.length && originalField.length) {
							const elementId = originalField[0].id;
							const element_groupId = `${elementId}_group`;
							const fieldValidation = document.createElement('div');
							config.useDefaultStyling ? this.#_placeBaseElements(
								target,
								originalIcon,
								originalLabel,
								originalField,
								fieldGroup,
								inputGroup,
								elementId,
								fieldValidation,
								hasFloatingLabel,
								config.useDefaultStyling
							) : this.#_defineBaseElements(target, originalIcon, elementId, fieldGroup, fieldValidation, hasFloatingLabel);
							
							if (!elementId)
								console.error('ReferenceError: Field does not have an id.\r\nValidation will not be performed on this field:', originalField);
							
							let requireRefill,
								toggler = `.${FBValidator.passwordTogglerIconClass()}`,
								_element = $fs(element, target),
								_inputElement = $fs(inputElement, target),
								_selectElement = $fs(selectElement, target),
								_textAreaElement = $fs(textAreaElement, target),
								_fieldGroup = $fs(this.#_formFieldGroup, target),
								_capslockAlert = $fs(`.${FBValidator.passwordCapslockAlertClass()}`, form),
								fieldGroupRect = _fieldGroup[0].getBoundingClientRect();
							
							target.setAttribute('id', element_groupId);
							this.#_isPasswordField(_inputElement) && (config.showPassword && _fieldGroup.html.affix(togglerWrapper(icons.passwordToggleIcon)));
							_fieldGroup.html.affix(validWrapper(icons.validIcon)).affix(invalidWrapper(icons.invalidIcon));
							((this.#_isDefaultPasswordField(_inputElement, config.passwordId) || $fs(target).has(`#${config.passwordId}`).length) && config.capslockAlert) && _fieldGroup.html.prefix(capslockWrapper(icons.passwordCapslockAlertIcon, texts.capslock));
							$fs('.validation-icon, .password-toggler-icon').touchStyle({top: `${fieldGroupRect.height / 2}px`});
							
							if (_capslockAlert.length)
								_capslockAlert.touchStyle({top: `-${(fieldGroupRect.height / 2) / 2}px`});
							
							
							_inputElement.upon({
								focus: (e) => {
									this.#_resetFBObject(_inputElement);
									const _toggler = $fs(toggler, $fs(target));
									
									// TODO: Show Capslock Alert if is password field
									if (this.isPasswordField(config.passwordId)) {
										if (config.showPassword && _toggler.length) {
											_toggler.mouseIsOver().then(isOver => {
												if (!isOver && _inputElement[0].value.length) {
													_toggler.dataAttribute('require-refill', 'true');
													requireRefill = parseBool(_toggler.dataAttribute('require-refill'));
												}
											});
										}
									}
								},
								blur: (e) => {
									this.#_resetFBObject(_inputElement);
									const dimensions = this.#_getFieldDimensions();
									const _toggler = $fs(toggler, $fs(target));
									
									if (this.isPasswordField(config.passwordId)) {
										if (config.showPassword && _toggler.length) {
											_toggler.mouseIsOver().then(isOver => {
												if (!isOver && _inputElement[0].value.length)
													_inputElement.isPasswordField() && _toggler.fadeout(0).then(icon => {
														_inputElement.touchStyle({paddingRight: `${dimensions._paddingRight}px`});
														icon.touchStyle({opacity: 0}).dataAttribute('require-refill', 'true');
														requireRefill = parseBool(icon.dataAttribute('require-refill'));
													});
											});
										}
									}
								},
								input: (e) => {
									this.#_resetFBObject(_inputElement);
									const fbRole = _inputElement.dataAttribute('fb-role') && _inputElement.dataAttribute('fb-role').toLowerCase();
									const elementId = _inputElement.attribute('id') && _inputElement.attribute('id').toLowerCase();
									const elementType = _inputElement.attribute('type') && _inputElement.attribute('type').toLowerCase();
									
									const filterId = ['name', 'username', 'card_cvv', 'card_number'];
									const filterType = new Set(['date', 'email', 'month', 'datetime', 'datetime-local']);
									
									if (this.needsValidation()) {
										if (!filterType.has(elementType) && !filterType.has(fbRole) && !filterId.deepIncludes(elementId))
											if (this.isPasswordField(config.passwordId))
												this.#_validatePasswordField();
											else
												this.validateField({context: target});
										
										if (this.isUsernameField()) {
											if (config.validateUsername)
												this.usernameValidate(regExp.username, target)
											else
												this.toggleValidation(target)
										}
										
										if (this.isNameField()) {
											if (config.validateName)
												this.nameValidate(regExp.name, target)
											else
												this.toggleValidation(target)
										}
										
										if (this.isEmailField()) {
											if (config.validateEmail)
												this.emailValidate(regExp.email, target)
											else
												this.toggleValidation(target)
										}
										
										if (this.isPhoneField()) {
											if (config.validatePhone)
												this.phoneValidate(regExp.phone, target)
											else
												this.toggleValidation(target)
										}
										
										if (config.validateCard) {
											if (elementId.includes('card_cvv') || fbRole === 'card_cvv')
												this.cardCVVValidate(regExp.cardCVV, target)
											if (elementId.includes('card_number') || fbRole === 'card_number')
												this.cardNumberValidate(regExp.cardNumber, target)
										} else {
											if ((elementId.includes('card_cvv') || fbRole === 'card_cvv') || (elementId.includes('card_number') || fbRole === 'card_number'))
												this.toggleValidation(target);
										}
										
										(filterType.has(elementType) && elementType !== 'email') && this.validateField({context: target})
									}
								},
								keyup: (e) => {
									this.#_resetFBObject(_inputElement);
									const dimensions = this.#_getFieldDimensions();
									const capslockIsOn = e.getModifierState('CapsLock');
									const _toggler = $fs(toggler, $fs(target));
									const _capslockAlert = $fs(`.${FBValidator.passwordCapslockAlertClass()}`, form);
									
									if (_inputElement.length) {
										if (this.isPasswordField(config.passwordId)) {
											/*if (config.capslockAlert && _capslockAlert.length)
												capslockIsOn ?
													$fs('*:first-child', _capslockAlert).classlist.put('shown') :
													$fs('*:first-child', _capslockAlert).classlist.remove('shown');*/
											
											if (config.showPassword && _toggler.length) {
												if (requireRefill)
													if (!_inputElement[0].value.length) {
														_toggler.dataAttribute('require-refill', 'false');
														requireRefill = parseBool(_toggler.dataAttribute('require-refill'));
													}
												(!requireRefill && _inputElement[0].value.length) ?
													_toggler.touchStyle({right: `${dimensions.togglerRight}px`}).fadein(0).then(icon => {
														icon.touchStyle({opacity: 1, right: `${dimensions.togglerRight}px`}).classlist.put('shown')
														_inputElement.classlist.put('toggler-active');
													}) :
													_inputElement.isPasswordField() && _toggler.fadeout(0).then(icon => {
														_inputElement.touchStyle({paddingRight: `${dimensions._paddingRight}px`}).classlist.remove('toggler-active');
														icon.touchStyle({opacity: 0, right: 0}).dataAttribute('require-refill', 'false')
														icon.classlist.remove('shown');
													});
											}
										}
									}
								},
								keydown: (e) => {
									const capslockIsOn = e.getModifierState('CapsLock');
									const _capslockAlert = $fs(`.${FBValidator.passwordCapslockAlertClass()}`, form);
									if (this.isPasswordField(config.passwordId))
										if (config.capslockAlert && _capslockAlert.length)
											capslockIsOn ?
												$fs('*:first-child', _capslockAlert).classlist.put('shown') :
												$fs('*:first-child', _capslockAlert).classlist.remove('shown');
								}
							});
							
							_selectElement.upon('change', (e) => {
								this.#_resetFBObject(_selectElement);
								(this.needsValidation()) && this.validateField({context: target});
							});
							
							_textAreaElement.upon('input', (e) => {
								this.#_resetFBObject(_textAreaElement);
								(this.needsValidation()) && this.validateField({context: target});
							});
							
							if (elementId) {
								const elementType = _element.attribute('type') && _element.attribute('type').toLowerCase();
								const tagName = _element[0].tagName.toLowerCase();
								const fieldName = titleCase(elementId);
								
								if (config.showPassword)
									$fs(toggler, $fs(target)).upon('click', (e) => {
										const _toggler = $fs(e.currentTarget), _passwordField = $fs(e.currentTarget).prevSiblings('input');
										this.#_resetFBObject(_passwordField);
										
										if (this.isPasswordField(config.passwordId)) {
											if (_passwordField[0].type && _passwordField[0].type.toLowerCase() === 'password') {
												_passwordField.attribute({type: 'text'});
												$fs('i', _toggler).classlist.replace('fa-eye', 'fa-eye-slash');
											} else {
												_passwordField.attribute({type: 'password'});
												$fs('i', _toggler).classlist.replace('fa-eye-slash', 'fa-eye');
											}
										}
										_passwordField[0].focus({preventScroll: false});
									});
								
								this.#_resetFBObject(_element)
								if (this.needsValidation()) {
									if (tagName === 'select') {
										if (!_selectElement[0].value) {
											errorBag[formId][elementId] = `Please select an option for ${fieldName} field.`;
											errorCount[formId]++;
										}
									} else {
										if (elementType !== 'checkbox' && !_element[0].value.length) {
											errorBag[formId][elementId] = `The ${fieldName} field is required.`;
											errorCount[formId]++;
										}
									}
								}
							}
						} else
							(!originalLabel.length && !originalField.length) ?
								console.error('ReferenceError: No Label and Form field found for init wrapper:', target) :
								((!originalLabel.length) ?
									console.error('ReferenceError: No Label found for init wrapper:', target) :
									console.error('ReferenceError: No Form field found for init wrapper:', target));
					}
				}) : console.error('ReferenceError: Unable to find init wrapper for form:', form);
				
				form.upon('reset', (e) => {
					const target = e.currentTarget;
					$fs('.alert', $fs(target)).target.forEach(alert => newBsAlert(alert).close());
					$fs('input, textarea, select', $fs(target)).classlist.remove('border-danger').remove('border-success');
					$fs('.validation-icon', $fs(target)).fadeout(0).then(icon => icon.touchStyle({opacity: 0}));
				});
			} else
				console.error('ReferenceError: Form Element does not have an id to be referenced.', form);
		});
		this.#_resetFBObject($fs(forms));
		return this;
	}
	
	#_validatePasswordField() {
		const _target = this, target = _target.target, validatorConfig = this.validatorConfig, validateMatchPassword = (_password, _passwordConfirm, _passwordGroup, _passwordConfirmGroup) => {
			if (_password[0].value.length && (_passwordConfirm[0].value !== _password[0].value)) {
				this.#_resetFBObject(_password);
				this.validateField({context: _passwordGroup, message: `Passwords do not match.`, isPasswordField: true});
				this.#_resetFBObject(_passwordConfirm);
				this.validateField({context: _passwordConfirmGroup, isPasswordField: true});
			} else {
				this.#_resetFBObject(_password);
				this.validateField({context: _passwordGroup});
				this.#_resetFBObject(_passwordConfirm);
				this.validateField({context: _passwordConfirmGroup});
			}
		};
		
		if (target.length && validatorConfig.config.validatePassword) {
			const form = target[0].form;
			
			let // elementId = target[0].id,
				passwordId = validatorConfig.config.passwordId,
				passwordConfirmId = validatorConfig.config.passwordConfirmId,
				_password = $fs(`#${passwordId}`, form),
				_passwordGroup = $fs(`#${passwordId}_group`, form),
				_passwordConfirm = $fs(`#${passwordConfirmId}`, form),
				_passwordConfirmGroup = $fs(`#${passwordConfirmId}_group`, form),
				passwordFieldName = titleCase(validatorConfig.config.passwordId.toLowerCase()),
				// passwordConfirmFieldName = titleCase(validatorConfig.config.passwordConfirmId.toLowerCase()),
				minlength = _password.target.length && _password.attribute('minlength'),
				maxlength = _password.target.length && _password.attribute('maxlength');
			
			if (minlength || maxlength) {
				if (_password.length && ((minlength && _password[0].value.length < minlength) || (maxlength && _password[0].value.length > maxlength))) {
					if (_passwordConfirm.length) {
						if (minlength && maxlength) {
							if (minlength === maxlength) {
								this.#_resetFBObject(_password);
								if (_password[0].value.length)
									this.validateField({context: _passwordGroup, message: `The ${passwordFieldName} field requires ${maxlength} characters.`});
								else
									this.validateField({context: _passwordGroup, isPasswordField: true});
								this.#_resetFBObject(_passwordConfirm)
								this.validateField({context: _passwordConfirmGroup, isPasswordField: true});
							} else {
								this.#_resetFBObject(_password);
								if (_password[0].value.length)
									this.validateField({context: _passwordGroup, message: `The ${passwordFieldName} field must be between ${minlength} and ${maxlength} characters.`});
								else
									this.validateField({context: _passwordGroup, isPasswordField: true});
								this.#_resetFBObject(_passwordConfirm);
								this.validateField({context: _passwordConfirmGroup, isPasswordField: true});
							}
						} else {
							if (minlength) {
								if (_password[0].value.length < minlength) {
									this.#_resetFBObject(_password);
									if (_password[0].value.length) {
										this.validateField({context: _passwordGroup, message: `The ${passwordFieldName} field requires a minimum of ${minlength} characters.`});
									} else {
										this.validateField({context: _passwordGroup, isPasswordField: true});
									}
									this.#_resetFBObject(_passwordConfirm);
									this.validateField({context: _passwordConfirmGroup, isPasswordField: true});
								} else
									validateMatchPassword(_password, _passwordConfirm, _passwordGroup, _passwordConfirmGroup);
							} else if (maxlength) {
								if (_password[0].value.length > maxlength) {
									this.#_resetFBObject(_password);
									this.validateField({context: _passwordGroup, message: `The ${passwordFieldName} field requires a maximum of ${maxlength} characters.`});
									this.#_resetFBObject(_passwordConfirm);
									this.validateField({context: _passwordConfirmGroup, isPasswordField: true});
								} else
									validateMatchPassword(_password, _passwordConfirm, _passwordGroup, _passwordConfirmGroup);
							} else {
								if (_password[0].value.length && _passwordConfirm[0].value.length)
									validateMatchPassword(_password, _passwordConfirm, _passwordGroup, _passwordConfirmGroup);
							}
						}
					} else {
						this.#_resetFBObject(_password);
						if (minlength && maxlength) {
							if (minlength === maxlength) {
								if (_password[0].value.length)
									this.validateField({context: _passwordGroup, message: `The ${passwordFieldName} field requires ${maxlength} characters.`});
								else
									this.validateField({context: _passwordGroup, isPasswordField: true});
							} else {
								if (_password[0].value.length)
									this.validateField({context: _passwordGroup, message: `The ${passwordFieldName} field must be between ${minlength} and ${maxlength} characters.`});
								else
									this.validateField({context: _passwordGroup, isPasswordField: true});
							}
						} else {
							if (minlength) {
								if (_password[0].value.length < minlength) {
									if (_password[0].value.length) {
										this.validateField({context: _passwordGroup, message: `The ${passwordFieldName} field requires a minimum of ${minlength} characters.`});
									} else {
										this.validateField({context: _passwordGroup, isPasswordField: true});
									}
								} else
									this.validateField({context: _passwordGroup});
							} else if (maxlength) {
								if (_password[0].value.length > maxlength) {
									this.validateField({context: _passwordGroup, message: `The ${passwordFieldName} field requires a maximum of ${maxlength} characters.`});
								} else
									this.validateField({context: _passwordGroup});
							} else
								this.validateField({context: _passwordGroup});
						}
					}
				} else {
					if (_passwordConfirm.length)
						if (_password[0].value.length && _passwordConfirm[0].value.length)
							validateMatchPassword(_password, _passwordConfirm, _passwordGroup, _passwordConfirmGroup);
						else
							validateMatchPassword(_password, _passwordConfirm, _passwordGroup, _passwordConfirmGroup);
					else {
						this.#_resetFBObject(_password);
						this.validateField({context: _passwordGroup});
					}
				}
			} else {
				if (_passwordConfirm.length)
					if (_password[0].value.length && _passwordConfirm[0].value.length)
						validateMatchPassword(_password, _passwordConfirm, _passwordGroup, _passwordConfirmGroup);
					else {
						this.#_resetFBObject(_password);
						this.validateField({context: _passwordGroup});
						this.#_resetFBObject(_passwordConfirm);
						this.validateField({context: _passwordConfirmGroup, isPasswordField: true});
					}
				else {
					this.#_resetFBObject(_password);
					this.validateField({context: _passwordGroup});
				}
			}
		} else
			return console.error('ReferenceError: Undefined target', target);
	}
	
	#_getFieldDimensions() {
		const _target = this, target = _target.target;
		
		if (target.length) {
			const tagName = target[0].tagName.toLowerCase();
			const elementType = target[0].type && target[0].type.toLowerCase();
			const filterType = new Set(['date', 'month', 'datetime', 'datetime-local']);
			const validationIcons = this.validationProps().validationIcon;
			
			let paddingRight,
				_paddingRight,
				validationIconRight,
				passwordIconRight = 0,
				targetPaddingLeft = parseInt(_target.style('padding-left').replace('px', '')),
				currentIcon = validationIcons.target.filter(icon => $fs(icon).classlist.includes('on')).length ?
					validationIcons.target.filter(icon => $fs(icon).classlist.includes('on'))[0] : validationIcons[0],
				iconWidth = currentIcon.getBoundingClientRect().width,
				_targetPaddingLeft = targetPaddingLeft;
			
			if (tagName === 'select'/* || filterType.has(elementType)*/)
				_targetPaddingLeft = targetPaddingLeft * 4.5;
			
			validationIconRight = (tagName === 'select' || filterType.has(elementType)) ? _targetPaddingLeft : targetPaddingLeft;
			paddingRight = validationIconRight + iconWidth + targetPaddingLeft;
			_paddingRight = paddingRight
			
			if (this.#_isPasswordField(target) && this.validatorConfig.config.showPassword && this.#_init) {
				let togglerIcon = $fs(`#${target[0].id}_group .password-toggler-icon`)[0],
					togglerIconWidth = togglerIcon.getBoundingClientRect().width;
				passwordIconRight = paddingRight;
				paddingRight = passwordIconRight + togglerIconWidth + targetPaddingLeft;
			}
			
			return {
				paddingRight: paddingRight,
				_paddingRight: _paddingRight,
				paddingLeft: targetPaddingLeft,
				iconRight: validationIconRight,
				togglerRight: passwordIconRight,
			}
		}
		return console.warn('ReferenceError: Element is Undefined.');
	}
	
	/**
	 * Initialize FBValidator's Validation on the form element(s).
	 * @param config {Object|null} An Object defining the configuration for the validation
	 * @return {FBValidator|void}
	 */
	initFormValidation(config = null) {
		const _forms = this.target;
		let notForms = _forms.filter(form => !this.isFormElement(form)),
			forms = _forms.filter(form => this.isFormElement(form));
		
		if (_forms.length) {
			(notForms.length && forms.length) && console.warn('Non Form Element passed to validator:', notForms);
			
			config && this.#_touchConfig(config);
			
			return (forms.length) ?
				this.#_formValidate(forms) :
				console.error('Non Form Element passed to validator:', notForms);
		} else
			console.error('Given Elements failed to load in document:', _forms);
		
	}
	
	/**
	 * Validates the field if validation is required. Removes already added validation otherwise.
	 * @param context {string|Iterable|Object|null}
	 * @return {FBValidator|void}
	 */
	toggleValidation(context) {
		const _target = this, target = _target.target;
		
		if (target.length) {
			return _target.needsValidation() ?
				_target.validateField({context: context}) :
				_target.removeValidationProps({context: target, removeAlert: true});
		}
		return console.warn('ReferenceError: Element is Undefined');
	}
	
	/**
	 * Returns All form elements of the given form
	 * @return {{}|void|*}
	 */
	fieldElements() {
		const _target = this, target = _target.target;
		if (target.length) {
			if (target.length > 1) {
				const elements = {}
				target.forEach(element => {
					if (this.isFormElement(element))
						elements[element.id] = element.elements
				});
				return elements
			}
			
			if (this.isFormElement(target[0]))
				return target[0].elements;
			return console.error(`Non Form Element given`, _target);
		}
		return console.warn('ReferenceError: Element is Undefined');
	}
	
	/**
	 * Validates the given form field element using the given RegExp.
	 * @param regex
	 * @param context {string|Iterable|Object|null}
	 * @param message
	 * @param customValidation
	 * @return {*|FBValidator|void}
	 */
	regexValidate({regex, context = null, message = null, customValidation = null} = {}) {
		const _target = this, target = _target.target;
		
		if (target.length) {
			return isFunction(customValidation) ? customValidation() : (target[0].value.length ?
				(target[0].value.match(regex) ? _target.validateField({context: context}) : _target.validateField({context: context, message: message, isError: true})) :
				this.toggleValidation(context));
		}
		return console.warn('ReferenceError: Element is Undefined');
	}
	
	/**
	 * Validates the given input field as a Card CVV field with the given RegExp.
	 * @param regex
	 * @param context {string|Iterable|Object|null}
	 * @return {*|FBValidator|void}
	 */
	cardCVVValidate(regex, context = null) {
		return this.length ?
			this.regexValidate({regex: regex, context: context, message: `Please input a valid CVV`}) : this;
	}
	
	/**
	 * Validates the given input field as an E-Mail field with the given RegExp.
	 * @param regex
	 * @param context {string|Iterable|Object|null}
	 * @param customFormatEx
	 * @return {*|FBValidator|void}
	 */
	emailValidate(regex, context = null, customFormatEx = null) {
		return this.length ?
			this.regexValidate({regex: regex, context: context, message: `Please input a valid E-Mail Address format:<br> (eg. ${customFormatEx ?? 'johndoe@mail.com'})`}) : this;
	}
	
	/**
	 * Validates the given input field as a name field with the given RegExp.
	 * @param regex
	 * @param context {string|Iterable|Object|null}
	 * @param customFormatEx
	 * @return {*|FBValidator|void}
	 */
	nameValidate(regex, context = null, customFormatEx = null) {
		return this.length ?
			this.regexValidate({regex: regex, context: context, message: `Please input a valid Name format:<br> (eg. ${customFormatEx ?? 'John Doe, John Wood Doe'})`}) : this;
	}
	
	/**
	 * Validates the given input field as a phone field with the given RegExp.
	 * @param regex
	 * @param context {string|Iterable|Object|null}
	 * @param customFormatEx
	 * @return {*|FBValidator|void}
	 */
	phoneValidate(regex, context = null, customFormatEx = null) {
		return this.length ?
			this.regexValidate({regex: regex, context: context, message: `Please input a valid Phone Number format:<br> (eg. ${customFormatEx ?? '+234 8076899243, +1 211 1041'})`}) : this;
	}
	
	/**
	 * Validates the given input field as a Card Number field with the given RegExp.
	 * @param regex
	 * @param context {string|Iterable|Object|null}
	 * @param customMessage
	 * @return {*|FBValidator|void}
	 */
	cardNumberValidate(regex, context = null, customMessage = null) {
		return this.length ? this.regexValidate({
			customValidation: () =>
				this[0].value.length ? (this[0].value.match(regex) ?
					(checkLuhn(this[0].value) ? this.validateField({context: context}) : this.validateField({context: context, message: 'Please check card number and try again.', isError: true})) :
					this.validateField({
						context: context,
						message: `${customMessage ?? 'Only numbers are allowed.'}`,
						isError: true
					})) : this.toggleValidation(context)
		}) : this;
	}
	
	/**
	 * Validates the given input field as a Username field with the given RegExp.
	 * @param regex
	 * @param context {string|Iterable|Object|null}
	 * @param minlength
	 * @param customFormatEx
	 * @param customMessage
	 * @return {*|FBValidator|void}
	 */
	usernameValidate(regex, context = null, minlength = 2, customFormatEx = null, customMessage = null) {
		return this.length ? this.regexValidate({
			customValidation: () =>
				this[0].value.length ?
					(this[0].value.length > minlength ? (this[0].value.match(regex) ? this.validateField({context: context}) : this.validateField({context: context, message: `Please input a valid Username format:<br> (ie. ${customFormatEx ?? 'Username must start and end with an alphabet, and must contain only alphabets, and underscore.'})`, isError: true})) :
						this.validateField({
							context: context,
							message: `${customMessage ?? 'Username must have a minimum of 3 characters.'}`,
							isError: true
						})) : this.toggleValidation(context)
		}) : this;
	}
	
	/**
	 * Validate the given form field element.
	 * @param context {string|Iterable|Object|null}
	 * @param message {string|null}
	 * @param isError {boolean}
	 * @param isPasswordField {boolean}
	 * @return {void|FBValidator}
	 */
	validateField({context, message = null, isError = false, isPasswordField = false} = {}) {
		const _target = this, target = _target.target;
		
		if (target.length) {
			target.forEach(element => {
				this.#_resetFBObject($fs(element));
				const formId = element.form.id, elementId = element.id, tagName = element.tagName.toLowerCase();
				
				let minLength = tagName === 'input' && _target.attribute('minlength'),
					fieldName = titleCase(elementId.toLowerCase()),
					finalMessage = minLength ?
						(!message && element.value.length && element.value.length < minLength ? `The ${fieldName} field requires a minimum of ${minLength} characters.` : message) :
						(!message && isPasswordField ? (element.value.length ? 'Check Passwords.' : `The ${fieldName} field is required`) : message);
				
				/** If Validator is not initialized with form (Direct field Validation) **/
				if (!this.#_init) {
					this.#_originals[elementId] = {};
					
					/** If Form-Group wrapper is non-existent **/
					if (!$fs(`#${elementId}_group`).length) {
						// Create necessary base elements
						const originalField = _target;
						const originalLabel = _target.prevSiblings('label').length ?
							_target.prevSiblings('label') :
							(_target.siblings('label').length ? _target.siblings('label') : $fs(`label[for="${elementId}"]`));
						
						this.#_originals[elementId].field = originalField.target[0];
						this.#_originals[elementId].label = originalLabel.target[0];
						
						const formGroup = document.createElement('div')
						const inputGroup = document.createElement('div')
						const fieldGroup = document.createElement('div')
						const fieldValidation = document.createElement('div');
						
						formGroup.classList.add('form-group');
						formGroup.id = `${elementId}_group`;
						
						fieldValidation.classList.add('valid-text');
						fieldValidation.id = `${elementId}Valid`;
						
						inputGroup.classList.add('input-group', 'align-items-stretch', 'flex-nowrap');
						fieldGroup.classList.add('form-field-group', 'position-relative', 'required', 'w-100');
						
						const fieldClone = originalField[0].cloneNode(true);
						const labelClone = originalLabel[0].cloneNode(true);
						
						fieldGroup.append(fieldClone)
						formGroup.append(labelClone, fieldGroup, fieldValidation);
						originalField[0].parentElement.append(formGroup);
						originalField.touchStyle({display: 'none'});
						originalLabel.touchStyle({display: 'none'});
						this.#_resetFBObject($fs(fieldClone));
						
						!_target.siblings('.validation-icon').length && _target.html.insertAfter(this.#_validIconWrapper(this.validatorConfig.icons.validIcon)).insertAfter(this.#_invalidIconWrapper(this.validatorConfig.icons.invalidIcon));
						context = formGroup;
					} else {
						this.#_init = true;
						this.#_originals = {};
						context = $fs(`${elementId}_group`);
					}
				}
				
				if (!element.value || !element.value.length || element.value.length < minLength || (isPasswordField && (!element.value.length || finalMessage)) || isError)
					_target.showError({context: context, message: finalMessage});
				else
					_target.showSuccess({context: context, message: finalMessage});
				
				if ($fs('.alert').length)
					this.#_onAlertCLose(context, this.#_originals);
			})
			return this;
		}
		return console.error('ReferenceError: Element is Undefined');
	}
	
	/**
	 * Display validation error for the target element.
	 * @param context {string|Iterable|Object|null}
	 * @param message {string|null}
	 * @param showIcon {boolean}
	 * @return {void|FBValidator}
	 */
	showError({context, message, showIcon = true} = {}) {
		const _target = this, target = _target.target;
		if (target.length) {
			const formId = target[0].form.id;
			
			if (formId) {
				const elementId = target[0].id, fieldName = titleCase(elementId.toLowerCase()), validationProps = _target.validationProps();
				const finalMessage = message ?? `The ${fieldName} field is required`;
				Object.keys(errorBag).length && (errorBag[formId][elementId] = finalMessage);
				this.validatorConfig.config.showIcons && this.toggleValidationIcon({oldIcon: validationProps.validIcon, newIcon: validationProps.invalidIcon, showIcon: showIcon});
				
				finalMessage ? validationProps.validationField.validator.renderMessage(fa_exc_c, alert_d, finalMessage, validationProps.id, context, true) : validationProps.validationField.html.insert(null);
				_target.classlist.replace('border-success', 'border-danger');
				Object.keys(errorCount).length && (errorCount[formId] = Object.keys(errorBag[formId]).length);
				return this;
			}
			return console.error('Non Form Element given');
		}
		return console.warn('ReferenceError: Element is Undefined');
	}
	
	/**
	 * Display validation success for the target element.
	 * @param context {string|Iterable|Object|null}
	 * @param message {string|null}
	 * @param showIcon {boolean}
	 * @return {void|FBValidator}
	 */
	showSuccess({context, message, showIcon = true} = {}) {
		const _target = this, target = _target.target;
		if (target.length) {
			const formId = target[0].form.id;
			
			if (formId) {
				const elementId = target[0].id, validationProps = _target.validationProps();
				Object.keys(errorBag).length && delete errorBag[formId][elementId];
				this.validatorConfig.config.showIcons && this.toggleValidationIcon({oldIcon: validationProps.invalidIcon, newIcon: validationProps.validIcon, showIcon: showIcon});
				
				message ? validationProps.validationField.validator.renderMessage(fa_check, alert_s, message, validationProps.id, context, true) : validationProps.validationField.html.insert(null);
				_target.classlist.replace('border-danger', 'border-success');
				Object.keys(errorCount).length && (errorCount[formId] = Object.keys(errorBag[formId]).length);
				return this;
			}
			return console.error('Non Form Element given');
		}
		return console.warn('ReferenceError: Element is Undefined');
	}
	
	/**
	 * Display validation errors for the target form.
	 * @param errors {Object} An Object of errors.
	 * @param message {string|null} Optional Validation message.
	 * @param callback {function|null} Optional Callback.
	 * @return {void|FBValidator}
	 */
	renderValidationErrors(errors, message = null, callback = null) {
		const _target = this, target = _target.target;
		
		if (target.length) {
			if (this.isFormElement(target[0])) {
				const fieldElements = this.fieldElements();
				
				if (isObject(errors))
					Object.keys(errors).forEach(element => {
						const fieldName = titleCase(element)
						this.#_resetFBObject($fs(`#${element}`, target[0]));
						if (element in fieldElements && errors[element] !== undefined && errors[element] !== null && errors[element] !== '')
							this.validateField({context: target[0], message: errors[element], isError: true});
						else {
							if (errors[element] !== undefined && errors[element] !== null && errors[element] !== '')
								this.validateField({context: target[0], message: `Verify ${fieldName} and try again.`, isError: true});
						}
					});
				
				this.#_resetFBObject($fs(target));
				isString(message) && message.length && this.messageTag.renderMessage(fa_exc_c, alert_d, message, null, target[0], true);
				isFunction(callback) && callback();
				return this;
			}
			return console.error('Non Form Element given');
		}
		return console.warn('ReferenceError: Element is Undefined');
	}
	
	/**
	 * Toggles the validation icon for the given field element
	 * @param oldIcon {FBUtil}
	 * @param newIcon {FBUtil}
	 * @param showIcon {boolean}
	 */
	toggleValidationIcon({oldIcon, newIcon, showIcon = true}) {
		const dimensions = this.#_getFieldDimensions();
		if (showIcon) {
			oldIcon.fadeout(0).then(icon => icon.touchStyle({opacity: 0}).classlist.remove('on'));
			this.addFieldValidationPadding();
			newIcon.touchStyle({right: `${dimensions.iconRight}px`}).fadein(0).then(icon => icon.touchStyle({opacity: 1}).classlist.put('on'));
		} else
			this.removeFieldValidationPadding();
	}
	
	/**
	 * Adds padding to the right of the field element based on the validation icons on the field element.
	 * @return {FBValidator}
	 */
	addFieldValidationPadding() {
		const dimensions = this.#_getFieldDimensions();
		if (this.isPasswordField(this.validatorConfig.config.passwordId) && !this.validatorConfig.config.showPassword) {
			this.touchStyle({paddingRight: `${dimensions.paddingRight}px`});
		} else {
			if (this.isPasswordField(this.validatorConfig.config.passwordId) && !this.classlist.includes('toggler-active'))
				this.touchStyle({paddingRight: `${dimensions._paddingRight}px`});
			else
				this.touchStyle({paddingRight: `${dimensions.paddingRight}px`});
		}
		return this;
	}
	
	/**
	 * Resets the value of the padding-right CSS property to the value of the padding-left CSS property of the element.
	 * @return {FBValidator}
	 */
	removeFieldValidationPadding() {
		const dimensions = this.#_getFieldDimensions();
		this.touchStyle({paddingRight: `${dimensions.paddingLeft}px`});
		return this;
	}
	
	/**
	 * Check if the form field element should be validated.
	 * @return {boolean|boolean}
	 */
	needsValidation() {
		const target = this.target
		return target.length ? (this.dataAttribute('fb-validate') ? parseBool(this.dataAttribute('fb-validate').toLowerCase()) : true) : false;
	}
	
	/**
	 * Get the Validation properties for the target element.
	 * @return {{formGroup: FBUtil<HTMLElement>, validationField: FBUtil<HTMLElement>, invalidIcon: FBUtil<HTMLElement>, id: string, validIcon: FBUtil<HTMLElement>, validationIcon: FBUtil<HTMLElement>}|void}
	 */
	validationProps() {
		const _target = this, target = _target.target;
		if (target.length) {
			const formGroup = this.validatorConfig.config.initWrapper;
			const formId = `#${target[0].form.id}`;
			const targetId = `#${target[0].id}`;
			
			if (formId)
				return {
					id: targetId,
					formGroup: $fs(`${formId} ${formGroup}` + `${targetId}_group`),
					validationField: $fs(`${formId} ${targetId}Valid`),
					validIcon: $fs(`${formId} ${formGroup}` + `${targetId}_group ${this.#_formFieldGroup} .valid`),
					invalidIcon: $fs(`${formId} ${formGroup}` + `${targetId}_group ${this.#_formFieldGroup} .invalid`),
					validationIcon: $fs(`${formId} ${formGroup}` + `${targetId}_group ${this.#_formFieldGroup} .validation-icon`),
				}
			return console.error('Non Form Element given');
		}
		return console.error('ReferenceError: Target Element not found');
	}
	
	/**
	 * Remove validation errors from target element(s).
	 * @param context {string|Iterable|Object|null}
	 * @param removeAlert
	 * @param destroyValidation
	 * @param originals
	 * @return {void|FBValidator}
	 */
	removeValidationProps({context, removeAlert = false, destroyValidation = false} = {}, originals = null) {
		const _target = this, target = _target.target;
		
		if (target.length) {
			const formId = target[0].form.id, elementId = target[0].id, validationProps = _target.validationProps();
			
			if (destroyValidation) {
				delete errorBag[formId][elementId];
				errorCount[formId] = Object.keys(errorBag[formId]).length;
			}
			
			_target.classlist.remove('border-danger', 'border-success');
			validationProps.validationIcon.fadeout(0).then(icons => {
				icons.touchStyle({opacity: 0}).classlist.remove('on');
				this.#_init && _target.removeFieldValidationPadding();
			});
			
			removeAlert && $fs(`${validationProps.validationField[0].id} > .alert`, context).target.forEach(alert => newBsAlert(alert).close());
			
			if (Object.keys(originals).length) {
				if (Object.keys(originals[elementId]).length) {
					originals[elementId].field.style.display = 'block';
					originals[elementId].label.style.display = 'block';
					
					if (!!validationProps.formGroup[0])
						validationProps.formGroup[0].remove();
				}
			}
			return this;
		}
		return console.warn('ReferenceError: Element is Undefined');
	}
	
	/**
	 * Displays validation message.
	 * @param icon {string}
	 * @param bsAlert {string} Bootstrap alert class
	 * @param message {string} Custom Message
	 * @param id {string|null} Related form field Id
	 * @param context {string|Iterable|Object|null}
	 * @param dismissible {boolean} Toggle dismissible message
	 * @param wait {boolean} Toggle displaying wait message
	 * @return {void|FBValidator}
	 */
	renderMessage(icon, bsAlert, message, id = null, context = null, dismissible = false, wait = false) {
		const _target = this, target = _target.target;
		if (target.length) {
			const alert = dismissible ? `${bsAlert} alert-dismissible` : bsAlert;
			const waitHTML = wait ? '<br><i class="fa fa-1x fa-spin fa-spinner"></i> Please Wait...' : '';
			const dismissHTML = dismissible ? '<a type="button" class="text-danger" data-bs-dismiss="alert"><i class="fa fa-times-circle"></i></a>' : '';
			const _messageElement = context ?
				(!$fs(target, context).length ? _target : $fs(target, context)) :
				_target;
			
			_messageElement.html.insert(`\
				<div class="alert ${alert} d-flex justify-content-between align-items-center show fade mt-1 p-1" data-alert-id="${id}" role="alert">\n\
					<div class="container-fluid">\n\
						<i class="${icon}"></i>\n\
						<span>${message}</span>${waitHTML}\n\
					</div>\n\
					${dismissHTML}
				</div>\n\
			`);
			return this
		}
		return console.warn('ReferenceError: Element is Undefined');
	}
}

Object.defineProperties(Object.prototype, {
	FUInit: {
		value: function () {
			return $fs(this);
		}, enumerable: false
	}
});

/**
 * Checks if any part of the given value is in the array.
 * @param value {String}
 * @return {boolean}
 */
Array.prototype.deepIncludes = function (value) {
	return !!this.filter(val => value.includes(val)).length;
}

window.FB = $fs;
