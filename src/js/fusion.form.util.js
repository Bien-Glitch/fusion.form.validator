/*!
* Fusion Form Validator V1.1.0
* fusion.form.validator.js (https://github.com/Bien-Glitch/fusion.form.validator/tree/v1.1.0)
* Copyright 2023 Fusion Bolt inc.
*/

/**
 * ----------------------------------------------------------
 * Fusion Form Validator - Utilities (v1.1.0)
 * ----------------------------------------------------------
 * (**Global Variables Declaration**)
 */
let valid_right,
	padding_right,
	currentAnimation,
	currentAnimationTimeout,
	toggler_padding_right = 0,
	form_group = '.form-group',
	input_group = '.input-group',
	form_field_group = '.form-field-group',
	buttonLoader = '.button-loader',
	wait = '.waiting-text',
	_response = '.response-text',
	_globalMessageTag = $el('#global-message-wrapper'),
	errorBag = {},
	errorCount = {},
	paddingMultipliers = {};

const alert_d = 'alert-danger';
const alert_i = 'alert-info';
const alert_s = 'alert-success';

const fa_check = 'fa-check';
const fa_check_c = 'fa-check-circle';
const fa_check_d = 'fa-check-double';
const fa_exc = 'fa-exclamation';
const fa_exc_c = 'fa-exclamation-circle';
const fa_info = 'fa-info';
const fa_info_c = 'fa-info-circle';
const fa_wifi_s = 'fa-wifi-slash';

/**
 * ----------------------------------------------------------
 * (**Utility Methods**)
 * ----------------------------------------------------------
 */

/**
 * Validate the given form field element.
 *
 * @param context {HTMLElement|[HTMLElement]|undefined}
 * @param message {string|null}
 * @param isPassword {boolean}
 * @param isError {boolean}
 * @returns {[HTMLElement]}
 */
/*Object.prototype.validate = function ({context, message = null, isPassword = false, isError = false} = {}) {
	if (this) {
		const target = (this.constructor.name.toUpperCase() === 'NODELIST' || this.constructor.name.toUpperCase() === 'S')
			? Array.from(this) : (Array.isArray(this) ? this : [this]);
		
		const formId = target[0].form.id;
		const tagName = target[0].tagName.toLowerCase();
		const elementId = target[0].id.toLowerCase();
		const elementType = target[0].type.toLowerCase();
		const filterType = new Set(['date', 'datetime', 'datetime-local']);
		
		let paddingMultiplier = paddingMultipliers[formId],
			_toggler_padding_right = parseInt(toggler_padding_right.toString().replace('px', '')),
			leftPadding = target.getCssValue('padding-left') === '0px' ? '10px' : target.getCssValue('padding-left'),
			_leftPadding = parseInt(leftPadding.replace('px', '')),
			validationIconRight = `${((tagName !== 'select' && !filterType.has(elementType)) ? _leftPadding : _leftPadding * 3)}px`,
			horizontalPadding = `${((elementType === 'password' && _toggler_padding_right) ? ((_leftPadding * 2) + _toggler_padding_right) : (tagName !== 'select' ? _leftPadding * 2 : _leftPadding * 5)) + _leftPadding}px`,
			minLength = tagName !== 'select' && target.attribute('minlength'),
			customMessage = minLength ?
				(!message && target[0].value.length < minLength ? `This field requires a minimum of ${minLength} characters.` : message) :
				(!message && isPassword ? 'Check Passwords.' : message);
		
		if (filterType.has(elementType))
			valid_right = target.includesClass('form-control-sm') ? multiplyPadding(validationIconRight, paddingMultiplier.validDate$sm) : multiplyPadding(validationIconRight, paddingMultiplier.validDate);
		else if (tagName === 'select') {
			valid_right = target.includesClass('form-control-sm') || target.includesClass('form-select-sm') ? multiplyPadding(validationIconRight, paddingMultiplier.validSelect$sm) : multiplyPadding(validationIconRight, paddingMultiplier.validSelect)
			padding_right = target.includesClass('form-control-sm') || target.includesClass('form-select-sm') ? multiplyPadding(horizontalPadding, paddingMultiplier.validSelect$sm) : multiplyPadding(horizontalPadding, paddingMultiplier.validSelect)
		} else {
			valid_right = target.includesClass('form-control-sm') ? multiplyPadding(validationIconRight, paddingMultiplier.validInput$sm) : multiplyPadding(validationIconRight, paddingMultiplier.validInput)
			padding_right = target.includesClass('form-control-sm') ? multiplyPadding(horizontalPadding, paddingMultiplier.input$sm) : multiplyPadding(horizontalPadding, paddingMultiplier.input);
		}
		if (!target[0].value || !target[0].value.length || target[0].value.length < minLength || (isPassword && (!target[0].value.length || customMessage)) || isError) {
			target.showError({context: context, message: customMessage});
		} else
			target.showSuccess({context: context, message: customMessage});
		onAlertClose(context);
		return target;
	}
	return [];
}*/

/**
 * Check if the form field element should be validated.
 *
 * @returns {boolean|boolean}
 */
// Object.prototype.needsValidation = function () {
// 	const target = (this.constructor.name.toUpperCase() === 'NODELIST' || this.constructor.name.toUpperCase() === 'S')
// 		? Array.from(this) : (Array.isArray(this) ? this : [this]);
// 	return target[0] ? (!!target[0].dataset['fbValidate'] ? parseBool(target[0].dataset['fbValidate']) : true) : false;
// }

/**
 * Set CSS styles to the given element using KeyValue Pairs.
 *
 * @param keyValuePair {Object}
 * @returns {[HTMLElement]}
 */
/*Object.prototype.touchCssValue = function (keyValuePair) {
	const target = (this.constructor.name.toUpperCase() === 'NODELIST' || this.constructor.name.toUpperCase() === 'S')
		? Array.from(this) : (Array.isArray(this) ? this : [this]);
	if (Object.keys(keyValuePair).length)
		Object.keys(keyValuePair).forEach(key => target.forEach(element => element.style[key] = keyValuePair[key]));
	return target;
}*/

/**
 * Get CSS style Value.
 *
 * @param property {string}
 * @returns {string|undefined}
 */
/*Object.prototype.getCssValue = function (property) {
	const target = (this.constructor.name.toUpperCase() === 'NODELIST' || this.constructor.name.toUpperCase() === 'S')
		? Array.from(this) : (Array.isArray(this) ? this : [this]);
	return target ? (target.cssProperty().getPropertyValue(property)) : undefined;
}*/

/*Object.prototype.cssProperty = function () {
	return window.getComputedStyle(this[0]);
}*/

/**
 * Add class to the elements' class list.
 *
 * @param className {string}
 * @returns {[HTMLElement]}
 */
/*Object.prototype.classListAdd = function (className) {
	const target = (this.constructor.name.toUpperCase() === 'NODELIST' || this.constructor.name.toUpperCase() === 'S')
		? Array.from(this) : (Array.isArray(this) ? this : [this]);
	target.forEach(element => element.classList.add(className));
	return target;
}*/

/**
 * Remove class from the elements' class list.
 *
 * @param className {string}
 * @returns {[HTMLElement]}
 */
/*Object.prototype.classListRemove = function (className) {
	const target = (this.constructor.name.toUpperCase() === 'NODELIST' || this.constructor.name.toUpperCase() === 'S')
		? Array.from(this) : (Array.isArray(this) ? this : [this]);
	target.forEach(element => element.classList.remove(className));
	return target;
}*/

/**
 * Check if element has given class.
 *
 * @param className {string}
 * @returns {boolean|undefined}
 */
/*
Object.prototype.includesClass = function (className) {
	const target = (this.constructor.name.toUpperCase() === 'NODELIST' || this.constructor.name.toUpperCase() === 'S')
		? Array.from(this) : (Array.isArray(this) ? this : [this]);
	
	return target ? (target[0].classList.contains(className)) : undefined;
}
*/

/**
 * Adds padding to the right of the element via the {padding_right} variable.
 *
 * @returns {[HTMLElement]}
 */
/*Object.prototype.addValidationPadding = function () {
	const target = (this.constructor.name.toUpperCase() === 'NODELIST' || this.constructor.name.toUpperCase() === 'S')
		? Array.from(this) : (Array.isArray(this) ? this : [this]);
	
	target[0].attribute('type') && (target[0].attribute('type').toLowerCase() !== 'date') && target.touchCssValue({paddingRight: padding_right});
	return target;
}*/

/**
 * Resets the value of the padding-right CSS property to the value of the padding-left CSS property of the element.
 *
 * @returns {[HTMLElement]}
 */
/*Object.prototype.removeValidationPadding = function () {
	const target = (this.constructor.name.toUpperCase() === 'NODELIST' || this.constructor.name.toUpperCase() === 'S')
		? Array.from(this) : (Array.isArray(this) ? this : [this]);
	
	target[0].attribute('type') && (target[0].attribute('type').toLowerCase() !== 'date') && target.touchCssValue({paddingRight: target.getCssValue('padding-left')});
	return target;
}*/

/**
 * Checks if the target element has the given element.
 *
 * Returns an array of the element if true else an empty array is returned.
 *
 * @param element {NodeList|HTMLElement|[HTMLElement]}
 * @returns {*[]}
 */
/*Object.prototype.nodeContains = function (element) {
	const data = [];
	const contains = [];
	const target = (this.constructor.name.toUpperCase() === 'NODELIST' || this.constructor.name.toUpperCase() === 'S')
		? Array.from(this) : (Array.isArray(this) ? this : [this]);
	
	target.forEach(group => data.push(group.innerHTML.trim()));
	!!element ? data.some(group => group.includes(element.outerHTML) && contains.push(element)) : contains.push();
	return contains;
}*/

/**
 * Returns the Previous sibling of the target element.
 *
 * Returns the sibling that matches the selector if the selector is given else the direct previous sibling is returned.
 *
 * @param selector
 * @returns {HTMLElement|Element|*}
 */
/*Object.prototype.previousSiblings = function (selector) {
	const target = (this.constructor.name.toUpperCase() === 'NODELIST' || this.constructor.name.toUpperCase() === 'S')
		? Array.from(this) : (Array.isArray(this) ? this : [this]);
	
	let sibling = target[0].previousElementSibling;
	
	// If there's no selector, return the first sibling
	if (!selector) return sibling;
	
	// If the sibling matches our selector, use it
	// If not, jump to the next sibling and continue the loop
	while (sibling) {
		if (sibling.matches(selector)) return sibling;
		sibling = sibling.previousElementSibling
	}
	return sibling;
}*/

/**
 * Returns an array of the elements siblings.
 *
 * An empty array is returned if there are no siblings.
 *
 * @returns {*[]}
 */
/*
Object.prototype.siblings = function () {
	const target = (this.constructor.name.toUpperCase() === 'NODELIST' || this.constructor.name.toUpperCase() === 'S')
		? Array.from(this) : (Array.isArray(this) ? this : [this]);
	if (target[0].parentNode === null) return [];
	return [...target[0].parentNode.children].filter(child => {
		return child !== target[0];
	});
}
*/

/**
 * Checks the status of given CSS Pseudo selector on the target element.
 *
 * @param selector
 * @returns {boolean}
 */
/*Object.prototype.selectorMatches = function (selector) {
	const target = (this.constructor.name.toUpperCase() === 'NODELIST' || this.constructor.name.toUpperCase() === 'S')
		? Array.from(this) : (Array.isArray(this) ? this : [this]);
	return (target[0].matches || target[0].matchesSelector || target[0].msMatchesSelector || target[0].mozMatchesSelector || target[0].webkitMatchesSelector || target[0].oMatchesSelector).call(target[0], selector);
}*/

/**
 * Checks if the mouse cursor is over the element.
 *
 * @returns {Promise<boolean>}
 */
/*Object.prototype.mouseIsOver = async function () {
	const target = (this.constructor.name.toUpperCase() === 'NODELIST' || this.constructor.name.toUpperCase() === 'S')
		? Array.from(this) : (Array.isArray(this) ? this : [this]);
	
	return new Promise(async resolve => {
		await target.forEach(element => {
			resolve(element.selectorMatches(':hover'))
		})
	});
}*/

/**
 * Checks if the given form field element is a Phone number field.
 *
 * @returns {boolean}
 */
/*Object.prototype.isPhoneField = function () {
	const target = this;
	const fbRole = target.dataset['fbRole'] && target.dataset['fbRole'].toLowerCase();
	const elementId = target.attribute('id') && target.id.toLowerCase();
	const elementType = target.attribute('type') && target.type.toLowerCase();
	return !!(elementType === 'tel' || fbRole === 'phone' || elementId.match(/phone/gi));
}*/

/**
 * Checks if the given form field element is a Password field.
 *
 * @returns {boolean}
 */
/*Object.prototype.isPasswordField = function (passwordId) {
	const target = this;
	const elementId = target.attribute('id') && target.id.toLowerCase();
	const elementName = target.attribute('name') && target.name.toLowerCase();
	const elementType = target.attribute('type') && target.type.toLowerCase();
	return !!((elementType && elementType.toLowerCase() === 'password') || (elementId && elementId.toLowerCase().includes(passwordId))) || (elementName && elementName.toLowerCase().includes(passwordId));
}*/

/**
 * Validates the given form field element using the given RegExp.
 *
 * @param regExp
 * @param context
 * @param message
 * @param customValidation
 * @returns {*[]|[HTMLElement]}
 */
/*Object.prototype.regExpValidate = function ({regExp, context, message, customValidation} = {}) {
	if (this) {
		const target = (this.constructor.name.toUpperCase() === 'NODELIST' || this.constructor.name.toUpperCase() === 'S')
			? Array.from(this) : (Array.isArray(this) ? this : [this]);
		
		typeof customValidation === 'function' ? customValidation() : (target[0].value.length ?
			(target[0].value.match(regExp) ? target.validate({context: context}) : target.validate({context: context, message: message, isError: true})) :
			checkValidate(target, context));
		return target;
	}
	return [];
}*/

/**
 * Validates the given input field as an E-Mail field with the given RegExp.
 *
 * @param regExp {RegExp}
 * @param context {HTMLElement|[HTMLElement]|undefined}
 * @returns {unknown[]|Object.regExpValidate|Object.regExpValidate[]|[]|*[]}
 */
/*Object.prototype.emailValidate = function (regExp, context) {
	return this ? this.regExpValidate({regExp: regExp, context: context, message: 'Please input a valid E-Mail Address format:<br> (eg. johndoe@mail.com)'}) : [];
}*/

/**
 * Validates the given input field as a Name field with the given RegExp.
 *
 * @param regExp {RegExp}
 * @param context {HTMLElement|[HTMLElement]|undefined}
 * @returns {unknown[]|Object.regExpValidate|Object.regExpValidate[]|[]|*[]}
 */
/*Object.prototype.nameValidate = function (regExp, context) {
	return this ? this.regExpValidate({regExp: regExp, context: context, message: 'Please input a valid Name format:<br> (eg. John Doe, John Wood Doe)'}) : [];
}*/

/**
 * Validates the given input field as a Phone Number field with the given RegExp.
 *
 * @param regExp {RegExp}
 * @param context {HTMLElement|[HTMLElement]|undefined}
 * @returns {unknown[]|Object.regExpValidate|Object.regExpValidate[]|[]|*[]}
 */
/*Object.prototype.phoneValidate = function (regExp, context) {
	return this ? this.regExpValidate({regExp: regExp, context: context, message: 'Please input a valid Phone Number format:<br> (eg. +234 8076899243, +1 211 1041)'}) : [];
}*/

/**
 * Validates the given input field as a Card CVV field with the given RegExp.
 *
 * @param regExp {RegExp}
 * @param context {HTMLElement|[HTMLElement]|undefined}
 * @returns {unknown[]|Object.regExpValidate|Object.regExpValidate[]|[]|*[]}
 */
/*Object.prototype.cardCvvValidate = function (regExp, context) {
	return this ? this.regExpValidate({regExp: regExp, context: context, message: 'Please input a valid CVV'}) : [];
}*/

/**
 * Validates the given input field as a Card Number field with the given RegExp.
 *
 * @param regExp {RegExp}
 * @param context {HTMLElement|[HTMLElement]|undefined}
 * @returns {unknown[]|Object.regExpValidate|Object.regExpValidate[]|[]|*[]}
 */
/*Object.prototype.cardNumberValidate = function (regExp, context) {
	return this ? this.regExpValidate({
		customValidation: () =>
			this[0].value.length ? (this[0].value.match(regExp) ? (checkLuhn(this[0].value) ? this.validate({context: context}) : this.validate({context: context, message: 'Please check card number and try again.', isError: true})) : this.validate({
				context: context,
				message: 'Only numbers are allowed.',
				isError: true
			})) : checkValidate(this, context)
	}) : [];
}*/

/**
 * Validates the given input field as a Username field with the given RegExp.
 *
 * @param regExp {RegExp}
 * @param context {HTMLElement|[HTMLElement]|undefined}
 * @returns {unknown[]|Object.regExpValidate|Object.regExpValidate[]|[]|*[]}
 */
/*Object.prototype.usernameValidate = function (regExp, context) {
	return this ? this.regExpValidate({
		customValidation: () =>
			this[0].value.length ? (this[0].value.length > 2 ? (this[0].value.match(regExp) ? this.validate({context: context}) : this.validate({context: context, message: 'Please input a valid Username format:<br> (ie. Username must start and end with an alphabet, and must contain only alphabets, and underscore.)', isError: true})) : this.validate({
				context: context,
				message: 'Username must have a minimum of 3 characters.',
				isError: true
			})) : checkValidate(this, context)
	}) : [];
}*/
/*
/!**
 * Inserts given HTML string in the target element (inner HTML).
 *
 * @param value {string|null}
 * @returns {[HTMLElement]}
 *!/
Object.prototype.insertHTML = function (value) {
	const target = (this.constructor.name.toUpperCase() === 'NODELIST' || this.constructor.name.toUpperCase() === 'S')
		? Array.from(this) : (Array.isArray(this) ? this : [this]);
	target.forEach(element => element.innerHTML = value);
	return target;
}

/!**
 * Inserts given HTML string after the beginning of the target element.
 *
 * @param value {string}
 * @returns {[HTMLElement]}
 *!/
Object.prototype.prependHTML = function (value) {
	const target = (this.constructor.name.toUpperCase() === 'NODELIST' || this.constructor.name.toUpperCase() === 'S')
		? Array.from(this) : (Array.isArray(this) ? this : [this]);
	target.forEach(element => element.insertAdjacentHTML('afterbegin', value));
	return target;
}

/!**
 * Inserts given HTML string just at the end of the target element.
 *
 * @param value
 * @returns {[HTMLElement]}
 *!/
Object.prototype.appendHTML = function (value) {
	const target = (this.constructor.name.toUpperCase() === 'NODELIST' || this.constructor.name.toUpperCase() === 'S')
		? Array.from(this) : (Array.isArray(this) ? this : [this]);
	target.forEach(element => element.insertAdjacentHTML('beforeend', value));
	return target;
}

/!**
 * Inserts given HTML string before the beginning of the target element (Before element).
 *
 * @param value {string}
 * @returns {[HTMLElement]}
 * @constructor
 *!/
Object.prototype.HTMLBefore = function (value) {
	const target = (this.constructor.name.toUpperCase() === 'NODELIST' || this.constructor.name.toUpperCase() === 'S')
		? Array.from(this) : (Array.isArray(this) ? this : [this]);
	target.forEach(element => element.insertAdjacentHTML('beforebegin', value));
	return target;
}

/!**
 * Inserts given HTML string after the end of the target element (After element).
 *
 * @param value {string}
 * @returns {[HTMLElement]}
 * @constructor
 *!/
Object.prototype.HTMLAfter = function (value) {
	const target = (this.constructor.name.toUpperCase() === 'NODELIST' || this.constructor.name.toUpperCase() === 'S')
		? Array.from(this) : (Array.isArray(this) ? this : [this]);
	target.forEach(element => element.insertAdjacentHTML('afterend', value));
	return target;
}*/

/**
 * Add fadein Animation to target element.
 *
 * @param timeout {number}
 * @param toggleDisplay {boolean}
 * @param display
 * @param callback
 * @returns {[HTMLElement]}
 */
/*Object.prototype.fadein = function ({timeout = 300, toggleDisplay = false, display = 'block', callback} = {}) {
	const target = (this.constructor.name.toUpperCase() === 'NODELIST' || this.constructor.name.toUpperCase() === 'S')
		? Array.from(this) : (Array.isArray(this) ? this : [this]);
	
	target.forEach(element => {
		let timeoutID = {},
			_display = element.getCssValue('display');
		toggleDisplay && (_display === 'none' && element.touchCssValue({opacity: 0, transition: `all ease-in-out ${timeout}ms`}));
		
		const timeOutFunc = (callback) => {
			const animation = () => {
				const keyframes = [
					{opacity: 0, display: 'none'},
					{opacity: '100%', display: display}
				]
				const timing = {
					duration: timeout,
					iterations: 1
				}
				
				if (toggleDisplay && _display === 'none') {
					// display === 'none' && (element.touchCssValue({display: 'block'}));
					currentAnimation = element.animate(keyframes, timing);
					currentAnimation.id = 'fadein';
				}
				clearTimeout(timeoutID[element.id]);
				toggleDisplay && element.touchCssValue({opacity: 1, display: display});
				
				setTimeout(() => {
					element.touchCssValue({animation: null, transition: null});
					/!*currentAnimation = null;*!/
					typeof callback === 'function' && callback(target)
				}, timeout);
			}
			!!currentAnimation ? currentAnimation.finished.then(() => animation()) : animation();
		};
		
		timeoutID[element.id] = setTimeout(() => {
			timeOutFunc(callback);
		}, 0)
	});
	return target;
}*/

/**
 * Add fadeout Animation to target element.
 *
 * @param timeout {number}
 * @param toggleDisplay {boolean}
 * @param callback
 * @returns {[HTMLElement]}
 */
/*Object.prototype.fadeout = function ({timeout = 300, toggleDisplay = false, callback} = {}) {
	const target = (this.constructor.name.toUpperCase() === 'NODELIST' || this.constructor.name.toUpperCase() === 'S')
		? Array.from(this) : (Array.isArray(this) ? this : [this]);
	
	target.forEach(element => {
		let timeoutID = {},
			_display = element.getCssValue('display');
		toggleDisplay && (_display !== 'none' && element.touchCssValue({opacity: 1, transition: `all ${timeout}ms`}));
		
		const timeOutFunc = (callback) => {
			const animation = () => {
				const keyframes = [
					{opacity: 1, display: 'block'},
					{opacity: 0}
				]
				const timing = {
					duration: timeout,
					iterations: 1
				}
				
				if (toggleDisplay && _display !== 'none') {
					currentAnimation = element.animate(keyframes, timing);
					currentAnimation.id = 'fadeout';
				}
				clearTimeout(timeoutID[element.id]);
				
				setTimeout(() => {
					element.touchCssValue({opacity: 0});
					toggleDisplay && element.touchCssValue({display: 'none'});
					element.touchCssValue({animation: null, transition: null});
					typeof callback === 'function' && callback(target)
				}, timeout);
			}
			!!currentAnimation ? currentAnimation.finished.then(() => animation()) : animation();
		};
		
		timeoutID[element.id] = setTimeout(() => {
			timeOutFunc(callback);
		}, 0);
	});
	return target;
}*/

/**
 * Add slidein Animation to target element.
 *
 * @param timeout {number}
 * @param callback
 * @returns {[HTMLElement]}
 */
/*Object.prototype.slideInDown = function ({timeout = 300, callback} = {}) {
	const target = (this.constructor.name.toUpperCase() === 'NODELIST' || this.constructor.name.toUpperCase() === 'S')
		? Array.from(this) : (Array.isArray(this) ? this : [this]);
	
	target.forEach(element => {
		let timeoutID = {},
			display = [element].getCssValue('display');
		element.touchCssValue({opacity: '0', transition: `all ${timeout}ms`});
		
		const timeOutFunc = (callback) => {
			const animation = () => {
				const keyframes = [
					{opacity: 0, transform: 'translate3d(0, -100%, 0)'},
					{opacity: '100%', transform: 'none'}
				]
				const timing = {
					duration: timeout,
					iterations: 1
				}
				
				display === 'none' && (element.touchCssValue({display: 'block'}));
				currentAnimation = element.animate(keyframes, timing);
				currentAnimation.id = 'slideInDown';
				
				clearTimeout(timeoutID[element.id]);
				
				setTimeout(() => {
					element.touchCssValue({opacity: 1});
					element.touchCssValue({animation: null, transition: null});
					/!*currentAnimation = null;*!/
					typeof callback === 'function' && callback(target)
				}, timeout);
			}
			!!currentAnimation ? currentAnimation.finished.then(() => animation()) : animation();
		};
		
		timeoutID[element.id] = setTimeout(() => {
			timeOutFunc(callback);
		}, 0)
	});
	return target;
}*/

/**
 * Add slideout Animation to target element.
 *
 * @param timeout {number}
 * @param callback
 * @returns {[HTMLElement]}
 */
/*Object.prototype.slideOutUp = function ({timeout = 300, callback} = {}) {
	const target = (this.constructor.name.toUpperCase() === 'NODELIST' || this.constructor.name.toUpperCase() === 'S')
		? Array.from(this) : (Array.isArray(this) ? this : [this]);
	
	target.forEach(element => {
		let timeoutID = {},
			display = [element].getCssValue('display');
		element.touchCssValue({opacity: '1', transition: `all ${timeout}ms`});
		
		const timeOutFunc = (callback) => {
			const animation = () => {
				const keyframes = [
					{opacity: '100%', transform: 'none'},
					{opacity: 0, transform: 'translate3d(0, -100%, 0)'}
				]
				const timing = {
					duration: timeout,
					iterations: 1
				}
				
				currentAnimation = element.animate(keyframes, timing);
				currentAnimation.id = 'slideOutUp';
				
				clearTimeout(timeoutID[element.id]);
				
				setTimeout(() => {
					element.touchCssValue({opacity: 0});
					display !== 'none' && (element.touchCssValue({display: 'none'}));
					element.touchCssValue({animation: null, transition: null});
					typeof callback === 'function' && callback()
				}, timeout);
			}
			!!currentAnimation ? currentAnimation.finished.then(() => animation()) : animation();
		};
		
		timeoutID[element.id] = setTimeout(() => {
			timeOutFunc(callback);
		}, 0)
	});
	return target;
}*/

/**
 * Set the given property / properties for the target element.
 * Set property if key and value is a string.
 * Set properties if key is KeyValue pair object.
 *
 * @param key {string|object}
 * @param value
 * @returns {[HTMLElement]}
 */
/*Object.prototype.touchProperty = function (key, value) {
	const target = (this.constructor.name.toUpperCase() === 'NODELIST' || this.constructor.name.toUpperCase() === 'S')
		? Array.from(this) : (Array.isArray(this) ? this : [this]);

	(key.constructor.name.toUpperCase() === 'OBJECT' && Object.keys(key).length && !value) ?
		Object.keys(key).forEach(prop => target.forEach(element => element[prop] = key[prop])) :
		target.forEach(element => element[key] = value);
	return target;
}*/

/**
 * Get the given property of the target element if only the key is given as a string.
 * Set the given property / properties for the target element.
 * Set property if key and value is a string.
 * Set properties if key is KeyValue pair object.
 *
 * @param key {string|object}
 * @param value
 * @returns {[HTMLElement]}
 */
/*Object.prototype.property = function (key, value) {
	const target = (this.constructor.name.toUpperCase() === 'NODELIST' || this.constructor.name.toUpperCase() === 'S')
		? Array.from(this) : (Array.isArray(this) ? this : [this]);

	return key.constructor.name.toUpperCase() === 'OBJECT' ?
		target.touchProperty(key) :
		((key && value) ? target.touchProperty(key, value) : target[0][key]);
}*/

/**
 * Set the given attribute(s) for the target element.
 * Set attribute if key and value is a string.
 * Set attributes if key is KeyValue pair object.
 *
 * @param key {string|object}
 * @param value
 * @returns {[HTMLElement]}
 */
/*Object.prototype.touchAttribute = function (key, value) {
	const target = (this.constructor.name.toUpperCase() === 'NODELIST' || this.constructor.name.toUpperCase() === 'S')
		? Array.from(this) : (Array.isArray(this) ? this : [this]);

	(key.constructor.name.toUpperCase() === 'OBJECT' && Object.keys(key).length && !value) ?
		Object.keys(key).forEach(prop => target.forEach(element => element.setAttribute(prop, key[prop]))) :
		target.forEach(element => element.setAttribute(key, value));
	return target;

}*/

/**
 * Get the given attribute(s) of the target element if only the key is given as a string.
 * Set the given attribute for the target element.
 * Set attribute if key and value is a string.
 * Set attributes if key is KeyValue pair object.
 *
 * @param key {string|object}
 * @param value
 * @returns {string|touchAttribute}
 */
/*Object.prototype.attribute = function (key, value = null) {
	const target = (this.constructor.name.toUpperCase() === 'NODELIST' || this.constructor.name.toUpperCase() === 'S')
		? Array.from(this) : (Array.isArray(this) ? this : [this]);

	return target.length && (key.constructor.name.toUpperCase() === 'OBJECT' ?
		target.touchAttribute(key) :
		((key && value) ? target.touchAttribute(key, value) : target[0].getAttribute(key)));
}*/


/**
 * Get the given data-* attribute value of the target element if only the key is given as a string.
 *
 * @param key {string|object}
 * @param value {string|undefined|null}
 * @returns {[HTMLElement]}
 */
/*Object.prototype.touchDataAttribute = function (key, value) {
	const target = (this.constructor.name.toUpperCase() === 'NODELIST' || this.constructor.name.toUpperCase() === 'S')
		? Array.from(this) : (Array.isArray(this) ? this : [this]);
	target.forEach(element => element.dataset[key] = value);
	// target[0].dataset[key] = value;
	return target;
}*/

/**
 * Get or set the given data-* attribute value of the target element if only the key is given as a string.
 * Get the given data-* attribute if only key is given.
 * Set the given data-* attribute if key and pair is available.
 *
 * @param key {string|object}
 * @param value
 * @returns {string|touchDataAttribute}
 */
/*Object.prototype.dataAttribute = function (key, value = null) {
	const target = (this.constructor.name.toUpperCase() === 'NODELIST' || this.constructor.name.toUpperCase() === 'S')
		? Array.from(this) : (Array.isArray(this) ? this : [this]);
	return value ? target.touchDataAttribute(key, value) : target[0].dataset[key];
}*/

/**
 * Add event listener(s) to the target element and apply callback on them.
 *
 * @param events {string|object}
 * @param callback
 * @param option {boolean}
 * @returns {Object}
 */
/*Object.prototype.upon = function (events, callback = null, option = false) {
	const target = (this.constructor.name.toUpperCase() === 'NODELIST' || this.constructor.name.toUpperCase() === 'S')
		? Array.from(this) : (Array.isArray(this) ? this : [this]);
	target.forEach(element => {
		if (typeof events === 'object')
			Object.keys(events).filter(evt => element.addEventListener(evt, (e) => handler.handleEvent({evt: e, prefix: 'on', callback: events[evt]}), option));
		else
			typeof callback === 'function' ? element.addEventListener(events, (e) => callback(e), option) : console.error('Listener undefined');
	});
	return target;
}*/


/**
 * Displays validation message.
 *
 * @param bsAlert {string} Bootstrap alert class
 * @param faIcon {string} Fa-Icon class
 * @param message {string} Custom Message
 * @param id Related form field Id
 * @param context
 * @param dismissible {boolean} Toggle dismissible message
 * @param wait {boolean} Toggle displaying wait message
 * @returns {Object} target element
 */
/*Object.prototype.renderMessage = function (bsAlert, faIcon, message, id, context = null, dismissible = false, wait = false) {
	const target = this;
	const alert = dismissible ? `${bsAlert} alert-dismissible` : bsAlert;
	const waitHTML = wait ? '<br><i class="fa fa-1x fa-spin fa-spinner"></i> Please Wait...' : '';
	const dismissHTML = dismissible ? '<a type="button" class="text-danger" data-bs-dismiss="alert"><i class="fa fa-times-circle"></i></a>' : '';
	let _messageElement = context ? (!$el(`#${target[0].id}`, context) ? target : $el(`#${target[0].id}`, context)) : target;
	
	_messageElement.insertHTML(`\
		<div class="alert ${alert} d-flex justify-content-between align-items-center show fade mt-1 p-1" data-alert-id="${id}" role="alert">\n\
			<div class="container-fluid">\n\
				<i class="fa-1x far ${faIcon}"></i>\n\
				<span>${message}</span>${waitHTML}\n\
			</div>\n\
			${dismissHTML}
		</div>\n\
	`);
	return this
}*/

/**
 * Check if the target form element has errors.
 *
 * @returns {{count (number), errors: (*|boolean)}|Error}
 */
Object.prototype.hasErrors = function () {
	let target = ((this.constructor.name.toUpperCase() === 'NODELIST' || this.constructor.name.toUpperCase() === 'S')
			? Array.from(this) : (Array.isArray(this) ? this : [this]))[0],
		errors = errorCount[target.id] > 0 ? errorBag[target.id] : false;
	
	if (target.tagName.toLowerCase() === 'form')
		return {
			count: errorCount[target.id],
			errors: errors,
		};
	
	console.error(`Expected 'form element' but '${target.tagName.toLowerCase()} element' given`);
	return new Error(`Function hasErrors() accepts only 'form element', '${target.tagName.toLowerCase()} element' given!`);
}

/**
 * Display validation errors for the target form.
 *
 * @param errors An Object of errors.
 * @param message {string} Validation message.
 * @param callback
 * @returns {[HTMLElement]}
 */
/*Object.prototype.displayValidationErrors = function (errors, message, callback) {
	let target = ((this.constructor.name.toUpperCase() === 'NODELIST' || this.constructor.name.toUpperCase() === 'S')
			? Array.from(this) : (Array.isArray(this) ? this : [this])),
		elements = $el(target[0]).allElements();
	
	Object.keys(errors).forEach((element) => {
		if (element in elements && errors[element] !== '')
			$el(`#${element}`, target[0]).validate({context: target[0], message: errors[element], isError: true});
		else {
			if (errors[element] === '')
				$el(`#${element}`, target[0]).validate({context: target[0], message: 'Verify input and try again.', isError: true});
		}
	});
	
	(typeof message === 'string' && message.length) && $el(target[0]).messageTag().renderMessage(alert_d, fa_exc_c, message, null, target[0], true);
	typeof callback === 'function' && callback();
	
	return target
}*/

/**
 * Remove validation errors from target element(s).
 *
 * @param context
 * @param removeAlert {boolean}
 * @param destroyValidation {boolean}
 * @returns {[HTMLElement]}
 */
Object.prototype.removeValidationMessage = function ({context, removeAlert = false, destroyValidation = false} = {}) {
	const target = ((this.constructor.name.toUpperCase() === 'NODELIST' || this.constructor.name.toUpperCase() === 'S')
		? Array.from(this) : (Array.isArray(this) ? this : [this]));
	const validationProps = target.getValidationProps();
	let validationField = validationProps.validationField,
		validationIcon = validationProps.validationIcon,
		validationFieldId = validationField[0].id;
	
	if (destroyValidation) {
		delete errorBag[target[0].form.id][target[0].id];
		errorCount[target[0].form.id] = Object.keys(errorBag[target[0].form.id]).length;
	}
	validationIcon.fadeout();
	target.removeValidationPadding();
	
	if (removeAlert)
		$el(`#${validationFieldId} > .alert`, context).forEach(field => newBsAlert(field).close());
	target.classListRemove('border-danger').classListRemove('border-success');
	
	return target
}

/**
 * Display validation error for the target element.
 *
 * @param context
 * @param message
 * @param showIcon {boolean}
 * @returns {[HTMLElement]|*[]}
 */
/*
Object.prototype.showError = function ({context, message, showIcon = true} = {}) {
	if (this) {
		const target = ((this.constructor.name.toUpperCase() === 'NODELIST' || this.constructor.name.toUpperCase() === 'S')
			? Array.from(this) : (Array.isArray(this) ? this : [this]));
		const validationProps = target.getValidationProps();
		let customMessage = message ?? 'This field is required.';
		errorBag[target[0].form.id][target[0].id] = customMessage;
		toggleValidationIcon({show: validationProps.invalidIcon, hide: validationProps.validIcon}, target, showIcon);
		
		customMessage ? validationProps.validationField.renderMessage(alert_d, fa_exc_c, customMessage, validationProps.id, context, true) : validationProps.validationField.insertHTML(null);
		target.classListRemove('border-success').classListAdd('border-danger');
		errorCount[target[0].form.id] = Object.keys(errorBag[target[0].form.id]).length;
		return target;
	}
	return [];
}
*/

/**
 * Display validation success for the target element.
 * @param context
 * @param message
 * @param showIcon {boolean}
 * @returns {[HTMLElement]|*[]}
 */
// Object.prototype.showSuccess = function ({context, message, showIcon = true} = {}) {
// 	if (this) {
// 		const target = ((this.constructor.name.toUpperCase() === 'NODELIST' || this.constructor.name.toUpperCase() === 'S')
// 			? Array.from(this) : (Array.isArray(this) ? this : [this]));
// 		const validationProps = target.getValidationProps();
// 		delete errorBag[target[0].form.id][target[0].id];
// 		errorCount[target[0].form.id] = Object.keys(errorBag[target[0].form.id]).length;
// 		toggleValidationIcon({show: validationProps.validIcon, hide: validationProps.invalidIcon}, target, showIcon);
//
// 		message ? validationProps.validationField.renderMessage(alert_s, fa_check, message, validationProps.id, context, true) : validationProps.validationField.insertHTML(null);
// 		target.classListRemove('border-danger').classListAdd('border-success');
// 		errorCount[target[0].form.id] = Object.keys(errorBag[target[0].form.id]).length;
// 		return target;
// 	}
// 	return [];
// }

/**
 * Get the Validation properties for the target element.
 *
 * @returns {{validationField: (*[]|NodeListOf<*>|boolean), invalidIcon: (*[]|NodeListOf<*>|boolean), id: string, validIcon: (*[]|NodeListOf<*>|boolean), validationIcon: (*[]|NodeListOf<*>|boolean)}|{}}
 */
Object.prototype.getValidationProps = function () {
	if (this) {
		const target = ((this.constructor.name.toUpperCase() === 'NODELIST' || this.constructor.name.toUpperCase() === 'S')
			? Array.from(this) : (Array.isArray(this) ? this : [this]));
		const formId = `#${target[0].form.id}`;
		const targetId = `#${target[0].id}`;
		
		return {
			id: targetId,
			validationField: $el(`${formId} ${targetId}Valid`),
			validIcon: $el(`${formId} ${form_group}` + `${targetId}_group ${form_field_group} > .valid`),
			invalidIcon: $el(`${formId} ${form_group}` + `${targetId}_group ${form_field_group} > .invalid`),
			validationIcon: $el(`${formId} ${form_group}` + `${targetId}_group ${form_field_group} > .validation-icon`),
		}
	}
	return {};
}

/**
 * Get the initial submission text for the target form.
 *
 * @returns {*}
 */
/*Object.prototype.waitText = function () {
	const target = (this.constructor.name.toUpperCase() === 'NODELIST' || this.constructor.name.toUpperCase() === 'S')
		? Array.from(this) : (Array.isArray(this) ? this : [this]);
	return $el(wait, target[0])[0].innerHTML;
}*/

/**
 * Get the validation message element for the target form.
 *
 * @returns {*[]|NodeListOf<*>|boolean}
 */
/*Object.prototype.messageTag = function () {
	const target = (this.constructor.name.toUpperCase() === 'NODELIST' || this.constructor.name.toUpperCase() === 'S')
		? Array.from(this) : (Array.isArray(this) ? this : [this]);
	return $el(_response, target[0]);
}*/

/**
 * Returns the value of the elements' action attribute or data-action attribute.
 * [Only returns the latter if the initial is unavailable].
 *
 * @returns {string|*}
 */
/*Object.prototype.getAction = function () {
	const target = (this.constructor.name.toUpperCase() === 'NODELIST' || this.constructor.name.toUpperCase() === 'S')
		? Array.from(this) : (Array.isArray(this) ? this : [this]);
	const tag = target[0].tagName.toLowerCase();
	return tag === 'form' ? (target[0].action ?? target[0].attribute('action')) : target[0].dataAttribute('action');
}*/

/**
 * Return all elements of the target form element.
 * Returns an error on the console if the target element is not a form.
 * @returns {void|*}
 */
/*
Object.prototype.allElements = function () {
	const target = Array.isArray(this) ? this[0] : this
	return ((target.tagName && target.tagName.toLowerCase() !== 'form') ? console.error(`function 'allElements()' expects 'form element' but '${target.tagName.toLowerCase()} element' was given`) : target.elements);
}
*/

/**
 * Disable or Enable the target element.
 *
 * @param option {boolean}
 * @returns {[HTMLElement]}
 */
/*Object.prototype.disable = function (option = true) {
	const target = (this.constructor.name.toUpperCase() === 'NODELIST' || this.constructor.name.toUpperCase() === 'S')
		? Array.from(this) : (Array.isArray(this) ? this : [this]);
	target.forEach(element => {
		const elementTagName = element.tagName && element.tagName.toLowerCase();
		elementTagName !== 'a' ?
			option ? element.touchAttribute('disabled', 'disabled') : element.removeAttribute('disabled') :
			((!option) ? element.classListRemove('disabled') : element.classListAdd('disabled'));
	});
	return target;
}*/

/**
 * Load the given modal with a callback.
 *
 * @param options {Object}
 * @param callback {function}
 * @returns {[HTMLElement]}
 */
/*Object.prototype.onModalLoad = function (options, callback) {
	const target = (this.constructor.name.toUpperCase() === 'NODELIST' || this.constructor.name.toUpperCase() === 'S')
		? Array.from(this) : (Array.isArray(this) ? this : [this]);
	target.upon('show.bs.modal', (e) => typeof callback === 'function' ? callback(e) : (typeof options === 'function' && options(e)));
	newBsModal(target[0], typeof options === 'object' ? options : null).show();
	return target;
}*/

/**
 * Dispose the given modal with a callback.
 *
 * @param callback
 */
Object.prototype.onModalClose = function (callback) {
	this.upon('hide.bs.modal', (e) => {
		typeof callback === 'function' && callback(e)
		newBsModal(this[0]).hide();
	});
}

/**
 * Handle the submission of the target form using the [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
 *
 * Returns a promise which can be used to handle actions after response of the resource.
 *
 * @param uri {string}
 * @param method {string}
 * @param data {Object|null}
 * @param dataType {string}
 * @param onSuccess
 * @param onError
 * @returns {Promise<unknown>}
 */
Object.prototype./*handleFormSubmit = function ({uri = '', method = 'get', data = null, dataType = 'json', onSuccess, onError}) {
	const target = (this.constructor.name.toUpperCase() === 'NODELIST' || this.constructor.name.toUpperCase() === 'S')
		? Array.from(this) : (Array.isArray(this) ? this : [this]);
	
	return new Promise((resolve, reject) => {
		target.forEach(function (element) {
			if (element.tagName.toLowerCase() === 'form') {
				const formData = new FormData(element);
				const messageTag = $el(element).messageTag();
				const form = {
					hasErrors: !!$el(element).hasErrors().count,
					errors: $el(element).hasErrors().errors
				};
				data && Object.keys(data).length && Object.keys(data).forEach(key => formData.append(key, data[key]));
				let _messageTag = messageTag.length ? messageTag : (_globalMessageTag.length && _globalMessageTag);
				
				!form.hasErrors ? $fb.fetchReq({
					uri: uri,
					method: method,
					data: formData,
					dataType: dataType,
					beforeSend: () => {
						$fb.manipulateButton(element);
						messageTag.insertHTML($el(element).waitText()).fadein({toggleDisplay: true})
					},
					onError: (err, status) => {
						setTimeout(() => {
							_messageTag.renderMessage(alert_d, fa_wifi_s, 'Server error occurred, please try again.', null, form, true);
							$fb.manipulateButton(element, true);
							reject({response: err, status: status, messageTag: _messageTag, form: element});
						}, 1500);
					},
					onComplete: xhr => {
						let response = xhr.responseJSON,
							responseText = xhr.responseText,
							status = xhr.status;
						console.log(xhr)
						setTimeout(() => {
							if ((status > 199 && status < 300 || status === 308)) {
								if (status === 308 && dataType === 'json') {
									if (_messageTag.length) {
										_messageTag.renderMessage(alert_s, fa_check_c, response.message, null, form, false, true);
										_messageTag === messageTag ? setTimeout(() => _messageTag.fadeout({timeout: 800, toggleDisplay: true, callback: () => setTimeout(() => '/!*location.href = response.redirect*!/', 2000)}), 1000) :
											_messageTag === _globalMessageTag && _messageTag.slideInDown({
												timeout: 800,
												callback: (target) => setTimeout(() => target.slideOutUp({timeout: 800, callback: () => '/!*location.href = response.redirect*!/'}), 2000)
											});
									}
								} else
									resolve({JSON: response, text: responseText, form: element, messageTag: _messageTag});
							} else {
								if (dataType === 'json') {
									if (status === 419)
										_messageTag.length && _messageTag.renderMessage(alert_d, fa_exc_c, response.message, null, form, true);
									// location.href = response.redirect
									else if (status === 422 || status === 501) {
										_messageTag.length ?
											!!response.errors && element.displayValidationErrors(response.errors, response.message) :
											_messageTag.renderMessage(alert_d, fa_exc_c, response.message, null, form, true);
										_messageTag === _globalMessageTag && _messageTag.slideInDown({timeout: 800});
									} else {
										console.error('Server Failure', xhr);
										reject({response: xhr, status: status, messageTag: _messageTag, form: element});
									}
								} else {
									console.error('Server Failure', xhr);
									reject({response: xhr, status: status, messageTag: _messageTag, form: element});
								}
								$fb.manipulateButton(element, true);
							}
						}, 1500);
					},
				}) : $el(element).displayValidationErrors(form.errors, 'Given Data is invalid');
			}
		});
	});
}*/

/**
 * Loads specified Page/HTML into the target element from given URI.
 *
 * If the selector parameter is specified the it will load the content of the specified element for the given URI.
 *
 * @param uri {string}
 * @param selector {selector|string}
 * @param data {Object|null}
 * @param overlay {string|null}
 * @param dataType {string}
 * @param slug {string}
 * @param beforeSend
 * @param callback
 * @returns {Promise<unknown>}
 */
Object.prototype.loadPageData = async function ({uri, selector = null, data = null, overlay = null, dataType = 'text', slug = 'Page', beforeSend, callback}) {
	const target = (this.constructor.name.toUpperCase() === 'NODELIST' || this.constructor.name.toUpperCase() === 'S')
		? Array.from(this) : (Array.isArray(this) ? this : [this]);
	
	const requestType = !data ? 'get' : 'post';
	const params = !data ? null : new URLSearchParams(data);
	
	return new Promise((resolve, reject) => {
		target.forEach(element => {
			$fb.fetchReq({
				uri: uri,
				method: requestType,
				data: params,
				dataType: dataType,
				beforeSend: beforeSend,
				onError: err => {
					console.error(`${err.status} HTTP error: ${err.statusText} for ${requestType.toUpperCase()} request from URL: ${err.url}`)
					if (overlay)
						if ($el(overlay).getCssValue('display').toString().toLowerCase() !== 'none')
							$el(overlay).fadeout({callback: () => $el('body').classListRemove('overlay-shown')}).touchCssValue({display: 'none'});
					reject(err);
				},
				onSuccess: (data) => {
					element.insertHTML(!selector ? data : new XMLSerializer().serializeToString(new DOMParser().parseFromString(data.responseText, "text/html").querySelector(selector)));
					typeof callback === 'function' && callback();
					resolve({response: data.responseText, status: data.status});
				}
			});
		});
	});
}

/**
 * Check if the target element has a scrollbar in the given direction.
 *
 * Default direction is vertical.
 *
 * @param direction {string}
 * @returns {boolean|Error}
 */
Object.prototype.hasScrollBar = function (direction = 'vertical') {
	const target = ((this.constructor.name.toUpperCase() === 'NODELIST' || this.constructor.name.toUpperCase() === 'S')
		? Array.from(this) : (Array.isArray(this) ? this : [this]))[0];
	let scrollType = direction === 'vertical' ? 'scrollHeight' : 'scrollWidth',
		clientType = scrollType === 'scrollHeight' ? 'clientHeight' : 'clientWidth';
	
	return !!direction ?
		(direction === 'vertical' || direction === 'horizontal' ?
			target[scrollType] > target[clientType] :
			new Error(`Specified direction [${direction}] does not meet required arguments: 'vertical' or 'horizontal'`)) :
		new Error('Scroll direction not specified!');
}

/**
 * Create a new instance of Fusion Form Validator using the target element.
 *
 * @param form_group {string|selector}
 * @returns {FBFormValidate}
 */
Object.prototype.FBValidator = function (form_group) {
	const target = ((this.constructor.name.toUpperCase() === 'NODELIST' || this.constructor.name.toUpperCase() === 'S')
		? Array.from(this) : (Array.isArray(this) ? this : [this]));
	return new FBFormValidate(target, form_group);
}


// Misc Functions.
window.$fb = {
	/**
	 * Perform a fetch request using the [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API).
	 *
	 * @param uri
	 * @param method
	 * @param data
	 * @param dataType
	 * @param beforeSend
	 * @param onComplete
	 * @param onSuccess
	 * @param onError
	 */
	/*fetchReq({uri = '', method = 'get', data = null, dataType = 'json', beforeSend, onComplete, onSuccess, onError}) {
		const allowedErrorStatuses = new Set([401, 402, 422, 423, 426, 451, 511]);
		let status,
			statusText,
			responseData;
		typeof beforeSend === 'function' && beforeSend();
		
		fetch(uri, {
			method: method,
			body: data,
		}).then(response => {
			responseData = response;
			status = responseData.status;
			statusText = responseData.statusText;
			
			try {
				const consumed = response[dataType]();
				return (response.ok || status > 299 && status < 400 || allowedErrorStatuses.has(status)) ? consumed : Promise.reject(response);
			} catch (e) {
				console.error(e)
			}
		}).then(data => {
			responseData.responseText = $fb.canParseJSON(data) ? data : JSON.stringify(data);
			responseData.responseJSON = dataType === 'json' ? ($fb.canParseJSON(data) ? JSON.parse(data) : data) : null
			
			status > 199 && status < 300 && typeof onSuccess === 'function' && onSuccess(responseData, status, statusText)
			typeof onComplete === 'function' && onComplete(responseData, status, statusText);
		}).catch(err => (typeof onError === 'function') && onError(err, status, statusText));
	},*/
	/**
	 * Toggle the disabled state (property) of button.
	 *
	 * Also toggle the button loader if available.
	 *
	 * @param buttonElement
	 * @param processIsDone {boolean}
	 */
	/*toggleButtonState(buttonElement, processIsDone = false) {
		const target = ((buttonElement.constructor.name.toUpperCase() === 'NODELIST' || buttonElement.constructor.name.toUpperCase() === 'S')
			? Array.from(buttonElement) : (Array.isArray(buttonElement) ? buttonElement : [buttonElement]))[0];
		const buttonLoaderElement = $el(buttonLoader, target);
		if (target) {
			console.log((target.property('disabled')))
			if (!target.property('disabled') || (target.attribute('disabled') && target.attribute('disabled').toLowerCase() !== 'disabled') && !processIsDone) {
				buttonLoaderElement.length && buttonLoaderElement.touchCssValue({opacity: 0, display: 'inline-flex'}).fadein({timeout: 800});
				target.disable();
			}
			
			if (processIsDone) {
				buttonLoaderElement.length && buttonLoaderElement.fadeout({timeout: 800, toggleDisplay: true});
				target.disable(false);
			}
		}
	},*/
	/**
	 * Manipulate the buttons state.
	 *
	 * (**N.B:** ***Depends on the toggleButtonState() function***).
	 *
	 * @param form
	 * @param processIsDone
	 */
	/*manipulateButton(form, processIsDone = false) {
		const target = ((form.constructor.name.toUpperCase() === 'NODELIST' || form.constructor.name.toUpperCase() === 'S')
			? Array.from(form) : (Array.isArray(form) ? form : [form]))[0];
		const submitButton = $el('button[type="submit"]', target).length ? $el('button[type="submit"]', target) : $el(`button[form="${target.id}"]`);
		this.toggleButtonState(submitButton, processIsDone);
	},*/
	/**
	 * Returns true if the string is a JSON string and can be parsed to a JSON Object.
	 *
	 * Returns false otherwise.
	 *
	 * @param JSONString
	 * @returns {boolean}
	 */
	/*canParseJSON(JSONString) {
		try {
			JSON.parse(JSONString)
			return true
		} catch (e) {
			return false
		}
	}*/
}


/**
 * Creates a new instance of Bootstrap Alert on the given element.
 *
 * @param element
 * @returns {Alert}
 */
const newBsAlert = (element) => new bootstrap.Alert(element);

/**
 * Creates a new instance of Bootstrap Modal on the given element.
 *
 * @param element
 * @param options
 * @returns {Modal}
 */
const newBsModal = (element, options) => new bootstrap.Modal(element, options);

/**
 *
 * @param number {number|string}
 * @returns {string}
 */
window.formatNumber = (number) => number.toLocaleString('en-US', {minimumFractionDigits: 2});

/**
 *
 * @param show {NodeList|HTMLElement|[HTMLElement]}
 * @param hide {NodeList|HTMLElement|[HTMLElement]}
 * @param target {NodeList|HTMLElement|Object|Array}
 * @param showIcon {boolean}
 */
window.toggleValidationIcon = ({show, hide}, target, showIcon) => {
	if (showIcon) {
		hide.fadeout({timeout: 10});
		target.addValidationPadding();
		show.touchCssValue({right: valid_right}).fadein({timeout: 10, toggleDisplay: true});
	} else
		target.removeValidationPadding();
}

/**
 *
 * @param value {string}
 * @returns {string}
 */
window.spaceToComma = (value) => {
	return value.trim().split(/[ ,]+/g).filter((val) => {
		return val !== '';
	}).join(', ');
};

/**
 * Multiply the values using the CSS calc() function
 *
 * @param pad1 {number|string}
 * @param pad2 {number|string}
 * @returns {string}
 */
function multiplyPadding(pad1, pad2) {
	return `calc(${pad1} + ${pad2}px)`;
}

/**
 * Toggle Validation of the target element.
 *
 * @param element
 * @param target
 */
function checkValidate(element, target) {
	element[0].needsValidation() ?
		element.validate({context: target}) :
		element.removeValidationMessage({context: target, removeAlert: true});
}

/**
 * Remove all corresponding validation elements when the targets' validation alert is closed.
 *
 * @param context
 */
function onAlertClose(context) {
	$el('.alert').upon('close.bs.alert', function (e) {
		const target = e.currentTarget;
		const formElementId = target.dataset['alertId']
		context && (formElementId && formElementId.length) && $el(formElementId).removeValidationMessage({context: context});
	});
}

/**
 * Checks the validity of the Card Number (Payment Card) using Luhn's Algorithm.
 *
 * @param numberInput {number|string}
 * @returns {boolean}
 */
/*function checkLuhn(numberInput) {
	const sumDigit = (c) => (c < 10) ? c :
		sumDigit(Math.trunc(c / 10) + (c % 10));
	
	return numberInput.split('').reverse()
		.map(Number)
		.map((c, i) => i % 2 !== 0 ? sumDigit(c * 2) : c)
		.reduce((acc, v) => acc + v) % 10 === 0;
}*/

/**
 * Parse the input and return the boolean equivalent.
 *
 * @param value
 * @returns {boolean}
 */
function parseBool(value) {
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
 * Selects the given element either by selector, or object with an optional context.
 * @param selector
 * @param context
 * @returns {*[]|NodeListOf<*>|boolean}
 */
function $el(selector, context = null) {
	try {
		const _context = context && ((context.constructor.name.toUpperCase() === 'NODELIST' || context.constructor.name.toUpperCase() === 'S')
			? Array.from(context) : (Array.isArray(context) ? context : [context]))[0];
		
		if (selector.constructor.name.toUpperCase() === 'NODELIST' || selector.constructor.name.toUpperCase().includes('HTML')) {
			if (context) {
				const target = ((selector.constructor.name.toUpperCase() === 'NODELIST' || selector.constructor.name.toUpperCase() === 'S')
					? Array.from(selector) : (Array.isArray(selector) ? selector : [selector]));
				
				if (target.length) {
					let _target = target[0];
					
					if (target.length < 2) {
						const _selector = `#${_target.id}` || _target.tagName.toLowerCase();
						return _context.querySelectorAll(_selector);
					}
					
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
		/* Uncomment for debugging purposes only. */
		// console.error(error);
		return false;
	}
}

const handler = {
	/**
	 * Handle incoming EventListener event from the upon() function.
	 *
	 * @param evt
	 * @param prefix
	 * @param callback
	 * @returns {false}
	 */
	/*handleEvent({evt, prefix, callback}) {
		const handler = `${prefix}${evt.type}`;
		return typeof this[handler] === 'function' && this[handler](evt, callback);
	},*/
	/**
	 * Custom event from the handler.
	 *
	 * @param event
	 * @param callback
	 */
	customEvent(event, callback) {
		typeof callback === 'function' && callback(event);
	},
	/**
	 * OnBlur Event
	 *
	 * @param element
	 * @param callback
	 */
	onblur(element, callback) {
		typeof callback === 'function' && this.customEvent(element, callback);
	},
	/**
	 * OnClick Event
	 *
	 * @param element
	 * @param callback
	 */
	onclick(element, callback) {
		typeof callback === 'function' && this.customEvent(element, callback);
	},
	/**
	 * OnFocus Event
	 *
	 * @param element
	 * @param callback
	 */
	onfocus(element, callback) {
		typeof callback === 'function' && this.customEvent(element, callback);
	},
	/**
	 * OnKeyup Event
	 *
	 * @param element
	 * @param callback
	 */
	onkeyup(element, callback) {
		typeof callback === 'function' && this.customEvent(element, callback);
	},
	/**
	 * OnKeydown Event
	 *
	 * @param element
	 * @param callback
	 */
	onkeydown(element, callback) {
		typeof callback === 'function' && this.customEvent(element, callback);
	},
	/**
	 * OnInput Event
	 *
	 * @param element
	 * @param callback
	 */
	oninput(element, callback) {
		typeof callback === 'function' && this.customEvent(element, callback);
	},
	/**
	 * OnMouseenter Event
	 *
	 * @param element
	 * @param callback
	 */
	onmouseenter(element, callback) {
		typeof callback === 'function' && this.customEvent(element, callback);
	},
	/**
	 * OnMouseleave Event
	 *
	 * @param element
	 * @param callback
	 */
	onmouseleave(element, callback) {
		typeof callback === 'function' && this.customEvent(element, callback);
	},
	/**
	 * OnChange Event
	 *
	 * @param element
	 * @param callback
	 */
	onchange(element, callback) {
		typeof callback === 'function' && this.customEvent(element, callback);
	},
	/**
	 * OnKeypress Event
	 *
	 * @param element
	 * @param callback
	 */
	onkeypress(element, callback) {
		typeof callback === 'function' && this.customEvent(element, callback);
	},
};
