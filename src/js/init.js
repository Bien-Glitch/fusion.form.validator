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

const openWeatherAPIKey = 'db38c9636975c743bbd8fec2a13b654f', city = 'Port-Harcourt'
fetchReq({
	uri: `https://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${openWeatherAPIKey}`,
	beforeSend: () => console.log(`Fetching Weather Report for ${city} city.`),
	onSuccess: (xhr, status, statusText) => console.log(xhr, status, statusText)
});
