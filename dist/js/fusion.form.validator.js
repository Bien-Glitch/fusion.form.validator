class FBBaseComponent {
	#_config;
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
	
	get passwordToggler() {
		return this.#_passwordTogglerWrapper/*(this.#_config.validation_icons.togglePassword)*/;
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
	
	static get DEFAULT_CONFIG() {
		return this.prototype.config;
	}
	
	static get VERSION() {
		return version;
	}
}

class ValidateForm extends FBBaseComponent {
	#_regExp;
	#_padding;
	#_validationConfig;
	#_validationIcons;
	#_passwordToggler;
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
		
		this.#_validIcon = this.validIcon;
		this.#_invalidIcon = this.invalidIcon;
		this.#_passwordToggler = this.passwordToggler;
	}
	
	touchConfig(options, config) {
		const filtered = Object.keys(config).filter(option => config[option] = (option in options && options[option] !== '') && options[option]);
		config = (options === config) ? options : (filtered.length ? filtered : config);
		return this;
	}
	
	initValidation() {
		if (this._form.length) {
			this._form.forEach((form, idx) => {
				let regExp = this.#_regExp,
					validationIcons = this.#_validationIcons,
					validationConfig = this.#_validationConfig,
					passwordTogglerWrapper = this.#_passwordToggler,
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
					let _selectElement = $el(selectElement, target),
						_textAreaElement = $el(textAreaElement, target),
						_selected = $el(selected, target),
						_inputElement = $el(inputElement, target),
						_element = $el(element, target),
						elementId = (_element[0] !== undefined) && _element[0].id,
						requireRefill;
					
					
					target.nodeContains(_element[0]).length && target.setAttribute('id', `${elementId}_group`);
					_inputElement.length && _inputElement.attribute('type') === 'password' && _inputElement.HTMLAfter(passwordTogglerWrapper(validationIcons.passwordToggleIcon));
					$el(form_field_group, target).appendHTML(validWrapper(validationIcons.validIcon)).appendHTML(invalidWrapper(validationIcons.invalidIcon)); // TODO: changed from '.input-group' to form_field_group
					
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
									if (!_input.isPasswordField())
										_inputElement.validate({context: target});
									else
										_input.isPasswordField() && validatePassword();
								
								if (elementId.includes('name') || fbRole === 'name')
									if (validationConfig.validateName)
										_inputElement.nameValidate(regExp.name, target);
									else
										checkValidate(_inputElement, target)
								
								if (elementType === 'email' || fbRole === 'email')
									if (!validationConfig.validateEmail)
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
							}
						},
						keyup: function () {
							const _toggler = $el(toggler, target);
							const filterType = new Set(['date', 'month', 'datetime', 'datetime-local']);
							(_inputElement[0].type && filterType.has(_inputElement[0].type.toLowerCase())) && _inputElement.validate({context: target});
							
							if ($el(form_field_group, target).nodeContains(_toggler[0]).length)
								if (elementId && elementId.toLowerCase().includes('password') && validationConfig.showPassword) {
									if (requireRefill)
										if (!_inputElement[0].value.length) {
											_toggler.dataAttribute('refill', 'false');
											requireRefill = parseBool(_toggler.dataAttribute('refill'));
										}
									(!requireRefill && _inputElement[0].value.length) ?
										_toggler.touchCssValue({right: `${toggler_padding_right}px`}).fadein() :
										_toggler.fadeout().dataAttribute('refill', false);
								}
						},
						blur: function () {
							let _toggler = $el(toggler, target);
							
							if ($el(form_field_group, target).nodeContains(_toggler[0]).length)
								if ((elementId && elementId.toLowerCase().includes('password')) && validationConfig.showPassword) {
									_toggler.mouseIsOver().then(isOver => {
										if (!isOver && _inputElement[0].value.length && _inputElement[0].type !== 'text') {
											toggler_padding_right = 0;
											_toggler.fadeout().dataAttribute('refill', true)
											requireRefill = parseBool(_toggler.dataAttribute('refill'));
										}
									});
								}
						}
					});
					
					const validatePassword = () => {
						if (validationConfig.validatePassword) {
							let config_passwordId = `#${validationConfig.passwordId}`,
								config_passwordConfirmId = `#${validationConfig.passwordConfirmId}`,
								_password = $el(config_passwordId, form),
								_confirmPassword = $el(config_passwordConfirmId, form),
								minlength = _password[0] && _password[0].attribute('minlength'),
								maxlength = _password[0] && _password[0].attribute('maxlength');
							toggler_padding_right = !parseBool(requireRefill) ? $el(toggler, target)[0].getBoundingClientRect().width + 28 : 0;
							
							
							if (elementId !== validationConfig.passwordConfirmId)
								if (_inputElement[0].value.length < minlength || _inputElement[0].value.length > maxlength) {
									if ($el(form_group, form).nodeContains(_confirmPassword[0]).length) {
										//TODO: Check how to implement jQuery's 'parents()'
										_inputElement.validate({context: target, message: `Password must be between ${minlength} and ${maxlength} characters.`});
										_confirmPassword.validate({context: _confirmPassword[0].parentElement.parentElement, isPassword: true});
									} else
										_inputElement.validate({context: target});
								} else {
									if ($el(form_group, form).nodeContains(_confirmPassword[0]).length)
										if (_inputElement[0].value.length && _confirmPassword[0].value.length && _inputElement[0].value !== _confirmPassword[0].value) {
											_inputElement.validate({context: target, message: `Passwords do not match.`, isPassword: true});
											_confirmPassword.validate({context: _confirmPassword[0].parentElement.parentElement, isPassword: true});
										} else {
											_inputElement.validate({context: target});
											_confirmPassword.validate({context: _confirmPassword[0].parentElement.parentElement});
										}
									else
										_inputElement.validate({context: target});
								}
							else {
								if (!_password[0].value.length)
									_inputElement.validate({context: target, message: 'The Password field is required', isPassword: true});
								else {
									if (_password[0].value.length < minlength || _password[0].value.length > maxlength) {
										_inputElement.validate({context: target, isPassword: true});
										_password.validate({context: _password[0].parentElement.parentElement, message: `Password must be between ${minlength} and ${maxlength} characters.`});
									} else if (!_inputElement[0].value.length)
										_inputElement.validate({context: target});
									else if (_inputElement[0].value !== _password[0].value) {
										_inputElement.validate({context: target, isPassword: true});
										_password.validate({context: _password[0].parentElement.parentElement, message: `Passwords do not match.`, isPassword: true});
									} else {
										_inputElement.validate({context: target});
										_password.validate({context: _password[0].parentElement.parentElement});
									}
								}
							}
						} else
							_inputElement.validate({context: target});
					}
					
					if (validationConfig.showPassword)
						$el(toggler, target).upon('click', function (e) {
							let currentTarget = e.currentTarget,
								_passwordField = currentTarget.previousSiblings('input');
							
							if (_passwordField.isPasswordField())
								if (_passwordField.type && _passwordField.type.toLowerCase() === 'password') {
									_passwordField.setAttribute('type', 'text');
									$el('i', currentTarget).classListAdd('fa-eye-slash').classListRemove('fa-eye')
								} else {
									_passwordField.setAttribute('type', 'password');
									$el('i', currentTarget).classListAdd('fa-eye').classListRemove('fa-eye-slash');
								}
							_passwordField.focus({preventScroll: false});
						});
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
	
	/* * *Returns Padding configuration settings* * */
	get paddingMultipliers() {
		return this.#_padding;
	}
	
	/* * *Returns Regular Expression configuration settings* * */
	get regExpConfig() {
		return this.#_regExp
	}
	
	/* * *Returns Validation configuration settings* * */
	get validationConfig() {
		return this.#_validationConfig;
	}
	
	/* * *Returns configuration settings for Validation Icons* * */
	get validationIcons() {
		return this.#_validationIcons;
	}
	
	
	/**
	 * ----------------------------------------------------------
	 * Setters
	 * ----------------------------------------------------------
	 */
	
	/* Set Padding configuration */
	set paddingConfig(options) {
		const _options = (options && typeof options === 'object') ? options : this.#_padding;
		this.touchConfig(_options, this.#_padding);
		return this;
	}
	
	/* Set Regular Expression configuration */
	set regExpConfig(options) {
		let _options = (options && typeof options === 'object') ? options : this.#_regExp;
		this.touchConfig(_options, this.#_regExp);
		return this;
	}
	
	/* Set Validation configuration */
	set validationConfig(options) {
		let _options = (options && typeof options === 'object') ? options : this.#_validationConfig;
		this.touchConfig(_options, this.#_validationConfig);
		return this;
	}
	
	/* Set Validation Icons configuration */
	set validationIcons(options) {
		let _options = (options && typeof options === 'object') ? options : this.#_validationIcons;
		this.touchConfig(_options, this.#_validationIcons);
		return this;
	}
	
	static get NAME() {
		return 'Form Validator';
	}
}

$('#login-form').on('submit', function (e) {
	e.preventDefault();
	const form = e.currentTarget;
	form.fetchSubmit({
		uri: form.getAction(),
		method: form.attribute('method'),
		data: {action: 'login'},
	})
})
