const db_query = require('../../models/db_model'); // Import db model
const sanitize_data = require('../../utility/sanitize_data.util'); // Import sanitize data
const response_headers = require('../../utility/response_headers.util'); // Import response headers
const generate_access_token = require('../../utility/generate_access_token.util'); // Import generate access token
const jwt = require('jsonwebtoken'); // Import jwt module
const Cryptr = require('cryptr'); // Import cryptr module
const cryptr = new Cryptr(process.env.PASSWORD_ENCRYPT_DECRYPT_KEY, { pbkdf2Iterations: 10000, saltLength: 10 }); // Get encryption/descryption key for cryptr module

const verify_account = async (req, res) => {
    response_headers(res); // Response headers

    // Validate the request form body data
    if (req.body){
        let form_data = req.body; // Form data from the frontend

        // Check if the appropriate request parameters are set
        if (form_data.driver_id && form_data.verification_code){

            // Variables to hold form data individually and remove any quotes contained in them from left to right
            // and also remove leading and trailing whitespaces
            var driver_id = parseInt(sanitize_data(form_data.driver_id));
            var verification_code = sanitize_data(form_data.verification_code);
            //-------------------------------------------------------------------
            
            // Validate the data inputs from the form data
            if (driver_id !== NaN){
                if (verification_code.length > 0){
                    let result1 = await db_query.check_driver_verification_code(driver_id, verification_code);

                    if (result1.status === false){
                        res.statusCode = 400;
                        res.json({ err_msg: 'An error just occured, Try again later', result: null, succ_msg: null, res_code: 400 });
                    } else if (result1.status === true){
                        if (result1.data.length > 0 && result1.data.length === 1){
                            let token = result1.data[0].token;

                            jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, user) => {
                                if (err){
                                    let result2 = await db_query.delete_driver_verification_code(driver_id, verification_code);

                                    if (result2.status === false){
                                        res.statusCode = 400;
                                        res.json({ err_msg: 'An error just occured, Try again later', result: null, succ_msg: null, res_code: 400 }); 
                                    } else if (result2.status === true){
                                        res.statusCode = 400;
                                        res.json({ err_msg: 'This verification code has expired', result: null, succ_msg: null, res_code: 400 }); 
                                    }
                                } else {
                                    let result2 = await db_query.verify_driver_account(driver_id);

                                    if (result2.status === false){
                                        res.statusCode = 400;
                                        res.json({ err_msg: 'An error just occured, Try again later', result: null, succ_msg: null, res_code: 400 }); 
                                    } else if (result2.status === true){
                                        let encrypted_access_token = cryptr.encrypt(generate_access_token(driver_id, 'user_account', null));

                                        let result3 = await db_query.delete_driver_verification_code(driver_id, verification_code);

                                        if (result3.status === false){
                                            res.statusCode = 400;
                                            res.json({ err_msg: 'An error just occured, Try again later', result: null, succ_msg: null, res_code: 400 }); 
                                        } else if (result3.status === true){
                                            let result4 = await db_query.get_all_driver_details(driver_id);

                                            if (result4.status === false){
                                                res.statusCode = 400;
                                                res.json({ err_msg: 'An error just occured, Try again later', result: null, succ_msg: null, res_code: 400 }); 
                                            } else if (result4.status === true){
                                                let user_name = result4.data[0].driver_name;
                                                let profile_image = result4.data[0].profile_image;
                                                
                                                res.statusCode = 200;
                                                res.json({ err_msg: null, result: { auth_token: encrypted_access_token, user_data: { name: user_name, profile_image: profile_image } }, succ_msg: 'Your account has been verified successfully', res_code: 200 }); 
                                            }
                                        }
                                    }
                                }
                            });
                        } else {
                            res.statusCode = 400;
                            res.json({ err_msg: 'Invalid verification code', result: null, succ_msg: null, res_code: 400 }); 
                        }
                    }
                } else {
                    res.statusCode = 400;
                    res.json({ err_msg: 'Invalid verification code', result: null, succ_msg: null, res_code: 400 }); 
                }
            } else {
                res.statusCode = 400;
                res.json({ err_msg: 'Invalid driver ID', result: null, succ_msg: null, res_code: 400 });
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

module.exports = verify_account;
