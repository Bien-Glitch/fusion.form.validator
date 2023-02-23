# Fusion Form Validator and Utilities
> #### Form Validation plugin with fluent chainable utility methods.
---

<br>

## Content

- [Installation - Getting started](#installation)
- [Installation - Note](#note)
- [Usage](#usage)
- [Configuration Options](#available-config-options)
- [About](#about)
- [Creator](#creator)
- [Acknowledgement](#acknowledgement)
- [Feedback](#feedback)
- [Contact](#contact)

<br>

## Installation
[Bootstrap](https://getbootstrap.com/) ^5.x, and [Fontawesome](https://fontawesome.com/) ^6.x are required.

No worries, the above requirements are shipped along with the Fusion Form Validator package.\
Simply head over to the [latest release page](https://github.com/Bien-Glitch/fusion.form.validator/releases/latest) and download the assets to stay up to date.

> ### Once the Fusion Form Validator asset has been downloaded:
>  - The ***Fusion Form Validator*** can be found in the `src` folder.
>  - The dependencies ***(Bootstrap & Fontawesome)*** can be found in the `plugins` folder.
>  - Copy the files / folders in the `src` and `plugins` folder to wherever you like in the root of your Web-Project.

\
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
|   +-- \fb-formvalidator*
|   |   +-- \css
|   |   +-- \fonts
|   |   +-- \js
|   |...
+-- index.html
|...
```

\
Now all that is left is to add them into your document as so:

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
	<!-- Your content goes here -->
</body>

<!-- Bootstrap -->
<script src="plugins/bootstrap/js/bootstrap.bundle.js"></script>

<!-- FB-Formvalidator -->
<script src="plugins/fb-fomvalidator/js/fusion.form.util.js"></script>
<script src="plugins/fb-fomvalidator/js/fusion.form.validator.js"></script>
<script src="plugins/fb-fomvalidator/js/init.js"></script>
</html>
```

> ### Note:
> #### To avoid errors:
> - The `fusion.form.validator.css` must come after `bootstrap css`, and `fontawesome css`.
> - The same goes for the `fusion.form.validator.js`, it must come after `jQuery js (If available)`, `bootstrap js`, and `fusion.form.util.js`.

## Usage
*Firstly, ensure the stylesheets and scripts are linked in the correct hierarchy as in the above example. If you have problems getting it correctly, just copy the code in the example above and edit.*

Out of the box, Fusion Form Validator ships with `init.js` file, so you can initialize, configure, and use the fusion form validator without messing up your other JS codes.\
**N.B:** You can still use the validator in another JS file.

[comment]: <> (The Validator has already been initialized in `init.js` for all forms; with default configuration out of the box)

To initialize and configure the validator on a form, you need an instance of the form.\
A utility function is available for getting elements. Other methods could still be used too.

Built-in function `$el(selector)` can be used to fetch an element or fetch elements. The `selector` argument is either the elements tag name, or a CSS selector `eg. '#login-form'` as a string.
### Initializing:
The form elements must follow the below structure\
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

Putting it all together we would have:

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

\
Instantiating and initializing the validator (in your JS file):

```javascript
// Instantiate the Validator:

// Using Built-in function
const validator = $el('#login-form').FBValidator(form_group);

// Using jQuery
const validator = $('#login-form').FBValidator(form_group);

// Using Vanilla JS
const validator = document.querySelector('#login-form').FBValidator(form_group);
// or...
const validator = document.getElementById('login-form').FBValidator(form_group);


// Configure the validator: An Object (KeyValue Pair) of options. 
// Available config options in next section.
validator.validationConfig = {
	showPassword: true,
	validateEmail: true,
	validatePassword: true
}

validator.validationIcons = {
	validIcon: '<i class="fa fal fa-1x fa-check-circle"></i>',
	invalidIcon: '<i class="fa fal fa-1x fa-exclamation-circle"></i>'
}

// initialize the validator on the form.
validator.initValidation();
```

> ### Available Config Options:
> #### Regular Expressions `regExp` config options; For validating associated form fields using given Regular Expression.
>
> | Key          | Configurable Values     | Default Value                                                 | Description                                                                                                 |                                                
> | ------------ | ----------------------- | ------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |                                                
> | _name_       | **_RegExp string_**     | `'/^([a-zA-Z]{2,255})(\s[a-zA-Z]{2,255}){1,2}$/gi'`           | RegExp string used to validate a `name` field <br> if `validateName` option is set to `true`                |                                                
> | _username_   | **_RegExp string_**     | `'/^[a-zA-Z]+([_]?[a-zA-Z]){2,255}$/gi'`                      | RegExp string used to validate a `username` field <br> if `validateUsername` option is set to `true`        |                                                
> | _email_      | **_RegExp string_**     | `'/^\w+([.-]?\w+)*@\w+([.-]?\w{2,3})*(\.\w{2,3})$/gi'`        | RegExp string used to validate a `email` field <br> if `validateEmail` option is set to `true`              |                                                
> | _phone_      | **_RegExp string_**     | `'/^(\+\d{1,3}?\s)(\(\d{3}\)\s)?(\d+\s)*(\d{2,3}-?\d+)+$/g'`  | RegExp string used to validate a `phone` field <br> if `validatePhone` option is set to `true`              |                                                
> | _cardCVV_    | **_RegExp string_**     | `'/[0-9]{3,4}$/gi'`                                           | RegExp string used to validate a `card cvv` field <br> if `validateCard` option is set to `true`            |                                                 
> | _cardNumber_ | **_RegExp string_**     | `'/^[0-9]+$/gi'`                                              | RegExp string used to validate a `card number` field <br> if `validateCard` option is set to `true`         |                                                
>
> These configuration options are accessible via the `validator.regExpConfig` and can be set using the syntax:
> ```javascript
> validator.regExpConfig = {
>     name: 'value',
>     email: 'value',
>     phone: 'value',
> }
> ```
>
> <br>
>
> #### Validation Icons `validationIcons` config options; Displayed validation icons.
>
> | Key                   | Configurable Values     | Default Value                                               | Description                                                                                                 |                                                
> | --------------------- | ----------------------- | ----------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |                                                
> | _validIcon_           | **_HTML string_**       | `'<i class="fa far fa-1x fa-check"></i>'`                   | HTML string to show valid icon (tick or check) when a field is correctly filled.                            |                                                
> | _invalidIcon_         | **_HTML string_**       | `'<i class="fa far fa-1x fa-exclamation-circle"></i>'`      | HTML string to show invalid icon (times or exclamation) when a field has error.                             |                                                
> | _passwordTogglerIcon_ | **_HTML string_**       | `'<i class="fa fa-eye"></i>'`                               | HTML string to show a toggler icon for the password field.                                                  |                                                 
>
> These configuration options are accessible via the `validator.validationIcons` and can be set using the syntax:
> ```javascript
> validator.validationIcons = {
>     validIcon: 'value',
>     invalidIcon: 'value',
>     passwordTogglerIcon: 'value',
> }
> ```
>
> <br>
>
> #### Field Validation `validationConfig` config options; For toggling validation state of form field elements.
>
> | Key                   | Configurable Values                        | Default Value                     | Description                                                                                                      |                                                
> | --------------------- | ------------------------------------------ | --------------------------------- | ---------------------------------------------------------------------------------------------------------------- |                                                
> | _showPassword_        | **_boolean <br> `true` or `false`_**       | `true`                            | boolean to toggle showing the password type toggler icon.                                                        |                                                
> | _validateCard_        | **_boolean <br> `true` or `false`_**       | `false`                           | boolean to toggle Card Number and CVV field validation.                                                          |                                                
> | _validateName_        | **_boolean <br> `true` or `false`_**       | `false`                           | boolean to toggle Name field validation.                                                                         |                                                 
> | _validateEmail_       | **_boolean <br> `true` or `false`_**       | `false`                           | boolean to toggle Email field validation.                                                                        |                                                 
> | _validatePhone_       | **_boolean <br> `true` or `false`_**       | `false`                           | boolean to toggle Phone Number field validation.                                                                 |                                                 
> | _validatePassword_    | **_boolean <br> `true` or `false`_**       | `true`                            | boolean to toggle Password field validation <br> (***Mostly used if there is a password confirmation field***).  |                                                 
> | _validateUsername_    | **_boolean <br> `true` or `false`_**       | `false`                           | boolean to toggle Username field validation.                                                                     |                                                 
> | _nativeValidation_    | **_boolean <br> `true` or `false`_**       | `false`                           | boolean to toggle Native HTML Validation on the form.                                                            |                                                 
> | _passwordId_          | **_string_**                               | `'password'`                      | String that matches the `id` of the `password field`.                                                            |                                                 
> | _passwordConfirmId_   | **_string_**                               | `'password_confirmation'`         | String that matches the `id` of the `confirm password field`.                                                    |                                                 
>
> These configuration options are accessible via the `validator.validationConfig` and can be set using the syntax:
> ```javascript
> validator.validationConfig = {
>     showPassword: value,
>     validateName: value,
>     validateEmail: value,
>     validatePassword: value,
>     passwordConfirmId: 'value (e.g. confirm_password)'
> }
> ```

## About
Fusion form validator is an easy-to-use JS plugin for front-end form validation and miscellaneous utilities which requires little or no knowledge of JavaScript. Read through this documentation on how to set it up, and you're ready. It's fun to use and hassle-free.

## Creator
### [Bien Nwinate](https://github.com/Bien-Glitch)

- https://twitter.com/nwinate
- https://www.linkedin.com/in/nwinate-bien-609ab9175/
- https://www.facebook.com/moses.bien
- Team member:
	- [Loop DevOps LLC](https://github.com/officialLoopDevOps)
	- [ScaletFox ltd](https://github.com/scaletfoxltd)
	- [Vorldline Team](https://github.com/Vorldline)

## Acknowledgement
Thanks to God Almighty for making this project a possible.\
Also a huge thanks to:

- [ScaletFox ltd](https://github.com/scaletfoxltd)
- [Victor](https://github.com/echovick)
- [Omotayo](https://github.com/omotayosam)
- And many others for their huge support

## Feedback
If you discover a vulnerability or bug within the Fusion Form Validator, or have an improvement,\
Please [open an issue on the Github page](https://github.com/Bien-Glitch/fusion.form.validator/issues) or send an e-mail to Bien Nwinate via [fusionboltinc@gmail.com](mailto:fusionboltinc@gmail.com).\
All issues will be promptly addressed.

## Contact

- E-Mail: [fusionboltinc@gmail.com](mailto:fusionboltinc@gmail.com)
- Whatsapp DM: +234 815 744 9189
