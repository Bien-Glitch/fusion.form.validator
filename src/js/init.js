const _test = $fs('form'); // Select forms

// Init Validate Forms
_test.validator.initFormValidation({
	config: {
		validateEmail: true,
		showIcons: true,
		useDefaultStyling: false,
	}
});

_test.upon('submit', function (e) {
	e.preventDefault();
	_test.handleFormSubmit().then(value => console.log(value)).catch(error => console.log(error))
});
