// Mastercard: Starts with 51-55 and has a length of 16
var mastercardRegex = /^5[1-5]\d{2}(| |-)\d{4}\1\d{4}\1\d{4}$/;

// Visa: Starts with 4 and has a length of 13 or 16
var visaRegex = /^4\d{3}(?:\s?\d{4}){2}(?:\s?\d{4})$/;

// Validate card number
let card_validation = (card_type_value, card_no) => {
    if (card_type_value === 'mastercard'){
        if (mastercardRegex.test(card_no)){
            return true;
        } else {
            return false;
        }
    } else if (card_type_value === 'visacard'){
        if (visaRegex.test(card_no)){
            return true;
        } else {
            return false;
        }
    } else {
        return null;
    }
}
//----------------------------------

module.exports = card_validation;