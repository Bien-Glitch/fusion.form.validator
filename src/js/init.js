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

const validator = document.querySelector('#login-form').FBValidator(form_group);
validator.validationConfig = {
	validateEmail: true,
	validateName: true
}
validator.initValidation();
console.log(validator, validator.config)
