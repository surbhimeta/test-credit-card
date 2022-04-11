/**
 * checkLuhn function is responsible to validate the credit card number
 * @param  {integer} input credit card number
 * @return {integer} credit card checksum
 */
function checkLuhn(input) {
    var sum = 0;
    var numdigits = input.length;
    var parity = numdigits % 2;
    for (var i = 0; i < numdigits; i++) {
        var digit = parseInt(input.charAt(i))
        if (i % 2 == parity) digit *= 2;
        if (digit > 9) digit -= 9;
        sum += digit;
    }
    return (sum % 10) == 0;
};

/**
 * detectCard function is responsible to detect the credit card type
 * @param  {integer} input credit card number
 * @return {Array} credit card type and length
 */
function detectCard(input) {
    var typeTest = 'invalid-card',
        ltest1 = 16,
        ltest2 = 16;
    if (/^4/.test(input)) {
        typeTest = 'visa';
        ltest1 = 13;
    } else if (/^5[1-5]/.test(input)) {
        typeTest = 'mastercard';
    } else if (/^3[4-7]/.test(input)) {
        typeTest = 'amex';
        ltest1 = 15;
        ltest2 = 15;
    } else if (/^6(011|4[4-9]|5)/.test(input)) {
        typeTest = 'discover';
    }
    return [typeTest, ltest1, ltest2];
}

/**
 * addCardError function is responsible to add the credit card error 
 */
function addCardError() {
    $('form.card-container').addClass('invalid-form');
    $('.error-message').empty().text('Please enter valid card number');
}


/**
 * removeCardError function is responsible to remove the credit card error 
 */
function removeCardError() {
    $('form.card-container').removeClass('invalid-form');
    $('.error-message').empty();
}

$('input.cc').keypress(function(e) {
    var keyCode = e.which;
    if (keyCode > 31 && (keyCode < 48 || keyCode > 57)) {
        e.preventDefault();
    }

});
$('input.cc').keyup(function(e) {
    var val = $.trim($(this).val());
    val = val.replace(/[^0-9]/g, '');
    var detected = detectCard(val);
    errorClass = '';
    var luhnCheck = checkLuhn(val);
    valueCheck = (val.length >= detected[1] || val.length <= detected[2]);
    console.log(luhnCheck)
    if (luhnCheck && valueCheck) {
        console.log(luhnCheck)
        errorClass = 'verified';
    } else if (valueCheck || val.length > detected[2]) {
        errorClass = 'error';
    }
    if (errorClass === 'error' || detected[0] === 'invalid-card') {
        addCardError();
    } else {
        removeCardError();
    }
    e.target.previousElementSibling.className = 'card-type ' + detected[0] + ' ' + errorClass;
    if (e.target.value == '') {
        e.target.previousElementSibling.className = 'card-type';
        e.target.nextElementSibling.className = 'card-valid';
        removeCardError();
        return
    }
    var val = $(this).val();
    var newval = '';
    val = val.replace(/\s/g, '');
    for (var i = 0; i < val.length; i++) {
        if (i % 4 == 0 && i > 0) newval = newval.concat(' ');
        newval = newval.concat(val[i]);
    }
    $(this).val(newval);
});

$(document).on('click', '.invalid-card', function() {
    $(".cc").val('');
    $(this).removeClass('invalid-card');
    removeCardError();
});