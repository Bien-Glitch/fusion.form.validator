/*!
* Fusion Form Validator V1.1.0
* fusion.form.validator.js (https://github.com/Bien-Glitch/fusion.form.validator/tree/v1.1.0)
* Copyright 2023 Fusion Bolt inc.
*/

/**
 * ----------------------------------------------------------
 * Fusion Form Validator - Validator (v1.1.0):
 * ----------------------------------------------------------
 * (**Base-Component**)
 */
class FBBaseComponent {
	#_config;
	#_passwordCapslockWrapper;
	#_passwordTogglerWrapper;
	#_validIconWrapper;
	#_invalidIconWrapper;
	#_fbValidatorConfig = {
		regExp: {
			name: /^([a-zA-Z]{2,255})(\s[a-zA-Z]{2,255}){1,2}$/gi,
			username: /^[a-zA-Z]+([_]?[a-zA-Z]){2,255}$/gi,
			email: /^\w+([.-]?\w+)*@\w+([.-]?\w{2,3})*(\.\w{2,3})$/gi,
			phone: /^(\+\d{1,3}?\s)(\(\d{3}\)\s)?(\d+\s)*(\d{2,3}-?\d+)+$/g,
			cardCVV: /[0-9]{3,4}$/gi,
			cardNumber: /^[0-9]+$/gi,
		},
		validationIcons: {
			validIcon: '<i class="fa far fa-1x fa-check"></i>',
			invalidIcon: '<i class="fa far fa-1x fa-exclamation-circle"></i>',
			passwordToggleIcon: '<i class="fa fa-eye"></i>',
			passwordCapslockAlertIcon: '<i class="fa far fa-exclamation-triangle"></i>',
		},
		validationTexts: {
			capslock: 'Capslock is on',
		},
		validationConfig: {
			showPassword: true,
			validateCard: false,
			validateName: false,
			validateEmail: false,
			validatePhone: false,
			validatePassword: true,
			validateUsername: false,
			nativeValidation: false,
			passwordId: 'password',
			passwordConfirmId: 'password_confirmation',
		},
	}
	
	constructor(form, elementInstance) {
		this._form = (form.constructor.name.toUpperCase() === 'NODELIST' || form.constructor.name.toUpperCase() === 'S')
			? Array.from(form) : (Array.isArray(form) ? form : [form]);
		
		this._element = elementInstance;
		this.#_config = this.#_fbValidatorConfig;
		
		this.#_passwordTogglerWrapper = (icon) => `<a class="position-absolute text-muted toggle password-toggler-icon">${icon}</a>`;
		this.#_validIconWrapper = (icon) => `<small class="position-absolute text-success valid validation-icon">${icon}</small>`;
		this.#_invalidIconWrapper = (icon) => `<small class="position-absolute text-danger invalid validation-icon">${icon}</small>`;
		this.#_passwordCapslockWrapper = (icon, text) => `<div class="valid-text d-flex"><small class="bg-white shadow-sm text-danger capslock-alert p-1 m-auto">${icon} ${text}</small></div>`;
	}
	
	get baseElement() {
		return this._element
	};
	
	get formElement() {
		return this._form
	};
	
	get config() {
		return this.#_config;
	}
	
	get passwordCapslockAlert() {
		return this.#_passwordCapslockWrapper
	}
	
	get passwordToggler() {
		return this.#_passwordTogglerWrapper
	}
	
	get validIcon() {
		return this.#_validIconWrapper;
	}
	
	get invalidIcon() {
		return this.#_invalidIconWrapper;
	}
	
	set baseElement(element) {
		this._element = element
	}
	
	get DEFAULT_CONFIG() {
		return this.config;
	}
	
	static get VERSION() {
		return '1.1.0';
	}
}

/**
 * ----------------------------------------------------------
 * Fusion Form Validator (v1.1.0):
 * ----------------------------------------------------------
 * (**Validate Form**)
 */
class FBFormValidate extends FBBaseComponent {
	#_regExp;
	#_padding;
	#_validationConfig;
	#_validationIcons;
	#_validationTexts;
	#_passwordToggler;
	#_passwordCapslockAlert;
	#_invalidIcon;
	#_validIcon;
	
	constructor(form, elementInstance) {
		super(form, elementInstance);
		const _config = this.config;
		
		this.#_padding = {
			input: 2.5,
			input$sm: 3.5,
			select: 4,
			select$sm: 5.8,
			validDate: 3,
			validDate$sm: 3.8,
			validInput: 0.9,
			validInput$sm: 1.5,
			validSelect: 3,
			validSelect$sm: 3.8,
		};
		this.#_regExp = _config.regExp;
		this.#_validationConfig = _config.validationConfig;
		this.#_validationIcons = _config.validationIcons;
		this.#_validationTexts = _config.validationTexts;
		
		this.#_validIcon = this.validIcon;
		this.#_invalidIcon = this.invalidIcon;
		this.#_passwordToggler = this.passwordToggler;
		this.#_passwordCapslockAlert = this.passwordCapslockAlert;
	}
	
	touchConfig(options, config) {
		Object.keys(config).filter(option => config[option] = (option in options && options[option] !== '') ? (options[option]) : config[option]);
		return this;
	}
	
	initValidation() {
		if (this._form.length) {
			this._form.forEach((form, idx) => {
				let regExp = this.#_regExp,
					validationIcons = this.#_validationIcons,
					validationTexts = this.#_validationTexts,
					validationConfig = this.#_validationConfig,
					passwordTogglerWrapper = this.#_passwordToggler,
					passwordCapslockAlertWrapper = this.#_passwordCapslockAlert,
					invalidWrapper = this.#_invalidIcon,
					validWrapper = this.#_validIcon,
					context = `#${form.id} ${this._element}`;
				
				paddingMultipliers[form.id] = this.#_padding;
				errorBag[form.id] = {};
				errorCount[form.id] = 0;
				
				validationConfig.nativeValidation ? form.removeAttribute('novalidate') : form.setAttribute('novalidate', '');
				
				$el(context) && $el(context).forEach(target => {
					const selectElement = 'select';
					const textAreaElement = 'textarea';
					const selected = `${selectElement} > option:checked`;
					const inputElement = 'input:not(.bs-searchbox > input)';
					const element = `${inputElement}, ${textAreaElement}, ${selectElement}`;
					const toggler = '.password-toggler-icon';
					const capslockAlert = '.capslock-alert';
					let _selectElement = $el(selectElement, target),
						_textAreaElement = $el(textAreaElement, target),
						_selected = $el(selected, target),
						_inputElement = $el(inputElement, target),
						_element = $el(element, target),
						elementId = (_element[0] !== undefined) && _element[0].id,
						element_group = `#${elementId}_group`,
						requireRefill;
					
					target.nodeContains(_element[0]).length && target.setAttribute('id', `${elementId}_group`);
					_inputElement.length && _inputElement.attribute('type') === 'password' && _inputElement.HTMLAfter(passwordTogglerWrapper(validationIcons.passwordToggleIcon));
					$el(form_field_group, target).appendHTML(validWrapper(validationIcons.validIcon)).appendHTML(invalidWrapper(validationIcons.invalidIcon));
					(elementId.toString().toLowerCase().includes(validationConfig.passwordId) || $el(target).nodeContains($el(`#${validationConfig.passwordId}`)[0]).length) && $el(target).prependHTML(passwordCapslockAlertWrapper(validationIcons.passwordCapslockAlertIcon, validationTexts.capslock));
					
					_inputElement.upon({
						input: function (e) {
							const _input = e.currentTarget;
							const fbRole = _input.dataset['fbRole'] && _input.dataset['fbRole'].toLowerCase();
							const elementId = _input.attribute('id') && _input.id.toLowerCase();
							const elementType = _input.attribute('type') && _input.type.toLowerCase();
							// const isPasswordField
							
							const filterId = new Set(['name', 'username', 'card_cvv', 'card_number']);
							const filterType = new Set(['date', 'email', 'month', 'datetime', 'datetime-local']);
							
							if (_input.needsValidation()) {
								if (!filterType.has(elementType) && !filterType.has(fbRole) && !filterId.has(elementId))
									if (!_input.isPasswordField(validationConfig.passwordId))
										_inputElement.validate({context: target});
									else
										_input.isPasswordField(validationConfig.passwordId) && validatePassword();
								
								if (elementId.includes('name') || fbRole === 'name')
									if (validationConfig.validateName)
										_inputElement.nameValidate(regExp.name, target);
									else
										checkValidate(_inputElement, target)
								
								if (elementType === 'email' || fbRole === 'email')
									if (validationConfig.validateEmail)
										_inputElement.emailValidate(regExp.email, target);
									else
										checkValidate(_inputElement, target)
								
								if (_input.isPhoneField())
									if (validationConfig.validatePhone)
										_inputElement.phoneValidate(regExp.phone, target);
									else
										checkValidate(_inputElement, target);
								
								if (elementId.includes('username') || fbRole === 'username')
									if (validationConfig.validateUsername)
										_inputElement.usernameValidate(regExp.username, target);
									else
										checkValidate(_inputElement, target);
								
								if (elementId.includes('card_cvv') || fbRole === 'card_cvv')
									if (validationConfig.validateCard)
										_inputElement.cardCvvValidate(regExp.cardCVV, target);
									else
										checkValidate(_inputElement, target);
								
								if (elementId.includes('card_number') || fbRole === 'card_number')
									if (validationConfig.validateCard)
										_inputElement.cardNumberValidate(regExp.cardNumber, target);
									else
										checkValidate(_inputElement, target);
								
								(filterType.has(elementType) && elementType !== 'email') && _inputElement.validate({context: target});
							}
						},
						keyup: function (e) {
							const key = e.key.toLowerCase();
							const _toggler = $el(toggler, target);
							const _capslockAlert = $el(capslockAlert, target);
							const filterType = new Set(['date', 'month', 'datetime', 'datetime-local']);
							const capslockIsOn = e.getModifierState('CapsLock');
							(_inputElement[0].type && filterType.has(_inputElement[0].type.toLowerCase())) && _inputElement.validate({context: target});
							
							if (_capslockAlert.length)
								capslockIsOn ? _capslockAlert.fadein({timeout: 500, toggleDisplay: true, display: 'inline-block'}) : _capslockAlert.fadeout({timeout: 500, toggleDisplay: true});
							
							if (elementId && elementId.toLowerCase().includes(validationConfig.passwordId)) {
								if ($el(form_field_group, target).nodeContains(_toggler[0]).length) {
									if (validationConfig.showPassword) {
										if (requireRefill)
											if (!_inputElement[0].value.length) {
												_toggler.dataAttribute('refill', 'false');
												requireRefill = parseBool(_toggler.dataAttribute('refill'));
											}
										(!requireRefill && _inputElement[0].value.length) ?
											_toggler.touchCssValue({right: `${toggler_padding_right}px`}).fadein({toggleDisplay: true, timeout: 100}) :
											_toggler.fadeout({timeout: 100}).dataAttribute('refill', false);
									}
								}
							}
						},
						blur: function () {
							let _toggler = $el(toggler, target);
							
							if ($el(form_field_group, target).nodeContains(_toggler[0]).length)
								if ((elementId && elementId.toLowerCase().includes(validationConfig.passwordId)) && validationConfig.showPassword) {
									_toggler.mouseIsOver().then(isOver => {
										if (!isOver && _inputElement[0].value.length && _inputElement[0].type !== 'text') {
											toggler_padding_right = 0;
											_toggler.fadeout().dataAttribute('refill', true)
											requireRefill = parseBool(_toggler.dataAttribute('refill'));
										}
									});
								}
						},
					});
					_selectElement.upon('change', (e) => $el(e.currentTarget).needsValidation() && $el(e.currentTarget).validate({context: target}));
					_textAreaElement.upon('input', (e) => $el(e.currentTarget).needsValidation() && $el(e.currentTarget).validate({context: target}));
					
					const validatePassword = () => {
						if (validationConfig.validatePassword) {
							let config_passwordId = `#${validationConfig.passwordId}`,
								config_passwordConfirmId = `#${validationConfig.passwordConfirmId}`,
								_element_group = $el(element_group),
								_password = $el(config_passwordId, form),
								_password_group = $el(`${config_passwordId}_group`),
								_confirmPassword = $el(config_passwordConfirmId, form),
								_confirmPassword_group = $el(`${config_passwordConfirmId}_group`),
								minlength = _password[0] && _password[0].attribute('minlength'),
								maxlength = _password[0] && _password[0].attribute('maxlength');
							toggler_padding_right = !parseBool(requireRefill) ? $el(toggler, target)[0].getBoundingClientRect().width + 28 : 0;
							
							if (elementId !== validationConfig.passwordConfirmId)
								if (!!(minlength || maxlength)) {
									if ((!!minlength && _inputElement[0].value.length < minlength) || (!!maxlength && _inputElement[0].value.length > maxlength)) {
										if ($el(form_group, form).nodeContains(_confirmPassword[0]).length) {
											if (!!(minlength && maxlength)) {
												if (minlength === maxlength) {
													_inputElement.validate({context: target, message: `Password requires ${maxlength} characters.`});
													_confirmPassword.validate({context: _confirmPassword_group, isPassword: true});
												} else {
													//TODO: Check how to implement jQuery's 'parents()'
													_inputElement.validate({context: target, message: `Password must be between ${minlength} and ${maxlength} characters.`});
													_confirmPassword.validate({context: _confirmPassword_group, isPassword: true});
												}
											} else {
												if (!!minlength) {
													if (_inputElement[0].value.length < minlength) {
														_inputElement.validate({context: target, message: `Password requires a minimum of ${minlength} characters.`});
														_confirmPassword.validate({context: _confirmPassword_group, isPassword: true});
													} else {
														if (_inputElement[0].value !== _confirmPassword[0].value) {
															_inputElement.validate({context: target, message: `Passwords do not match.`, isPassword: true});
															_confirmPassword.validate({context: _confirmPassword_group, isPassword: true});
														} else {
															_inputElement.validate({context: target});
															_confirmPassword.validate({context: _confirmPassword_group});
														}
													}
												} else if (!!maxlength) {
													if (_inputElement[0].value.length > maxlength) {
														_inputElement.validate({context: _element_group, message: `Password requires a maximum of ${maxlength} characters.`});
														_confirmPassword.validate({context: _confirmPassword_group, isPassword: true});
													} else {
														if (_inputElement[0].value !== _confirmPassword[0].value) {
															_inputElement.validate({context: target, message: `Passwords do not match.`, isPassword: true});
															_confirmPassword.validate({context: _confirmPassword_group, isPassword: true});
														} else {
															_inputElement.validate({context: target});
															_confirmPassword.validate({context: _confirmPassword_group});
														}
													}
												} else {
													if (!!(_inputElement[0].value.length && _confirmPassword[0].value.length) && (_inputElement[0].value !== _confirmPassword[0].value)) {
														_inputElement.validate({context: target, message: `Passwords do not match.`, isPassword: true});
														_confirmPassword.validate({context: _confirmPassword_group, isPassword: true});
													} else {
														_inputElement.validate({context: target});
														_confirmPassword.validate({context: _confirmPassword_group});
													}
												}
											}
										} else {
											if (!!(minlength && maxlength)) {
												if ((!!minlength && _inputElement[0].value.length < minlength) || !!maxlength && _inputElement[0].value.length > maxlength)
													if (minlength === maxlength)
														_inputElement.validate({context: _element_group, message: `Password requires ${maxlength} characters.`});
													else
														_inputElement.validate({context: _element_group, message: `Password must be between ${minlength} and ${maxlength} characters.`});
												else
													_inputElement.validate({context: target});
											} else {
												if (!!minlength) {
													if (_inputElement[0].value.length < minlength)
														_inputElement.validate({context: _element_group, message: `Password requires a minimum of ${minlength} characters.`});
													else
														_inputElement.validate({context: target});
												} else if (!!maxlength) {
													if (_inputElement[0].value.length > maxlength)
														_inputElement.validate({context: _element_group, message: `Password requires a maximum of ${maxlength} characters.`});
													else
														_inputElement.validate({context: target});
												} else
													_inputElement.validate({context: target});
											}
										}
									} else {
										if ($el(form_group, form).nodeContains(_confirmPassword[0]).length) {
											if (_inputElement[0].value !== _confirmPassword[0].value) {
												_inputElement.validate({context: target, message: `Passwords do not match.`, isPassword: true});
												_confirmPassword.validate({context: _confirmPassword_group, isPassword: true});
											} else {
												_inputElement.validate({context: target});
												_confirmPassword.validate({context: _confirmPassword_group});
											}
										} else
											_inputElement.validate({context: target});
									}
								} else {
									if ($el(form_group, form).nodeContains(_confirmPassword[0]).length)
										if (!!(_inputElement[0].value.length && _confirmPassword[0].value.length) && (_inputElement[0].value !== _confirmPassword[0].value)) {
											_inputElement.validate({context: target, message: `Passwords do not match.`, isPassword: true});
											_confirmPassword.validate({context: _confirmPassword_group, isPassword: true});
										} else {
											_inputElement.validate({context: target});
											_confirmPassword.validate({context: _confirmPassword_group});
										}
									else
										_inputElement.validate({context: target});
								}
							else {
								if (!!(minlength || maxlength)) {
									if ((!!minlength && _password[0].value.length < minlength) || (!!maxlength && _password[0].value.length > maxlength)) {
										if (!!(minlength && maxlength)) {
											if (minlength === maxlength) {
												_inputElement.validate({context: target, isPassword: true});
												_password.validate({context: _password_group, message: `Password requires ${maxlength} characters.`});
											} else {
												_inputElement.validate({context: target, isPassword: true});
												_password.validate({context: _password_group, message: `Password must be between ${minlength} and ${maxlength} characters.`});
											}
										} else {
											if (!!minlength) {
												if (_password[0].value.length < minlength) {
													_inputElement.validate({context: target, isPassword: true});
													_password.validate({context: _password_group, message: `Password requires a minimum of ${minlength} characters.`});
												} else {
													if (_inputElement[0].value !== _password[0].value) {
														_inputElement.validate({context: target, isPassword: true});
														_password.validate({context: _password_group, message: `Passwords do not match.`, isPassword: true});
													} else {
														_inputElement.validate({context: target});
														_password.validate({context: _password_group});
													}
												}
											} else if (!!maxlength) {
												if (_password[0].value.length > maxlength) {
													_inputElement.validate({context: target, isPassword: true});
													_password.validate({context: _password_group, message: `Password requires a maximum of ${maxlength} characters.`});
												} else {
													if (_inputElement[0].value !== _password[0].value) {
														_inputElement.validate({context: target, isPassword: true});
														_password.validate({context: _password_group, message: `Passwords do not match.`, isPassword: true});
													} else {
														_inputElement.validate({context: target});
														_password.validate({context: _password_group});
													}
												}
											} else {
												if (!!(_inputElement[0].value.length && _password[0].value.length) && (_inputElement[0].value !== _password[0].value)) {
													_inputElement.validate({context: target, isPassword: true});
													_password.validate({context: _password_group, message: `Passwords do not match.`, isPassword: true});
												} else {
													_inputElement.validate({context: target});
													_password.validate({context: _password_group});
												}
											}
										}
									}
								} else {
									if (!_inputElement[0].value.length)
										_inputElement.validate({context: target});
									else if (!_password[0].value.length) {
										_inputElement.validate({context: target, isPassword: true});
										_password.validate({context: _password_group, message: 'The Password field is required', isPassword: true});
									} else {
										if (_inputElement[0].value !== _password[0].value) {
											_inputElement.validate({context: target, isPassword: true});
											_password.validate({context: _password_group, message: `Passwords do not match.`, isPassword: true});
										} else {
											_inputElement.validate({context: target});
											_password.validate({context: _password_group});
										}
									}
								}
							}
						} else
							_inputElement.validate({context: target});
					}
					
					if (_element.attribute('id')) {
						const elementType = _element.attribute('type') && _element.attribute('type').toLowerCase();
						const tagName = _element[0].tagName.toLowerCase();
						
						if (validationConfig.showPassword)
							$el(toggler, target).upon('click', function (e) {
								let currentTarget = e.currentTarget,
									_passwordField = currentTarget.previousSiblings('input');
								
								if (_passwordField.isPasswordField(validationConfig.passwordId)) {
									if (_passwordField.type && _passwordField.type.toLowerCase() === 'password') {
										_passwordField.setAttribute('type', 'text');
										$el('i', currentTarget).classListAdd('fa-eye-slash').classListRemove('fa-eye')
									} else {
										_passwordField.setAttribute('type', 'password');
										$el('i', currentTarget).classListAdd('fa-eye').classListRemove('fa-eye-slash');
									}
								}
								_passwordField.focus({preventScroll: false});
							});
						
						if (_element.needsValidation()) {
							if (tagName !== 'select') {
								if ((elementType !== 'checkbox' && !_element[0].value.length)) {
									errorCount[form.id]++
									errorBag[form.id][elementId] = 'This field is required.';
								}
							} else {
								if (!_selectElement[0].value) {
									errorCount[form.id]++
									errorBag[form.id][elementId] = 'Please select an option.';
								}
							}
						}
					}
				});
				
				form.upon('reset', (e) => {
					const currentTarget = e.currentTarget;
					$el('.alert', currentTarget).forEach(alert => newBsAlert(alert).close());
					$el('input, textarea, select', currentTarget).classListRemove('border-danger').classListRemove('border-success')
					$el('.validation-icon', currentTarget).fadeout();
				});
			});
			return this._form;
		} else
			console.warn(`Forms failed to load in document: ${this._form}`);
	}
	
	/**
	 * ----------------------------------------------------------
	 * Getters
	 *----------------------------------------------------------
	 */
	
	/**
	 * *Returns Padding configuration settings*
	 * @returns {*}
	 */
	get paddingMultipliers() {
		return this.#_padding;
	}
	
	/**
	 * *Returns Regular Expression configuration settings*
	 * @returns {*}
	 */
	get regExpConfig() {
		return this.#_regExp
	}
	
	/**
	 * *Returns Validation configuration settings*
	 * @returns {*}
	 */
	get validationConfig() {
		return this.#_validationConfig;
	}
	
	/**
	 * *Returns configuration settings for Validation Icons*
	 * @returns {*}
	 */
	get validationIcons() {
		return this.#_validationIcons;
	}
	
	get validationTexts() {
		return this.#_validationTexts;
	}
	
	
	/**
	 * ----------------------------------------------------------
	 * Setters
	 * ----------------------------------------------------------
	 */
	
	/**
	 * **Set Padding configuration**
	 *
	 * @param options
	 * @returns
	 */
	set paddingConfig(options) {
		const _options = (options && typeof options === 'object') ? options : this.#_padding;
		this.touchConfig(_options, this.#_padding);
		return this;
	}
	
	/**
	 * **Set Regular Expressions configuration**
	 *
	 * @param options
	 * @returns
	 */
	set regExpConfig(options) {
		let _options = (options && typeof options === 'object') ? options : this.#_regExp;
		this.touchConfig(_options, this.#_regExp);
		return this;
	}
	
	/**
	 * **Set Validation options configuration**
	 *
	 * @param options
	 * @returns
	 */
	set validationConfig(options) {
		let _options = (options && typeof options === 'object') ? options : this.#_validationConfig;
		this.touchConfig(_options, this.#_validationConfig);
		return this;
	}
	
	/**
	 * **Set Validation Icons configuration**
	 *
	 * @param options
	 * @returns
	 */
	set validationIcons(options) {
		let _options = (options && typeof options === 'object') ? options : this.#_validationIcons;
		this.touchConfig(_options, this.#_validationIcons);
		return this;
	}
	
	/**
	 * **Set Validation Texts configuration**
	 *
	 * @param options
	 * @returns
	 */
	set validationTexts(options) {
		let _options = (options && typeof options === 'object') ? options : this.#_validationTexts;
		this.touchConfig(_options, this.#_validationTexts);
		return this;
	}
	
	/**
	 * ***Returns the Original name of the Plugin.***
	 * @returns {string}
	 * @constructor
	 */
	static get NAME() {
		return 'FB-FormValidator';
	}
}
