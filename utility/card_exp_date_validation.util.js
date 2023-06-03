// Validate expiry date of credit card
let validate_exp_date = (exp_date) => {
    // Split the expiry date into month and year components
    const [month, year] = exp_date.split('/');

    // Convert month and year strings to numbers
    const expiryMonth = parseInt(month, 10);
    const expiryYear = parseInt(year, 10);

    // Get the current date
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear() % 100; // Extract the last two digits of the current year
    const currentMonth = currentDate.getMonth() + 1; // Note: January is month 0 in JavaScript

    // Validate the expiry date
    if (
        Number.isInteger(expiryMonth) &&
        Number.isInteger(expiryYear) &&
        expiryMonth >= 1 &&
        expiryMonth <= 12 &&
        expiryYear >= currentYear &&
        (expiryYear > currentYear || expiryMonth >= currentMonth)
    ) {
        return { state: true, date: `${exp_date}` };
    } else {
        return { state: false };
    }
}
//---------------------------------------------

module.exports = validate_exp_date;