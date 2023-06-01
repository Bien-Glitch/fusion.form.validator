import {$fs, alert_d, alert_s, fa_check, fa_check_c, fa_check_d, fa_exc_c} from "./fusion.form.util.proposed.js";
import {fa_info, alert_i} from "./fusion.form.util.proposed.js";

const test = $fs('form');

const forms = test.validator.initFormValidation({
	config: {
		validateEmail: true
	}
})
test.upon('submit', function (e) {
	e.preventDefault();
	$fs(this).handleFormSubmit().then().catch(e);
});
$fs('#exampleModal').onBSModalLoad({backdrop: 'static'}, function (e) {
	console.log(e, this);
}).onBSModalClose();
/*document.querySelector('form').addEventListener('submit', function (e) {
	e.preventDefault();
	console.log(this)
})*/
// test.html.insert('hello').slideInUp()
// test.errors()
/*test.handleFormSubmit().then();*/
/*const h3 = $fs('h3')
console.log(h3, h3.siblings().children())*/
