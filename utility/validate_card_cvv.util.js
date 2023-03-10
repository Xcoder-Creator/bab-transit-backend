let validate_card_cvv = (cvv_no) => {
    let regex = new RegExp(/^[0-9]{3,4}$/);
 
    if (cvv_no === null) {
        return null;
    } else {
        if (regex.test(cvv_no) === true) {
            return true;
        } else {
            return false;
        }
    }
}

module.exports = validate_card_cvv;