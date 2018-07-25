/**
 * file-pin.js
 * function
 * =>changes pin & 6 character unique code
 * =>blocks user from entering code again after nth wrong attempts
 * =>controls the ctrl+A popup modal for changing the pin
 */
//init 
var restrictTimer = 0;
var wrongAttempts = 0;
var pinAllowed = true;

$(document).ready(function () {
	//initialize the modal
	var modal = document.getElementById('id01');
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
	//get pin stored in config.txt
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
			$('#pinError').hide();
			localStorage.setItem('restrictTimer', 0);
		}
	}, 1000);
	//method i called whenever pin is submited
	$('#submitPin').click(function () {
		if (pinAllowed) {
			if ($('#oldPin').val() == pin) {
				console.log("correct");
				$('#configForm').show();
				$('#pinVerificationForm').hide();
			} else {
				resetFields();
				$('#pinError').show();
				$('#pinError').html("Please enter correct pin");
				wrongAttempts++;
				console.log(wrongAttempts);
			}
			if (wrongAttempts == 4) {
				pinAllowed = false;
				$('#submitPin').prop('disabled', true);
				$('#oldPin').prop('disabled', true);
				$('#pinWarning').html("you can try again after 30 sec");
				$('#pinError').hide();
				localStorage.setItem('restrictTimer', 5);
				localStorage.setItem('pinAllowed', false);
				restrictTimer = 5;
			}
			if (wrongAttempts == 9) {
				pinAllowed = false;
				$('#submitPin').prop('disabled', true);
				$('#oldPin').prop('disabled', true);
				$('#pinWarning').html("you can try again after 1hr");
				$('#pinError').hide();
				localStorage.setItem('restrictTimer', 20);
				localStorage.setItem('pinAllowed', false);
				restrictTimer = 20;
			}
		}
	});
	$('#submitUrl').click(function () {
		if ($('#newPin').val() == "") {
			$('#newPin').val(pin);
		}
		$.post("/setPinPassword", {
			url: $('#newUrl').val(),
			pin: $('#newPin').val()
		}, function (result) {
			if (result == "success") {
				$('#submitUrlMsg').html("configuration updated successfully redirecting to index");
				setTimeout(function () {
					window.location = "http://127.0.0.1:3000/index";
				}, 3000);
			} else {
				$('#submitUrlMsg').html("configuration update failed");
			}
		});
		console.log($('#newUrl').val(), $('#newPin').val());
	});
	$(document).keydown(function (event) {
		if (event.ctrlKey == true && event.keyCode == 65) {
			event.preventDefault();
			document.getElementById('id01').style.display = 'block';
			document.getElementById('id01').style.width = '100%';
		}
	});
	$('#modalButton').click(function () {
		if ($('#modalOldPin').val() == pin && $('#modalNewPin').val() != "") {
			$.get("http://127.0.0.1:3000/getCode", function (data, status) {
				let oldUrl = data;
				$.post("/setPinPassword", {
					url: oldUrl,
					pin: $('#modalNewPin').val()
				}, function (result) {
					if (result == "success") {
						$('#modalMsg').html("Pin changed successfully").css("color", "green");
						resetFields();
					} else {
						$('#modalMsg').html("Error while changing pin").css("color", "red");
						resetFields();
					}
				});
			});
		} else {
			$('#modalMsg').html("Error while changing pin").css("color", "red");
			resetFields();
		}
	});

	function resetFields() {
		$('#oldPin').val('');
		$('#modalOldPin').val('');
		$('#modalNewPin').val('');
	}
	window.onclick = function (event) {
		if (event.target == modal) {
			modal.style.display = "none";
		}
	}

});