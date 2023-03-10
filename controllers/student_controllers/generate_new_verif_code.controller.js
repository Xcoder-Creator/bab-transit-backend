const db_query = require('../../models/db_model'); // Import db model
const sanitize_data = require('../../utility/sanitize_data.util'); // Import sanitize data
const response_headers = require('../../utility/response_headers.util'); // Import response headers
const generate_access_token = require('../../utility/generate_access_token.util'); // Import generate access token
const gen_code = require('../../utility/verification_code_gen.util');
const mail_service = require('../../utility/mail_service.util'); // Import mail service

const generate_new_verif_code = async (req, res) => {
    response_headers(res); // Response headers

    // Validate the request form body data
    if (req.body){
        let form_data = req.body; // Form data from the frontend

        // Check if the appropriate request parameters are set
        if (form_data.student_id){

            // Variables to hold form data individually and remove any quotes contained in them from left to right
            // and also remove leading and trailing whitespaces
            var student_id = parseInt(sanitize_data(form_data.student_id));
            //-------------------------------------------------------------------
            
            // Validate the data inputs from the form data
            if (student_id !== NaN){
                let result1 = await db_query.check_if_student_is_not_verified(student_id);

                if (result1.status === false){
                    res.statusCode = 400;
                    res.json({ err_msg: 'An error just occured, Try again later', result: null, succ_msg: null, res_code: 400 }); 
                } else if (result1.status === true){
                    if (result1.data.length > 0 && result1.data.length === 1){
                        let user_email = result1.data[0].student_email;
                        let user_name = result1.data[0].student_name;

                        let result2 = await db_query.delete_all_student_verification_codes(student_id);

                        if (result2.status === false){
                            res.statusCode = 400;
                            res.json({ err_msg: 'An error just occured, Try again later', result: null, succ_msg: null, res_code: 400 }); 
                        } else if (result2.status === true){
                            let verification_code = gen_code(6);

                            let verif_token = generate_access_token(student_id, 'verification_code', 300);

                            let result3 = await db_query.store_student_verification_code(student_id, verification_code, verif_token);

                            if (result3.status === false){
                                res.statusCode = 400;
                                res.json({ err_msg: 'An error just occured, Try again later', result: null, succ_msg: null, res_code: 400 });
                            } else if (result3.status === true){
                                mail_service('plain_mail', user_email, 'Account Verification', `Your verification code is ${verification_code}`, verification_code, user_name); // Send mail

                                res.statusCode = 200;
                                res.json({ err_msg: null, result: null, succ_msg: 'A new verification code has been sent to your email', res_code: 200 });
                            } 
                        }
                    } else {
                        res.statusCode = 400;
                        res.json({ err_msg: 'Your account is already verified', result: null, succ_msg: null, res_code: 400 }); 
                    }
                }
            } else {
                res.statusCode = 400;
                res.json({ err_msg: 'Invalid student ID', result: null, succ_msg: null, res_code: 400 });
            }
            //-------------------------------------------------------------------
        } else {
            res.statusCode = 400;
            res.json({ err_msg: 'Invalid credentials', result: null, succ_msg: null, res_code: 400 });
        }
        //--------------------------------------------------------------
    } else {
        res.statusCode = 400;
        res.json({ err_msg: 'Invalid credentials', result: null, succ_msg: null, res_code: 400 });
    }
    //--------------------------------------------
}

module.exports = generate_new_verif_code;