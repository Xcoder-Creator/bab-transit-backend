let regex_mastercard = /^(?:5[1-5][0-9]{2}|222[1-9]|22[3-9][0-9]|2[3-6][0-9]{2}|27[01][0-9]|2720)[0-9]{12}$/; // Regex for mastercard
let regex_visacard = /^4[0-9]{12}(?:[0-9]{3})?$/; // Regex for visa card

// Validate card number
let card_validation = (card_type_value, card_no) => {
    if (card_type_value === 'mastercard'){
        if (card_no.match(regex_mastercard)){
            return true;
        } else {
            return false;
        }
    } else if (card_type_value === 'visacard'){
        if (card_no.match(regex_visacard)){
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