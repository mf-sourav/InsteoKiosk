/**
 * file-config.js
 * Date Modified = 9/8/18
 * function
 * =>changes pin & 6 character unique url code
 * =>blocks user from entering code again after nth wrong attempts
 * =>controls the ctrl+A popup modal for changing the pin
 */
var restrictTimer = 0;
var wrongAttempts = 0;
var pinAllowed = true;
const restrictTimerInterval = 1000;
const redirectDelay = 3000;
$(document).ready(function () {
	//hide change pin & code form
	$('#configForm').hide();
	$('#pinError').hide();
	var pin = "";
	//for restrict timer
	//if restrict timer is null then set it to 0
	if (localStorage.getItem('restrictTimer') == null) {
		localStorage.setItem('restrictTimer', 0);
	} else {
		//if restrict timer available then get from localstorage
		restrictTimer = localStorage.getItem('restrictTimer');
		//if restrict timer val is > 0 then restrict user
		if (restrictTimer > 0) {
			$('#submitPin').prop('disabled', true);
			$('#oldPin').prop('disabled', true);
			$('#pinWarning').html("you can try again after sometime please wait...");
		}
	}
	//for checking if user has entered wrong pin
	if (localStorage.getItem('pinAllowed') == null) {
		localStorage.setItem('pinAllowed', true);
	} else {
		pinAllowed = localStorage.getItem('pinAllowed');
	}
	//get pin stored in config file
	$.get("http://127.0.0.1:3000/getPin", function (data, status) {
		pin = data;
	});
	//checks every second restrict timer value
	setInterval(function () {
		//if restricttimer > 0 then decrement every single second
		if (restrictTimer > 0) {
			restrictTimer--;
			$('#submitPin').prop('disabled', true);
			$('#oldPin').prop('disabled', true);
			$('#pinError').hide();
		}
		//if restricttimer = 0 allow user to enter pin
		if (restrictTimer == 0) {
			pinAllowed = true;
			$('#submitPin').prop('disabled', false);
			$('#oldPin').prop('disabled', false);
			$('#pinWarning').html("");
			localStorage.setItem('restrictTimer', 0);
		}
	}, restrictTimerInterval);
	//method is called whenever pin is submited
	$('#submitPin').click(function () {
		if (pinAllowed) {
			//entered correct pin
			if ($('#oldPin').val() == pin) {
				//hides pin entry form & shows configuration form
				$('#configForm').show();
				$('#pinVerificationForm').hide();
			} else {
				//entered wrong pin increase wrong attempts count
				//reset fields & show warning
				resetFields();
				errorPrompt();
				wrongAttempts++;
			}
			if (wrongAttempts == 4) {
				//entered wrong pin 5 times disabled the form fields for 5 secs
				disableFormInputs("you can try again after 30 secs", 5);
			}
			if (wrongAttempts == 9) {
				//entered wrong pin 10 times disabled the form fields for 30 secs
				disableFormInputs("you can try again after 1hr", 30);
				wrongAttempts = 0;
			}
		}
	});
	//method is called when user submits configuration form
	$('#submitUrl').click(function () {
		if ($('#newPin').val() == "") {
			$('#newPin').val(pin);
		}
		//ajax post request to send 6 character url code & pin
		$.post("/setPinPassword", {
			url: $('#newUrl').val(),
			pin: $('#newPin').val()
		}, function (result) {
			//if configuration successfully written
			if (result == "success") {
				$('#submitUrlMsg').html("configuration updated successfully redirecting to index");
				//redirects to index.html after 3 secs
				setTimeout(function () {
					window.location = "http://127.0.0.1:3000/index";
				}, redirectDelay);
			} else {
				//if fails show error
				$('#submitUrlMsg').html("configuration update failed");
			}
		});
	});

	//after n no of attempts disables input fields for specified time
	function disableFormInputs(msg, time) {
		pinAllowed = false;
		$('#submitPin').prop('disabled', true);
		$('#oldPin').prop('disabled', true);
		$('#pinWarning').html(msg);
		$('#pinError').hide();
		localStorage.setItem('restrictTimer', time);
		localStorage.setItem('pinAllowed', false);
		restrictTimer = time;
	}
	//for error prompt when wrong pin entered
	function errorPrompt() {
		$('#pinError').show();
		$('#pinError').html("Please enter correct pin");
		setTimeout(() => {
			$('#pinError').hide();
		}, 3000);
	}
});