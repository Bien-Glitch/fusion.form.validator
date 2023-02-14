let valid_right,
	padding_right,
	toggler_padding_right = 0,
	form_group = '.form-group',
	input_group = '.input-group',
	form_field_group = '.form-field-group',
	wait = '.waiting-text',
	_response = '.response-text',
	errorBag = {},
	errorCount = {},
	paddingMultipliers = {};


const newBsAlert = (element) => new bootstrap.Alert(element);
const newBsModal = (element, options) => new bootstrap.Modal(element, options);

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

const version = '1.0.0'


window.formatNumber = (number) => number.toLocaleString('en-US', {minimumFractionDigits: 2});

window.toggleValidationIcon = ({show, hide}, target, showIcon) => {
	if (showIcon) {
		hide.fadeout();
		show.touchCssValue({right: valid_right}).fadein();
		target.addValidationPadding();
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

window.toggleButtonLoader = (_button, processIsDone = false) => {
	let _buttonLoader = $el('.button-loader', _button);
	if (_button.length) {
		if (!_button.prop('disabled') && !processIsDone) {
			if (_button.has('.button-loader').length)
				_buttonLoader.fadein().touchCssValue({display: 'flex'});
			_button.disable();
		}
		
		if (processIsDone) {
			if (_button.nodeContains('.button-loader').length)
				_buttonLoader.fadeout().touchCssValue({display: 'none'});
			_button.disable(false);
		}
	}
};

window._manipulateButton = (form, button, processIsDone = false) => {
	let _button = (`#${$el(button).attribute('form')}` === form || form.id) ? $el(button) : $(button, form);
	toggleButtonLoader(_button, processIsDone);
};
/**
 *
 * @param form {HTMLFormElement | string}
 * @param data {Object | null}
 * @param button {string}
 * @param beforeSend {Function| null}
 * @param callback {Function | null}
 * @returns {Promise<{JSON: any, messageTag: any | JQuery | JQuery<HTMLElement>}>} A Promise with the JSON response object and the forms MessageTag Element
 */
window.submitPostXHR = function ({form, data = null, button, beforeSend = null, callback = null}) {
	let _formHasErrors = $el(form).hasErrors(),
		_messageTag = $el(form).messageTag();
	_messageTag.html($(form).waitText()).fadeIn();
	
	return new Promise(function (resolve, reject) {
		if (!_formHasErrors.count)
			$(form).ajaxSubmit({
				url: $(form).action(), method: 'POST', data: data, dataType: 'json', beforeSend: () => {
					if (typeof beforeSend === 'function')
						beforeSend();
					_manipulateButton(form, button);
				},
				timeout: 12000,
				error: (xhr) => {
					let response = xhr.responseJSON ?? xhr,
						status = response.status ?? xhr.status;
					_messageTag.insertHTML('');
					
					const allowedStatuses = new Set([201, 308, 422, 501]);
					
					if (!allowedStatuses.has(status)) {
						_messageTag.length && _messageTag.renderMessage(alert_d, fa_exc_c, 'An error has occurred, try again. Please contact us if this continues', null, form, true);
						alert('An error occurred please try again.');
						_manipulateButton(form, button, true);
					}
					reject(xhr);
				},
				complete: (xhr) => {
					let response = xhr.responseJSON,
						status = response.status ?? xhr.status;
					
					if (status > 199 && status < 300) {
						if (xhr.status === 308)
							_messageTag.renderMessage(alert_s, fa_check_c, response.message, null, form, false, true)
								.delay(2500).fadeOut(800, () => {
								window.history.pushState('Delevia', 'Delevia', response.redirect);
								location.href = response.redirect;
							});
						else {
							const messageTag = _messageTag.length ? _messageTag : _globalMessageTag;
							resolve({JSON: response, messageTag: messageTag});
						}
					} else {
						if (status === 308)
							_messageTag.displayMessage(alert_d, fa_exc_c, response.message, null, form, false, true)
								.delay(2500).fadeOut(800, () => {
								location.href = response.redirect;
							});
						else if (status === 501 || status === 422) {
							if (_messageTag.length)
								if (!!response.errors)
									$(form).displayValidationErrors(response.errors, response.message);
								else
									_messageTag.renderMessage(alert_d, fa_exc_c, response.message, null, form, true);
						} else if (status === 419)
							location.href = routes.login;
						else
							alert('Server Failure');
						reject(xhr);
						
						if (status !== 308)
							_manipulateButton(form, button, true);
					}
				}
			});
		else {
			$el(form).displayValidationErrors(_formHasErrors.errors, 'Given data is invalid.');
			reject();
		}
		
		typeof callback === 'function' && callback();
	});
}

Object.defineProperties(Object.prototype, {
	validate: {
		value: function ({context, message = null, isPassword = false, isError = false} = {}) {
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
					validationIconRight = leftPadding,
					horizontalPadding = `${((elementId.toLowerCase() === 'password' && _toggler_padding_right) ? ((_leftPadding * 2) + _toggler_padding_right) : _leftPadding * 2) + _leftPadding}px`,
					minLength = tagName !== 'select' && target.attribute('minlength'),
					customMessage = minLength ? (!message && target[0].value.length < minLength ? `This field requires a minimum of ${minLength} characters.` : message) : (!message && isPassword ? 'Check Passwords.' : message);
				
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
				onAlertClose();
				return target;
			}
			return [];
		}, enumerable: false
	},
	needsValidation: {
		value: function () {
			return this ? (!!this.dataset['fbValidate'] ? parseBool(this.dataset['fbValidate']) : true) : false;
		}, enumerable: false
	},
	touchCssValue: {
		value: function (keyValuePair) {
			if (Object.keys(keyValuePair).length)
				Object.keys(keyValuePair).forEach(key => this.forEach(element => element.style[key] = keyValuePair[key]));
			return this;
		}, enumerable: false
	},
	getCssValue: {
		value: function (property) {
			return this ? (this.cssProperty().getPropertyValue(property)) : undefined;
		}, enumerable: false
	},
	cssProperty: {
		value: function () {
			return window.getComputedStyle(this[0]);
		}, enumerable: false
	},
	classListAdd: {
		value: function (className) {
			const target = (this.constructor.name.toUpperCase() === 'NODELIST' || this.constructor.name.toUpperCase() === 'S')
				? Array.from(this) : (Array.isArray(this) ? this : [this]);
			target.forEach(element => element.classList.add(className));
			return this;
		}, enumerable: false
	},
	classListRemove: {
		value: function (className) {
			const target = (this.constructor.name.toUpperCase() === 'NODELIST' || this.constructor.name.toUpperCase() === 'S')
				? Array.from(this) : (Array.isArray(this) ? this : [this]);
			target.forEach(element => /*console.log(element)*/element.classList.remove(className));
			return this;
		}, enumerable: false
	},
	includesClass: {
		value: function (className) {
			return this ? (this[0].classList.contains(className)) : undefined;
		}, enumerable: false
	},
	addValidationPadding: {
		value: function () {
			this[0].type.toLowerCase() !== 'date' && this.touchCssValue({paddingRight: padding_right});
			return this;
		}, enumerable: false
	},
	removeValidationPadding: {
		value: function () {
			this[0].type.toLowerCase();
			this[0].attribute('type').toLowerCase() !== 'date' && this.touchCssValue({paddingRight: this.getCssValue('padding-left')});
			return this;
		}, enumerable: false
	},
	nodeContains: {
		value: function (element) {
			const data = [];
			const contains = [];
			const target = (this.constructor.name.toUpperCase() === 'NODELIST' || this.constructor.name.toUpperCase() === 'S')
				? Array.from(this) : (Array.isArray(this) ? this : [this]);
			
			target.forEach(group => data.push(group.innerHTML.trim()));
			!!element ? data.some(group => group.includes(element.outerHTML) && contains.push(element)) : contains.push();
			return contains;
		}, enumerable: false
	},
	previousSiblings: {
		value: function (selector) {
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
		}, enumerable: false
	},
	siblings: {
		value: function () {
			const target = (this.constructor.name.toUpperCase() === 'NODELIST' || this.constructor.name.toUpperCase() === 'S')
				? Array.from(this) : (Array.isArray(this) ? this : [this]);
			if (target[0].parentNode === null) return [];
			return [...target[0].parentNode.children].filter(child => {
				return child !== target[0];
			});
		}, enumerable: false
	},
	selectorMatches: {
		value: function (selector) {
			const target = (this.constructor.name.toUpperCase() === 'NODELIST' || this.constructor.name.toUpperCase() === 'S')
				? Array.from(this) : (Array.isArray(this) ? this : [this]);
			return (target[0].matches || target[0].matchesSelector || target[0].msMatchesSelector || target[0].mozMatchesSelector || target[0].webkitMatchesSelector || target[0].oMatchesSelector).call(target[0], selector);
		}, enumerable: false
	},
	mouseIsOver: {
		value: async function () {
			const target = (this.constructor.name.toUpperCase() === 'NODELIST' || this.constructor.name.toUpperCase() === 'S')
				? Array.from(this) : (Array.isArray(this) ? this : [this]);
			
			return new Promise(async resolve => {
				await target.forEach(element => {
					resolve(element.selectorMatches(':hover'))
				})
			});
		},
	},
	isPhoneField: {
		value: function () {
			const target = this;
			const fbRole = target.dataset['fbRole'] && target.dataset['fbRole'].toLowerCase();
			const elementId = target.attribute('id') && target.id.toLowerCase();
			const elementType = target.attribute('type') && target.type.toLowerCase();
			return !!(elementType === 'tel' || fbRole === 'phone' || elementId.match(/phone/gi));
		}
	},
	isPasswordField: {
		value: function () {
			const target = this;
			const elementName = target.attribute('name') && target.name.toLowerCase();
			const elementType = target.attribute('type') && target.type.toLowerCase();
			return !!((elementType && elementType.toLowerCase() === 'password') || (elementName && elementName.toLowerCase().includes('password')));
		}
	},
	regExpValidate: {
		value: function ({regExp, context, message, customValidation} = {}) {
			if (this) {
				const target = this;
				
				typeof customValidation === 'function' ? customValidation() : (target[0].value.length ?
					(target[0].value.match(regExp) ? target.validate({context: context}) : target.validate({context: context, message: message, isError: true})) :
					checkValidate(target, context));
				return this;
			}
			return [];
		}, enumerable: false
	},
	emailValidate: {
		value: function (regExp, context) {
			return this ? this.regExpValidate({regExp: regExp, context: context, message: 'Please input a valid E-Mail Address format:<br> (eg. johndoe@mail.com)'}) : [];
		}, enumerable: false
	},
	nameValidate: {
		value: function (regExp, context) {
			return this ? this.regExpValidate({regExp: regExp, context: context, message: 'Please input a valid Name format:<br> (eg. John Doe, John Wood Doe)'}) : [];
		}, enumerable: false
	},
	phoneValidate: {
		value: function (regExp, context) {
			return this ? this.regExpValidate({regExp: regExp, context: context, message: 'Please input a valid Phone Number format:<br> (eg. +234 8076899243, +1 211 1041)'}) : [];
		}, enumerable: false
	},
	cardCvvValidate: {
		value: function (regExp, context) {
			return this ? this.regExpValidate({regExp: regExp, context: context, message: 'Please input a valid CVV'}) : [];
		}, enumerable: false
	},
	cardNumberValidate: {
		value: function (regExp, context) {
			return this ? this.regExpValidate({
				customValidation: () =>
					this[0].value.length ? (this[0].value.match(regExp) ? (checkLuhn(this[0].value) ? this.validate({context: context}) : this.validate({context: context, message: 'Please check card number and try again.', isError: true})) : this.validate({
						context: context,
						message: 'Only numbers are allowed.',
						isError: true
					})) : checkValidate(this, context)
			}) : [];
		}, enumerable: false
	},
	usernameValidate: {
		value: function (regExp, context) {
			return this ? this.regExpValidate({
				customValidation: () =>
					this[0].value.length ? (this[0].value.length > 2 ? (this[0].value.match(regExp) ? this.validate({context: context}) : this.validate({context: context, message: 'Please input a valid Username format:<br> (ie. Username must start and end with an alphabet, and must contain only alphabets, and underscore.)', isError: true})) : this.validate({
						context: context,
						message: 'Username must have a minimum of 3 characters.',
						isError: true
					})) : checkValidate(this, context)
			}) : [];
		}, enumerable: false
	},
	insertHTML: {
		value: function (value) {
			const target = (this.constructor.name.toUpperCase() === 'NODELIST' || this.constructor.name.toUpperCase() === 'S')
				? Array.from(this) : (Array.isArray(this) ? this : [this]);
			target.forEach(element => element.innerHTML = value);
			return this;
		}, enumerable: false
	},
	prependHTML: {
		value: function (value) {
			const target = (this.constructor.name.toUpperCase() === 'NODELIST' || this.constructor.name.toUpperCase() === 'S')
				? Array.from(this) : (Array.isArray(this) ? this : [this]);
			target.forEach(element => element.insertAdjacentHTML('afterbegin', value));
			return this;
		}, enumerable: false
	},
	appendHTML: {
		value: function (value) {
			const target = (this.constructor.name.toUpperCase() === 'NODELIST' || this.constructor.name.toUpperCase() === 'S')
				? Array.from(this) : (Array.isArray(this) ? this : [this]);
			target.forEach(element => element.insertAdjacentHTML('beforeend', value));
			return this;
		}, enumerable: false
	},
	HTMLBefore: {
		value: function (value) {
			const target = (this.constructor.name.toUpperCase() === 'NODELIST' || this.constructor.name.toUpperCase() === 'S')
				? Array.from(this) : (Array.isArray(this) ? this : [this]);
			target.forEach(element => element.insertAdjacentHTML('beforebegin', value));
			return this;
		}, enumerable: false
	},
	HTMLAfter: {
		value: function (value) {
			const target = (this.constructor.name.toUpperCase() === 'NODELIST' || this.constructor.name.toUpperCase() === 'S')
				? Array.from(this) : (Array.isArray(this) ? this : [this]);
			target.forEach(element => element.insertAdjacentHTML('afterend', value));
			return this;
		}, enumerable: false
	},
	fadein: {
		value: function ({timeout = 300, callback} = {}) {
			const target = (this.constructor.name.toUpperCase() === 'NODELIST' || this.constructor.name.toUpperCase() === 'S')
				? Array.from(this) : (Array.isArray(this) ? this : [this]);
			target.forEach(element => {
				let timeoutID = {},
					display = [element].getCssValue('display');
				
				element.style.opacity = '0';
				element.style.transition = `all ${timeout}ms`;
				
				const timeOutFunc = (callback) => {
					element.style.opacity = '1';
					// display === 'none' && ([element].touchCssValue({display: 'block'}));
					clearTimeout(timeoutID[element.id]);
					typeof callback === 'function' && callback()
				};
				
				timeoutID[element.id] = setTimeout(() => {
					timeOutFunc(callback);
				}, 0)
			});
			return this;
		}, enumerable: false
	},
	fadeout: {
		value: function ({timeout = 300, callback} = {}) {
			const target = (this.constructor.name.toUpperCase() === 'NODELIST' || this.constructor.name.toUpperCase() === 'S')
				? Array.from(this) : (Array.isArray(this) ? this : [this]);
			const timeOutFunc = (element, callback) => {
				let timeoutID = {},
					display = [element].getCssValue('display');
				
				element.style.opacity = '0';
				timeoutID[element.id] = setTimeout(() => {
					// display !== 'none' && ([element].touchCssValue({display: 'none'}));
					clearTimeout(timeoutID[element.id]);
				}, timeout);
				typeof callback === 'function' && callback()
			};
			
			target.forEach(element => {
				element.style.opacity = '1';
				element.style.transition = `all ${timeout}ms`;
				timeOutFunc(element, callback);
			});
			return this;
		}, enumerable: false
	},
	touchAttribute: {
		value: function (key, value) {
			const target = (this.constructor.name.toUpperCase() === 'NODELIST' || this.constructor.name.toUpperCase() === 'S')
				? Array.from(this) : (Array.isArray(this) ? this : [this]);
			target.forEach(element => element.setAttribute(key, value));
			return this;
		}, enumerable: false
	},
	attribute: {
		value: function (key, value) {
			const target = (this.constructor.name.toUpperCase() === 'NODELIST' || this.constructor.name.toUpperCase() === 'S')
				? Array.from(this) : (Array.isArray(this) ? this : [this]);
			return value ? target.touchAttribute(key, value) : target[0].getAttribute(key);
		}, enumerable: false
	},
	touchDataAttribute: {
		value: function (key, value) {
			const target = (this.constructor.name.toUpperCase() === 'NODELIST' || this.constructor.name.toUpperCase() === 'S')
				? Array.from(this) : (Array.isArray(this) ? this : [this]);
			target.forEach(element => element.dataset[key] = value);
			// target[0].dataset[key] = value;
			return this;
		}, enumerable: false
	},
	dataAttribute: {
		value: function (key, value) {
			const target = (this.constructor.name.toUpperCase() === 'NODELIST' || this.constructor.name.toUpperCase() === 'S')
				? Array.from(this) : (Array.isArray(this) ? this : [this]);
			return value ? target.touchDataAttribute(key, value) : target[0].dataset[key];
		}, enumerable: false
	},
	upon: {
		value: function (events, callback, option = false) {
			const target = (this.constructor.name.toUpperCase() === 'NODELIST' || this.constructor.name.toUpperCase() === 'S')
				? Array.from(this) : (Array.isArray(this) ? this : [this]);
			target.forEach(element => {
				if (typeof events === 'object') {
					Object.keys(events).filter(evt => {
						element.addEventListener(evt, (e) => handler.handleEvent({evt: e, prefix: 'on', callback: events[evt]}), option);
					})
				} else
					typeof callback === 'function' ? element.addEventListener(events, (e) => callback(e), option) : console.error('Listener undefined');
			});
			return this;
		}, enumerable: false
	},
	renderMessage: {
		value: function (bsAlert, faIcon, message, id, context = null, dismissible = false, wait = false) {
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
		}, enumerable: false
	},
	hasErrors: {
		value: function () {
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
		}, enumerable: false
	},
	displayValidationErrors: {
		value: function (errors, message, callback) {
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
		}, enumerable: false
	},
	removeValidationMessage: {
		value: function ({context, removeAlert = false, destroyValidation = false} = {}) {
			const target = this;
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
				// TODO: Check for proper way to close BS Alert
				$el(`#${validationFieldId} > .alert`, context).forEach(field => newBsAlert(field).close());
			target.classListRemove('border-danger').classListRemove('border-success');
			
			return target
		}, enumerable: false
	},
	showError: {
		value: function ({context, message, showIcon = true} = {}) {
			if (this) {
				const target = this;
				const validationProps = target.getValidationProps();
				let customMessage = message ?? 'This field is required.';
				errorBag[target[0].form.id][target[0].id] = customMessage;
				toggleValidationIcon({show: validationProps.invalidIcon, hide: validationProps.validIcon}, target, showIcon);
				
				customMessage ? validationProps.validationField.renderMessage(alert_d, fa_exc_c, customMessage, validationProps.id, context, true) : validationProps.validationField.insertHTML(null);
				target.classListRemove('border-success').classListAdd('border-danger');
				errorCount[target[0].form.id] = Object.keys(errorBag[target[0].form.id]).length;
				return this;
			}
			return [];
		}, enumerable: false
	},
	showSuccess: {
		value: function ({context, message, showIcon = true} = {}) {
			if (this) {
				const target = this;
				const validationProps = target.getValidationProps();
				delete errorBag[target[0].form.id][target[0].id];
				errorCount[target[0].form.id] = Object.keys(errorBag[target[0].form.id]).length;
				toggleValidationIcon({show: validationProps.validIcon, hide: validationProps.invalidIcon}, target, showIcon);
				
				message ? validationProps.validationField.renderMessage(alert_s, fa_check, message, validationProps.id, context, true) : validationProps.validationField.insertHTML(null);
				target.classListRemove('border-danger').classListAdd('border-success');
				errorCount[target[0].form.id] = Object.keys(errorBag[target[0].form.id]).length;
				return this;
			}
			return [];
		}, enumerable: false
	},
	getValidationProps: {
		value: function () {
			if (this) {
				const target = this;
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
		}, enumerable: false
	},
	waitText: {
		value: function () {
			const target = (this.constructor.name.toUpperCase() === 'NODELIST' || this.constructor.name.toUpperCase() === 'S')
				? Array.from(this) : (Array.isArray(this) ? this : [this]);
			return $el(wait, target[0])[0].innerHTML;
		}, enumerable: false
	},
	messageTag: {
		value: function () {
			const target = (this.constructor.name.toUpperCase() === 'NODELIST' || this.constructor.name.toUpperCase() === 'S')
				? Array.from(this) : (Array.isArray(this) ? this : [this]);
			
			return $el(_response, target[0]);
		}, enumerable: false
	},
	/**
	 * Returns the value of the elements' action attribute or data-action attribute [Only returns the latter if the initial is unavailable]
	 *
	 * @returns {string|*}
	 */
	getAction: {
		value: function () {
			const target = (this.constructor.name.toUpperCase() === 'NODELIST' || this.constructor.name.toUpperCase() === 'S')
				? Array.from(this) : (Array.isArray(this) ? this : [this]);
			const tag = target[0].tagName.toLowerCase();
			return tag === 'form' ? (target[0].action ?? target[0].attribute('action')) : target[0].dataAttribute('action');
		}, enumerable: false
	},
	allElements: {
		value: function () {
			const target = Array.isArray(this) ? this[0] : this
			return ((target.tagName && target.tagName.toLowerCase() !== 'form') ? console.error(`function 'allElements()' expects 'form element' but '${target.tagName.toLowerCase()} element' was given`) : target.elements);
		}, enumerable: false
	},
	disable: {
		value: function (option = true) {
			const target = (this.constructor.name.toUpperCase() === 'NODELIST' || this.constructor.name.toUpperCase() === 'S')
				? Array.from(this) : (Array.isArray(this) ? this : [this]);
			target.forEach(element => {
				const elementTagName = element.tagName && element.tagName.toLowerCase();
				elementTagName !== 'a' ?
					option ? element.touchAttribute('disabled', 'disabled') : element.removeAttribute('disabled') :
					((!option) ? element.classListRemove('disabled') : element.classListAdd('disabled'));
			});
			return this;
		}, enumerable: false
	},
	onModalLoad: {
		/**
		 * Load the given modal with a callback.
		 * @param options
		 * @param callback
		 * @returns {Object.onModalLoad}
		 */
		value: function (options, callback) {
			this.upon('show.bs.modal', (e) => typeof callback === 'function' ? callback(e) : (typeof options === 'function' && options(e)));
			newBsModal(this[0], typeof options === 'object' ? options : null).show();
			return this;
		}
	},
	/**
	 * Dispose the given modal with a callback.
	 * @param callback
	 */
	onModalClose: {
		value: function (callback) {
			this.upon('hide.bs.modal', (e) => {
				typeof callback === 'function' && callback(e)
				newBsModal(this[0]).hide();
			});
		}, enumerable: false
	},
	/*fetchSubmit: {
		value: function ({uri = '', method = 'get', data = null, dataType = 'json', onSuccess, onError}) {
			const target = (this.constructor.name.toUpperCase() === 'NODELIST' || this.constructor.name.toUpperCase() === 'S')
				? Array.from(this) : (Array.isArray(this) ? this : [this]);
			/!*let status,
				statusText,
				responseData;*!/
			
			target.forEach(function (element) {
				if (element.tagName.toLowerCase() === 'form') {
					const formData = new FormData(element);
					const messageTag = $el(element).messageTag();
					const form = {
						hasErrors: !!$el(element).hasErrors().count,
						errors: $el(element).hasErrors().errors
					}
					data && Object.keys(data).length && Object.keys(data).forEach(key => formData.append(key, data[key]));
					
					!form.hasErrors ? $fb.fetchReq({
						uri: uri,
						method: method,
						data: formData,
						dataType: dataType,
						beforeSend: () => messageTag.insertHTML($el(element).waitText()).fadein(),
						onError: (err, status, statusText) => console.log(err, status, statusText),
						onComplete: xhr => {
							let response = xhr.responseJSON,
								status = xhr.status;
							
							console.log(xhr);
						},
					}) : $el(element).displayValidationErrors(form.errors, 'Given Data is invalid');
				}
			});
		}, enumerable: false
	},*/
	loadPageData: {
		value: async function ({uri, selector = null, data = null, overlay = null, dataType = 'text', slug = 'Page', beforeSend, callback}) {
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
									$el(overlay).fadeout({callback: () => $('body').classListRemove('overlay-shown')}).touchCssValue({display: 'none'});
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
	},
	hasScrollBar: {
		value: function (direction = 'vertical') {
			const target = ((this.constructor.name.toUpperCase() === 'NODELIST' || this.constructor.name.toUpperCase() === 'S')
				? Array.from(this) : (Array.isArray(this) ? this : [this]))[0];
			let scrollType = direction === 'vertical' ? 'scrollHeight' : 'scrollWidth',
				clientType = scrollType === 'scrollHeight' ? 'clientHeight' : 'clientWidth';
			
			return !!direction ?
				(direction === 'vertical' || direction === 'horizontal' ?
					target[scrollType] > target[clientType] :
					new Error(`Specified direction [${direction}] does not meet required arguments: 'vertical' or 'horizontal'`)) :
				new Error('Scroll direction not specified!');
		}, enumerable: false
	},
});

/**
 * Selects the given element either by selector, or object with an optional context
 * @param selector
 * @param context
 * @returns {*[]|NodeListOf<*>|boolean}
 */
function $el(selector, context) {
	
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

const $fb = {
	fetchReq({uri = '', method = 'get', data = null, dataType = 'json', beforeSend, onComplete, onSuccess, onError}) {
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
			
			return (response.ok || status > 299 && status < 400 || allowedErrorStatuses.has(status)) ? response[dataType]() : Promise.reject(response);
		}).then(data => {
			responseData.responseText = data;
			responseData.responseJSON = dataType === 'json' ? JSON.parse(data) : null;
			status > 199 && status < 300 && typeof onSuccess === 'function' && onSuccess(responseData, status, statusText)
			typeof onComplete === 'function' && onComplete(responseData, status, statusText);
		}).catch(err => typeof onError === 'function' && onError(err, status, statusText));
	}
}

function multiplyPadding(pad1, pad2) {
	return `calc(${pad1} + ${pad2}px)`;
}

function checkValidate(element, target) {
	element[0].needsValidation() ?
		element.validate({context: target}) :
		element.removeValidationMessage({context: target, removeAlert: true});
}

function onAlertClose(context) {
	$el('.alert').upon('close.bs.alert', function (e) {
		const target = e.currentTarget;
		const formElementId = target.dataset['alertId']
		formElementId && formElementId.length && $el(formElementId).removeValidationMessage({context: context});
	});
}

function checkLuhn(numberInput) {
	const sumDigit = (c) => (c < 10) ? c :
		sumDigit(Math.trunc(c / 10) + (c % 10));
	
	return numberInput.split('').reverse()
		.map(Number)
		.map((c, i) => i % 2 !== 0 ? sumDigit(c * 2) : c)
		.reduce((acc, v) => acc + v) % 10 === 0;
}

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

const handler = {
	handleEvent({evt, prefix, callback}) {
		const handler = `${prefix}${evt.type}`;
		return typeof this[handler] === 'function' && this[handler](evt, callback);
	},
	customEvent(event, callback) {
		typeof callback === 'function' && callback(event);
	},
	onblur(element, callback) {
		typeof callback === 'function' && this.customEvent(element, callback);
	},
	onclick(element, callback) {
		typeof callback === 'function' && this.customEvent(element, callback);
	},
	onfocus(element, callback) {
		typeof callback === 'function' && this.customEvent(element, callback);
	},
	onkeyup(element, callback) {
		typeof callback === 'function' && this.customEvent(element, callback);
	},
	onkeydown(element, callback) {
		typeof callback === 'function' && this.customEvent(element, callback);
	},
	oninput(element, callback) {
		typeof callback === 'function' && this.customEvent(element, callback);
	},
	onmouseenter(element, callback) {
		typeof callback === 'function' && this.customEvent(element, callback);
	},
	onmouseleave(element, callback) {
		typeof callback === 'function' && this.customEvent(element, callback);
	},
	onchange(element, callback) {
		typeof callback === 'function' && this.customEvent(element, callback);
	},
	onkeypress(element, callback) {
		typeof callback === 'function' && this.customEvent(element, callback);
	},
};
