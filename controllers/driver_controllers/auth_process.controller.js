const db_query = require('../../models/db_model'); // Import db model
const response_headers = require('../../utility/response_headers.util'); // Import response headers
const validate_auth_header = require('../../utility/validate_auth_header.util'); // Import validate auth header
const jwt = require('jsonwebtoken'); // Import jwt module
const Cryptr = require('cryptr'); // Import cryptr module
const cryptr = new Cryptr(process.env.PASSWORD_ENCRYPT_DECRYPT_KEY, { pbkdf2Iterations: 10000, saltLength: 10 }); // Get encryption/descryption key for cryptr module

const auth_process = async (req, res) => {
    response_headers(res); // Response headers

    let auth_token = validate_auth_header(req.headers['authorization']); // Validate the authorization header

    if (auth_token == null){
        res.statusCode = 400;
        res.json({ err_msg: 'Invalid credentials', result: null, succ_msg: null, res_code: 400 });
    } else {
        try {
            let decrypted_auth_token = cryptr.decrypt(auth_token);

            jwt.verify(decrypted_auth_token, process.env.AUTH_TOKEN_SECRET, async (err, user) => {
                if (err){
                    res.statusCode = 400;
                    res.json({ err_msg: 'Invalid credentials', result: null, succ_msg: null, res_code: 400 });
                } else {
                    let driver_id = user.user_id;

                    let result1 = await db_query.get_all_driver_details(driver_id);

                    if (result1.status === false){
                        res.statusCode = 400;
                        res.json({ err_msg: 'An error just occured, Try again later', result: null, succ_msg: null, res_code: 400 });
                    } else if (result1.status === true){
                        if (result1.data.length > 0 && result1.data.length === 1){
                            let user_name = result1.data[0].driver_name;
                            let profile_image = result1.data[0].profile_image;
                            let verification_status = result1.data[0].verification_status;

                            if (verification_status === 1){
                                res.statusCode = 200;
                                res.json({ err_msg: null, result: { user_data: { name: user_name, profile_image: profile_image } }, succ_msg: 'Authentication successfull', res_code: 200 }); 
                            } else {
                                res.statusCode = 400;
                                res.json({ err_msg: 'Authentication failed, This account is not verified', result: null, succ_msg: null, res_code: 400 });
                            }
                        } else {
                            res.statusCode = 404;
                            res.json({ err_msg: 'User does not exist', result: null, succ_msg: null, res_code: 404 });
                        }
                    }
                }
            });
        } catch (error) {
            res.statusCode = 400;
            res.json({ err_msg: 'Invalid credentials', result: null, succ_msg: null, res_code: 400 });
        }
    }
}

module.exports = auth_process;