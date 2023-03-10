// Validate expiry date of credit card
let validate_exp_date = (exMonth, exYear) => {
    var today, someday;
    var exMonth= exMonth;
    var exYear= exYear;
    today = new Date();
    someday = new Date();
    someday.setFullYear(exYear, exMonth, 1);

    if (someday < today) {
        return { state: false };
    } else {
        return { state: true, date: `${exMonth}/${exYear}` };
    }
}
//---------------------------------------------

module.exports = validate_exp_date;