# Fusion Form Validator and Utilities

> #### Form Validation plugin and fluent chainable DOM manipulation utility methods.

---

<br>

## Content

- [Installation - Getting started](#installation)
- [Installation - Note](#note)
- [Usage](#usage)
- [Utilities](#utilities)
- [Configuration Options](#available-config-options)
- [About](#about)
- [Creator](#creator)
- [Contributors](#contributors)
- [Acknowledgement](#acknowledgement)
- [Feedback](#feedback)
- [Contact](#contact)

<br>

## Installation

[Bootstrap](https://getbootstrap.com/) ^5.x, and [Fontawesome](https://fontawesome.com/) ^6.x are required.

No worries, the above requirements are shipped along with the Fusion Form Validator package; <br>
Simply head over to the [latest release page](https://github.com/Bien-Glitch/fusion.form.validator/releases/latest) and download the assets to stay up to date.

> ### Once the Fusion Utility asset has been downloaded:
>
> - The ***Fusion Utility*** can be found in the `src\js` folder.
> - The dependencies ***(Bootstrap & Fontawesome)*** can be found in the `plugins` folder.
> - Copy the files / folders in the `src` and `plugins` folder to wherever you like in the root of your Web-Project.


Assuming you copied them into plugins folder; the structure in your project should be somewhat like this:

```
.\Project-root
+-- \plugins*
|   +-- \fontawesome*
|   |   +-- \css
|   |   +-- \js
|   |   +-- \webfonts
|   |
|   +-- \bootstrap*
|   |   +-- \css
|   |   +-- \js
|   |
|   +-- \fb-validator-util*
|   |   +-- \css
|   |   +-- \fonts
|   |   +-- \js
|   |...
+-- index.html
|...
```

Now all that is left is to add them into your document as so:

```html
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>Fusion Form Util</title>
	
	<!-- [Stylesheets] -->
	<!-- Bootstrap CSS -->
	<link rel="stylesheet" href="plugins/bootstrap/css/bootstrap.css">
	
	<!-- Fontawesome -->
	<link rel="stylesheet" href="plugins/fontawesome/css/all.css">
	
	<!-- FB-ValidatorUtil CSS -->
	<link rel="stylesheet" href="plugins/fb-validator-util/css/fusion.form.util.css">
	
	<!--[ Scripts ]-->
	<!-- Bootstrap JS -->
	<script defer src="plugins/bootstrap/js/bootstrap.bundle.js"></script>
	
	<!-- FB-FValidatorUtil JS -->
	<script defer src="plugins/fb-validator-util/js/fusion.form.util.js"></script>
	<script defer src="plugins/fb-validator-util/js/init.js"></script>
</head>

<body>
	<!-- Your content goes here -->
</body>
</html>
```

> ### Note:
>
> #### To avoid errors:
>
> - As dependencies, the `bootstrap css` and `fontawesome css` must come before `fusion.form.util.css`.
> - The same goes for `bootstrap js` and `fontawesome js (if available)`; They should come before the `fusion.form.util.js`.

## Usage

*Firstly, ensure the stylesheets and scripts are linked in the correct hierarchy as in the above example. If you have problems getting it correctly, just copy the code in the example above and edit.*

Out of the box, Fusion Utility and Form Validator ships with `init.js` file, so you can initialize, configure, and using the Fusion Utility and Form Validator without messing up your other JS codes.<br>
**N.B:** _You can still use the validator in another JS file._

To initialize and configure the validator on a form, you need an `<FBUtil>` instance of the form.<br>
A utility function is available for getting the `<FBUtil>` instance of elements.

Built-in function `$fs(selector, context)` is used to select or fetch the element(s).

- The `selector` parameter selects the element(s) and it accepts either jQuery element Object, NodeList, HTML Element, HTML Collection, the elements tag name, or a CSS selector `eg. '#login-form'`; as an argument.
- The `context` parameter is an optional element context from which to select the element(s), jQuery element Object, NodeList, HTML Element, HTML Collection, the elements tag name, or a CSS selector as an argument.

### Initializing:

Previously, the form elements had to follow the below structure:
Assuming the form has id `login-form` i.e.

```html

<form action="" method="post" id="login-form">
	<div class="form-group">
		<div class="input-group align-items-stretch flex-nowrap">
			<!-- N.B. The form-label-group class below is only for floating label. It is not needed if floating label is not intended. -->
			<div class="form-label-group form-field-group required w-100">
				<input type="email" id="email" class="form-control" placeholder="E-Mail Address">
				<label for="email">E-Mail Address</label>
			</div>
		</div>
		<!--N.B. This div should be empty. Its 'id' should be set to the id of the input, textarea, or select element with Valid appended.-->
		<!-- e.g. if the input element id is email; this div should hav an id emailValid and class valid-text -->
		<div id="emailValid" class="valid-text"></div>
	</div>
	
	<div class="form-group">
		<div class="input-group align-items-stretch flex-nowrap">
			<!-- N.B. The form-label-group class below is only for floating label. It is not needed if floating label is not intended. -->
			<div class="form-label-group form-field-group required w-100">
				<input minlength="8" type="password" id="password" class="form-control" placeholder="Password">
				<label for="password">Password</label>
			</div>
		</div>
		<!-- N.B. This div should be empty. Its 'id' should be set to the id of the input, textarea, or select element with Valid appended. -->
		<!-- e.g. if the input element id is password; this div should hav an id passwordValid and class valid-text -->
		<div id="passwordValid" class="valid-text"></div>
	</div>
	
	<div class="form-group">
		<button type="submit" class="btn btn-sm btn-primary">
			Submit
			<!--<i class="ms-1 fa fa-1x fa-spin fa-spinner-third button-loader"></i>-->
		</button>
		
		<div class="form-message">
			<div class="waiting-text d-none">
				<i class="fa fa-1x fa-exclamation-circle text-danger"></i>
				<span class="text-primary">Please Wait...</span>
			</div>
			<div class="response-text small"></div>
		</div>
	</div>
</form>
```

Putting it all together we had:

```html
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>Title</title>
	
	<!-- [Stylesheets] -->
	<!-- Bootstrap -->
	<link rel="stylesheet" href="plugins/bootstrap/css/bootstrap.css">
	
	<!-- Fontawesome -->
	<link rel="stylesheet" href="plugins/fontawesome/css/all.css">
	
	<!-- FB-Formvalidator -->
	<link rel="stylesheet" href="plugins/fb-formvalidator/css/fusion.form.validator.css">
</head>

<body>
	<form action="" method="post" id="login-form">
		<div class="form-group">
			<div class="input-group align-items-stretch flex-nowrap">
				<!-- N.B. The form-label-group class below is only for floating label. It is not needed if floating label is not intended. -->
				<div class="form-label-group form-field-group required w-100">
					<input type="email" id="email" class="form-control" placeholder="E-Mail Address">
					<label for="email">E-Mail Address</label>
				</div>
			</div>
			<!--N.B. This div should be empty. Its 'id' should be set to the id of the input, textarea, or select element with Valid appended.-->
			<!-- e.g. if the input element id is email; this div should hav an id emailValid and class valid-text -->
			<div id="emailValid" class="valid-text"></div>
		</div>
		
		<div class="form-group">
			<div class="input-group align-items-stretch flex-nowrap">
				<!-- N.B. The form-label-group class below is only for floating label. It is not needed if floating label is not intended. -->
				<div class="form-label-group form-field-group required w-100">
					<input minlength="8" type="password" id="password" class="form-control" placeholder="Password">
					<label for="password">Password</label>
				</div>
			</div>
			<!-- N.B. This div should be empty. Its 'id' should be set to the id of the input, textarea, or select element with Valid appended. -->
			<!-- e.g. if the input element id is password; this div should hav an id passwordValid and class valid-text -->
			<div id="passwordValid" class="valid-text"></div>
		</div>
		
		<div class="form-group">
			<button type="submit" class="btn btn-sm btn-primary">
				Submit
				<!--<i class="ms-1 fa fa-1x fa-spin fa-spinner-third button-loader"></i>-->
			</button>
			
			<div class="form-message">
				<div class="waiting-text d-none">
					<i class="fa fa-1x fa-exclamation-circle text-danger"></i>
					<span class="text-primary">Please Wait...</span>
				</div>
				<div class="response-text small"></div>
			</div>
		</div>
	</form>
</body>

<!-- Bootstrap -->
<script src="plugins/bootstrap/js/bootstrap.bundle.js"></script>

<!-- FB-Formvalidator -->
<script src="plugins/fb-fomvalidator/js/fusion.form.util.js"></script>
<script src="plugins/fb-fomvalidator/js/fusion.form.validator.js"></script>
<script src="plugins/fb-fomvalidator/js/init.js"></script>
</html>
```

But we've made it easier, thus it is now:

```html

<form action="" method="post" id="login-form">
	<div class="form-group">
		<!-- N.B. Optionally if you have an icon to display beside the input add the icon class to it like this -->
		<i class="far fa-envelope icon"></i>
		<!-- N.B. All you need to put is you input and label -->
		<input type="email" id="email" class="form-control" placeholder="E-Mail Address">
		<label for="email">E-Mail Address</label>
	</div>
	
	<div class="form-group">
		<input minlength="8" type="password" id="password" class="form-control" placeholder="Password">
		<label for="password">Password</label>
	</div>
	
	<div class="mb-2">
		<button type="submit" class="btn btn-sm btn-primary">
			Submit
			<!--<i class="ms-1 fa fa-1x fa-spin fa-spinner-third button-loader"></i>-->
		</button>
		<div class="form-message"></div>
	</div>
</form>
```

Putting it all together we now have:

```html
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>Title</title>
	
	<!-- [Stylesheets] -->
	<!-- Bootstrap CSS -->
	<link rel="stylesheet" href="plugins/bootstrap/css/bootstrap.css">
	
	<!-- Fontawesome -->
	<link rel="stylesheet" href="plugins/fontawesome/css/all.css">
	
	<!-- FB-ValidatorUtil CSS -->
	<link rel="stylesheet" href="plugins/fb-validator-util/css/fusion.form.util.css">
	
	<!--[ Scripts ]-->
	<!-- Bootstrap JS -->
	<script defer src="plugins/bootstrap/js/bootstrap.bundle.js"></script>
	
	<!-- FB-FValidatorUtil JS -->
	<script defer src="plugins/fb-validator-util/js/fusion.form.util.js"></script>
	<script defer src="plugins/fb-validator-util/js/init.js"></script>
</head>

<body>
	<form action="" method="post" id="login-form">
		<div class="form-group">
			<!-- N.B. Optionally if you have an icon to display beside the input add the icon class to it like this -->
			<i class="far fa-envelope icon"></i>
			<!-- N.B. All you need to put is you input and label -->
			<input type="email" id="email" class="form-control" placeholder="E-Mail Address">
			<label for="email">E-Mail Address</label>
		</div>
		
		<div class="form-group">
			<input minlength="8" type="password" id="password" class="form-control" placeholder="Password">
			<label for="password">Password</label>
		</div>
		
		<div class="mb-2">
			<button type="submit" class="btn btn-sm btn-primary">
				Submit
				<!--<i class="ms-1 fa fa-1x fa-spin fa-spinner-third button-loader"></i>-->
			</button>
			<div class="form-message"></div>
		</div>
	</form>
</body>
</html>
```

#### Instantiating and initializing the validator (in your JS file):
Instantiating and initializing the validator has been made easier and more fluent with chainable methods.<br>
You can now do both and also perform an onSubmit event action all at once. An illustration is given below:

```javascript
// Instantiate the form:
const _loginForm = $fs('#login-form');

// Set config Options
// N.B. Config options can be passed by reference via variables, or can be passed directly as an anonymous object.
const loginFormConfig = {
	config: {
		showIcons: true,
		validateEmail: true,
		useDefaultStyling: true,
	}
};

// Inintialize the validator on the form with optional config options.
_loginForm.validator.initFormValidation(loginFormConfig).upon('submit', function (e) {
	e.preventDefault();
	/** Your On-Submission Logic goes here **/
	// Fusion Form Util could also manage your form submission Asynchronously. e.g:
	_loginForm.handleFormSubmit().then(resolve => console.log(resolve)).catch(error => console.log(error));
});
```

## Utilities

The Fusion Utility & Form Validator also provides you with Utilities (Functions & Methods) for manipulating DOM elements, handling events, AJAX requests, and other common web development tasks, thereby simplifying and streamlining your development process.
<p>Each of these functions and methods have specific functionalities and are outlined in this section of the documentation.</p>

> ### Utility Functions:
> 
> - ### `$fs(selector, context)`: 
>   This function creates a new FBUtil object with a selected element (i.e. Selects the element and wraps it in the FBUtil Wrapper for manipulation with available methods).<br> 
>   It takes two parameters:
>   - `selector (required)`: It can be a string, an iterable object, or an object. It represents the HTML string or iterable used to select the element.
>   - `context (optional)`: It can be a string, an iterable object, an object, or null. It represents the element context to select from. If not provided, the context is set to null.
>
>   <br> 
>   If the element is found, the function returns a new FBUtil object that wraps the selected element; otherwise, It returns an empty object.
>
>   ```javascript
>    // Usage example:
>    $fs('#login-form'); //
>   ```
>   
> <br>
>
> - ### `isFunction(value)`:
>   This function checks whether the given value is a function.<br> 
>   It takes one parameter:
>   - `value (required)`: It represents the value that needs to be checked if it is a function.
>
>   <br> 
>   It returns a boolean value indicating whether the given value is a function. If the value is a function, it returns true; otherwise, it returns false.
>
>   ```javascript
>    // Usage example:
>    const myFunc = () => console.log('My Function');
>   
>    console.log(isFunction(myFunc)); // Logs `true` to the console
>   ```
>   
> <br>
>
> - ### `isString(value)`:
>   This function checks whether the given value is a string.<br> 
>   It takes one parameter:
>   - `value (required)`: It represents the value that needs to be checked if it is a string.
>
>   <br> 
>   It returns a boolean value indicating whether the given value is a string. If the value is a string, it returns true; otherwise, it returns false.
>
>   ```javascript
>    // Usage example:
>    const name = 'John Doe';
>   
>    console.log(isString(name)); // Logs `true` to the console
>   ```
>   
> <br>
>
> - ### `isObject(value)`:
>   This function checks whether the given value is an object.<br> 
>   It takes one parameter:
>   - `value (required)`: It represents the value that needs to be checked if it is an object.
>
>   <br> 
>   It returns a boolean value indicating whether the given value is an object. If the value is an object, it returns true; otherwise, it returns false.
>
>   ```javascript
>    // Usage example:
>    const user_details = {
>        name: 'John Doe',
>        email: 'johndoe@gmail.com',
>        phone: '+234 805 000 0000'
>    };
>   
>    console.log(isObject(user_details)); // Logs `true` to the console
>   ```
>   
> <br>
>
> - ### `formatNumber(number)`:
>   This function formats a given number to two decimal places.<br> 
>   It takes one parameter:
>   - `number (required)`: It represents the number that needs to be formatted.
>
>   <br> 
>   It returns the formatted number as a string.
>
>   ```javascript
>    // Usage example:
>    const num = formatNumber(2);
>   
>    console.log(num); // Logs `2.00` to the console
>   ```
>   
> <br>
>
> - ### `checkLuhn(input)`:
>   This function checks if a given input string passes the Luhn algorithm validation; The Luhn algorithm is commonly used to validate credit card numbers and other identification numbers.<br> 
>   It takes one parameter:
>   - `input (required)`: It represents the input string to be checked using the Luhn algorithm.
>
>   <br> 
>   It returns a boolean value indicating whether the given input passes the Luhn Algorithm validation. If it passes, it returns true; otherwise, it returns false.
>
>   ```javascript
>    // Usage example:
>    const cardNumber = '452619383218234';
>    const cardNumberIsValid = checkLuhn(cardNumber);
>   
>    console.log(cardNumberIsValid); // Logs `true` to the console if the input is valid; otherwise it logs `false`
>   ```
>   
> <br>
>
> - ### `parseBool(value)`:
>   This function parses a given value as a boolean.<br> 
>   It takes one parameter:
>   - `value (required)`: It represents the value that needs to be parsed as a boolean.
>
>   <br> 
>   It returns the boolean value.
>
>   ```javascript
>    // Usage example:
>    const bool = parseBool('yes');
>   
>    console.log(bool); // Logs `true` to the console
>   ```
>   
> <br>
>
> - ### `spaceToComma(value)`:
>   This function converts spaces to commas in a given string.<br> 
>   It takes one parameter:
>   - `value (required)`: It represents the string in which spaces should be converted to commas.
>
>   <br> 
>   It returns the resulting string with spaces converted to commas.
>
>   ```javascript
>    // Usage example:
>    const tagsInput = 'plugin validator fuse boss';
>    const tags = spaceToComma(tagsInput);
>   
>    console.log(tags); // Logs `plugin, validator, fuse, boss` to the console
>   ```
>   
> <br>
>
> - ### `titleCase(value)`:
>   This function converts spaces to commas in a given string.<br> 
>   It takes two parameters:
>   - `value (required)`: It represents the string to be converted to Title Case.
>   - `regExpReplace (optional)`: It represents the regular expression used for string replacement. By default, it is set to `/[-_]/gi`, which matches hyphens and underscores.
>
>   <br> 
>   It returns the replaced string, which represents the converted string in Title Case.
>
>   ```javascript
>    // Usage example:
>    const word = 'convert-this_word';
>    const wordTitle = titleCase(word);
>   
>    console.log(wordTitle); // Logs `convertThisWord` to the console
>   ```
>   
> <br>
>
> - ### `canParseJSON(JSONString)`:
>   This function checks if a given string or Response object can be parsed as JSON.<br> 
>   It takes one parameters:
>   - `JSONString (required)`: It represents the string or Response object to be checked for JSON parsability.
>
>   <br> 
>   It returns a boolean value indicating whether the given string is valid JSON. If it is, it returns true; otherwise, it returns false.
>
>   ```javascript
>   // Usage example:
>    const jsonString = "[{word: 'parse me.'}]";
>    const isValidJSON = canParseJSON(jsonString);
>   
>    console.log(isValidJSON); // Logs `true` to the console
>   ```
> 
> <br>
>
> - ### `newBSAlert(element)`:
>   This function creates a new instance of a Bootstrap Modal on the given element with the provided options.<br> 
>   It takes two parameters:
>   - `element (required)`: It represents the element on which the Bootstrap Modal should be instantiated.
>   - `options (optional)`: It represents the options or configuration for the Bootstrap Modal. This parameter is an object containing various settings such as animation, backdrop behavior, etc. [Read More](https://getbootstrap.com/docs/5.2/components/modal/#via-javascript)
>
>   <br> 
>   It returns the newly created instance of the Modal class, allowing the user to interact with the Bootstrap Modal functionality.
>
>   ```javascript
>   // Usage example:
>    const modalElement = document.querySelector('#example-modal');
>    newBsModal(modalElement).show() // Manually opens the Modal
>   // Read the JS trigers section on the bootstrap site: https://getbootstrap.com/docs/5.2/components/modal/#via-javascript
>   ```
> 
> <br>
>
> - ### `newBSModal(element, options)`:
>   This function creates a new instance of a Bootstrap Alert on the given element.<br> 
>   It takes one parameters:
>   - `element (required)`: It represents the element on which the Bootstrap Alert should be instantiated.
>
>   <br> 
>   It returns the newly created instance of the Alert class, allowing the you to interact with the Bootstrap Alert functionality.
>
>   ```javascript
>   // Usage example:
>    const alertElement = document.querySelector('#alert-div');
>    newBsAlert(alertElement).close() // Dismisses the alert
>   // Read the JS trigers section on the bootstrap site: https://getbootstrap.com/docs/5.2/components/alerts/#javascript-behavior
>   ```
>   
> <br>
>
> - ### `fetchReq(JSONString)`:
>   This function performs a fetch request using the Fetch API. It provides a convenient way to make fetch requests with various options and callbacks.<br> 
>   It supports different HTTP methods, request data, response data types, and allows for the execution of custom functions before sending the request, after completion, on success, and on error.<br> 
>   It takes an Object as its parameter, which contains the following properties:
>   - `uri`: It represents the URI (Uniform Resource Identifier) or URL of the request.
>   - `method`: It specifies the HTTP method to be used for the request. The default value is `'get'`.
>   - `data`: It represents the data to be sent with the request. The default value is `null`.
>   - `dataType`: It specifies the type of data expected in the response. The default value is `'json'`.
>   - `beforeSend`: It is an optional function that can be executed before sending the request.
>   - `onSuccess`: It is an optional function that can be executed when the request is successful.
>   - `onError`: It is an optional function that can be executed when the request encounters an error.
>   - `onComplete`: It is an optional function that can be executed when the request is completed, regardless of success or failure.
>
>       <br>

>       - The `beforeSend` function is executed before the request is sent.
>       - The `onSuccess` function is executed if the response status code falls within the range `200-299`, or `401, 402, 422, 423, 426, 451, 511`, and the function is provided.
>       - The `onError` function is executed if the response status code falls outside the status codes specified in the `onSuccess` function above, and the function is provided.
>       - The `onComplete` function is executed once the request is completed, regardless of its success or error status.
>     
>       <br>

>       **N.B:** 
>       `onSuccess()`, `onError()`, and `onComplete()` has three arguments.<br> 
>       `onSuccess()` and `onComplete()` has :- `responseData`, `status`, and `statusText`, while;<br> 
>       `onError()` has :- `err`, `status`, and `statusText`.
>   
>       <br>

>       - The `responseData` argument returns the servers' `respond data` in whatever format is giving while sending the request.
>       - The `err` argument returns the `err` data if the server returns an error.
>       - The `status` argument returns the `HTTP status code` of the servers' response.
>       - The `statusText` argument returns the `HTTP status text` of the servers' response.
>     
>   ```javascript
>    // Usage example:
>    const openWeatherAPIKey = 'db38c9636975c743bbd8fec2a13b654f', city = 'Port-Harcourt';
>    fetchReq({
>    	uri: `https://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${openWeatherAPIKey}`,
>    	beforeSend: () => console.log(`Fetching Weather Report for ${city} city.`),
>    	onSuccess: (xhr, status, statusText) => console.log(xhr, status, statusText) // Logs the weather report response data, status and status text
>    });
>   ```

> ### Available Config Options:
>
> #### Regular Expressions `regExp` config options; For validating associated form fields using given Regular Expression.
>
>
> | Key          | Configurable Values | Default Value                                                | Description                                                                                         |
> | ------------ | ------------------- | ------------------------------------------------------------ | --------------------------------------------------------------------------------------------------- |
> | _name_       | **_RegExp string_** | `'/^([a-zA-Z]{2,255})(\s[a-zA-Z]{2,255}){1,2}$/gi'`          | RegExp string used to validate a`name` field <br> if `validateName` option is set to `true`         |
> | _username_   | **_RegExp string_** | `'/^[a-zA-Z]+([_]?[a-zA-Z]){2,255}$/gi'`                     | RegExp string used to validate a`username` field <br> if `validateUsername` option is set to `true` |
> | _email_      | **_RegExp string_** | `'/^\w+([.-]?\w+)*@\w+([.-]?\w{2,3})*(\.\w{2,3})$/gi'`       | RegExp string used to validate an`email` field <br> if `validateEmail` option is set to `true`      |
> | _phone_      | **_RegExp string_** | `'/^(\+\d{1,3}?\s)(\(\d{3}\)\s)?(\d+\s)*(\d{2,3}-?\d+)+$/g'` | RegExp string used to validate a`phone` field <br> if `validatePhone` option is set to `true`       |
> | _cardCVV_    | **_RegExp string_** | `'/[0-9]{3,4}$/gi'`                                          | RegExp string used to validate a`card cvv` field <br> if `validateCard` option is set to `true`     |
> | _cardNumber_ | **_RegExp string_** | `'/^[0-9]+$/gi'`                                             | RegExp string used to validate a`card number` field <br> if `validateCard` option is set to `true`  |
>
> These configuration options are accessible via the `regExp` sub Object and can be configured as follows:
>
> ```javascript
> config = {
>   regExp: {
>       name: 'value',
>       email: 'value',
>       phone: 'value',
>   }
> }
> ```
>
> <br>
>
> #### Validation Icons `icons` config options; Displayed validation icons.
>
>
> | Key                         | Configurable Values | Default Value                                          | Description                                                                      |
> | --------------------------- | ------------------- | ------------------------------------------------------ | -------------------------------------------------------------------------------- |
> | _validIcon_                 | **_HTML string_**   | `'<i class="fa far fa-1x fa-check"></i>'`              | HTML string to show valid icon (tick or check) when a field is correctly filled. |
> | _invalidIcon_               | **_HTML string_**   | `'<i class="fa far fa-1x fa-exclamation-circle"></i>'` | HTML string to show invalid icon (times or exclamation) when a field has error.  |
> | _passwordTogglerIcon_       | **_HTML string_**   | `'<i class="fa fa-eye"></i>'`                          | HTML string to show a toggler icon for the password field.                       |
> | _passwordCapslockAlertIcon_ | **_HTML string_**   | `'<i class="fa far fa-exclamation-triangle"></i>'`     | HTML string to show alert icon when Capslock state is true.                      |
>
> These configuration options are accessible via the `icons` sub Object and can configured as follows:
>
> ```javascript
> config = {
>   icons: {
>       validIcon: 'value',
>       invalidIcon: 'value',
>       passwordTogglerIcon: 'value',
>       passwordCapslockAlertIcon: 'value',
>   }
> }
> ```
>
> <br>
>
> #### Validation Texts `texts` config options; Displayed misc validation texts.
>
>
> | Key                   | Configurable Values | Default Value      | Description                                         |
> | --------------------- | ------------------- | ------------------ | --------------------------------------------------- |
> | _capslock_            | **_string_**        | `'Capslock is on'` | String to be displayed when CapsLock state is true. |
>
> These configuration options are accessible via the `texts` sub Object and can be configured as follows:
>
> ```javascript
> config = {
>   texts: {
>       capslock: 'value (e.g. Capslock)',
>   }
> }
> ```
>
> <br>
>
> #### Field Validation and validator `config` config options; For toggling validation state of form field elements and Base state of Validator.
>
>
> | Key                 | Configurable Values                  | Default Value             | Description                                                                                                                   |
> | ------------------- | ------------------------------------ |-------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
> | _showIcons_         | **_boolean <br> `true` or `false`_** | `true`                    | boolean to toggle showing the validation icons on the field elements.                                                         |
> | _showPassword_      | **_boolean <br> `true` or `false`_** | `true`                    | boolean to toggle showing the password type toggler icon.                                                                     |
> | _validateCard_      | **_boolean <br> `true` or `false`_** | `false`                   | boolean to toggle Card Number and CVV field validation.                                                                       |
> | _validateName_      | **_boolean <br> `true` or `false`_** | `false`                   | boolean to toggle Name field validation.                                                                                      |
> | _validateEmail_     | **_boolean <br> `true` or `false`_** | `false`                   | boolean to toggle Email field validation.                                                                                     |
> | _validatePhone_     | **_boolean <br> `true` or `false`_** | `false`                   | boolean to toggle Phone Number field validation.                                                                              |
> | _validatePassword_  | **_boolean <br> `true` or `false`_** | `true`                    | boolean to toggle Password field validation<br> (***Mostly used if there is a password confirmation field***).                |
> | _validateUsername_  | **_boolean <br> `true` or `false`_** | `false`                   | boolean to toggle Username field validation.                                                                                  |
> | _nativeValidation_  | **_boolean <br> `true` or `false`_** | `false`                   | boolean to toggle Native HTML Validation on the form.                                                                         |
> | _useDefaultStyling_ | **_boolean <br> `true` or `false`_** | `true`                    | boolean to toggle using the validators default styling for the fields. _Set to false if it interfares with your set styling._ |
> | _passwordId_        | **_string_**                         | `'password'`              | String that matches the`id` of the `password field`.                                                                          |
> | _passwordConfirmId_ | **_string_**                         | `'password_confirmation'` | String that matches the`id` of the `confirm password field`.                                                                  |
>
> These configuration options are accessible via the `config` sub Object and can be configured as follows:
>
> ```javascript
> config = {
>   config: {
>       showPassword: value,
>       validateName: value,
>       validateEmail: value,
>       validatePassword: value,
>       useDefaultStyling: value,
>       passwordConfirmId: 'value (e.g. confirm_password)'
>   }
> }
> ```

## About

Fusion Utility & Form Validator is an easy-to-use JS plugin for front-end form validation and miscellaneous utilities which requires little or no knowledge of JavaScript.<br>
The Fusion Utility & Form Validator is focused on providing utility functions for form validation, manipulating DOM elements, handling events, AJAX requests, and other common web development tasks.<br>
By incorporating this plugin into your projects, you simplify and streamline your development process; It offers an abstraction layer over standard JavaScript APIs, making it easier to perform common operations and tasks.
Read through this documentation on how to set it up, and you're ready to go. It's fun to use and hassle-free.

## Creator

<a href="https://github.com/Bien-Glitch" title="Bien Nwinate">
	<img alt="Bien Nwinate" title="Bien Nwinate" src="https://avatars.githubusercontent.com/u/51288549?s=96&v=4" style="border-radius: 50%;height: 45px;width: 45px;object-fit: cover">
</a>

- [Twitter](https://twitter.com/nwinate)
- [Linkedin](https://www.linkedin.com/in/nwinate-bien-609ab9175/)
- [Facebook](https://www.facebook.com/moses.bien)
- Team member:
	- [Loop DevOps LLC](https://github.com/officialLoopDevOps)
	- [ScaletFox ltd](https://github.com/scaletfoxltd)
	- [Vorldline Team](https://github.com/Vorldline)

## Contributors

<div style="display: flex;flex-wrap: wrap">
<div style="display: flex;flex-direction: column;padding: 5px">
	<a href="https://github.com/Ben-Chanan008" title="Great Ben">
		<img alt="Ben-Chanan" title="Great Ben" src="https://avatars.githubusercontent.com/u/119743454?v=4" style="border-radius: 50%;height: 45px;width: 45px;object-fit: cover">
	</a>
	<div style="display: flex;flex-direction: column">Team member:
		<ul>
			<li><a href="https://github.com/scaletfoxltd">ScaletFox ltd</a></li>
		</ul>
	</div>
</div>
</div>

## Acknowledgement

Thanks to God Almighty for making this project a possible. Also, a huge thanks to:

- [ScaletFox ltd](https://github.com/scaletfoxltd)
- [Great Ben](https://github.com/Ben-Chanan008)
- [Victor](https://github.com/echovick)
- [Omotayo](https://github.com/omotayosam)
- [Jacob](https://github.com/BojakePoleman)
- [Daniel](https://github.com/chigaemezu)
- And many others for their huge support

## Feedback

If you discover a vulnerability or bug within the Fusion Utility and Form Validator, or have an improvement,
Please [open an issue on the GitHub page](https://github.com/Bien-Glitch/fusion.form.validator/issues) or send an e-mail to Bien Nwinate via [fusionboltinc@gmail.com](mailto:fusionboltinc@gmail.com).
All issues will be promptly addressed.

## Contact

- E-Mail: [fusionboltinc@gmail.com](mailto:fusionboltinc@gmail.com)
- Whatsapp DM: +234 815 744 9189
