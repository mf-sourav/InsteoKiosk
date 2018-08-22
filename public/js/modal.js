/**
 * file-config.js
 * Date Modified = 9/8/18
 * function
 * => controls the ctrl+A popup modal for changing the pin
 */
$(document).ready(function () {

    //initialize the modal
    var modal = document.getElementById('pinModal');
    //get pin
    var pin = "";
    // $.get("http://127.0.0.1:3000/getPin", function (data, status) {
    // 	pin = data;
    // });

    //function executes when modal submit button is clicked
    $('#modalButton').click(function () {
        var enteredPin = $('#modalOldPin').val();
        var enteredNewPin = $('#modalNewPin').val();
        checkEnteredPin(enteredPin);
        setTimeout(() => {
            if (pin == "true" && enteredNewPin != "" &&
                !enteredNewPin.length < 5) {
                //ajax call to get present 6 char url code
                $.get("http://127.0.0.1:3000/getCode", function (data, status) {
                    var oldUrl = data;
                    //ajax call to set pin & url of the user
                    $.post("/setPinPassword", {
                        url: oldUrl,
                        pin: enteredNewPin
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
                $('#modalMsg').html("please enter correct pin").css("color", "red");
                resetFields();
            }
        }, 100);

    });

    //after clicking submit clears the input fields
    function resetFields() {
        $('#oldPin').val('');
        $('#modalOldPin').val('');
        $('#modalNewPin').val('');
    }
    //checks if entered pin is correct or not
    function checkEnteredPin(args) {
        $.post("/checkPin", {
            PIN: args
        }, function (result) {
            pin = result;
        });
    }

    //checks if ctrl + A is pressed if so then it shows the modal
    $(document).keydown(function (event) {
        if (event.ctrlKey == true && event.keyCode == 65) {
            event.preventDefault();
            document.getElementById('pinModal').style.display = 'block';
            document.getElementById('pinModal').style.width = '100%';
        }
    });

    //when clicked on any region outside modal it closes the modal 
    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
});