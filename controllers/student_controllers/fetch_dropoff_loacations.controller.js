const bcrypt = require('bcrypt'); // Import bcrypt module
const db_query = require('../../models/db_model'); // Import db model
const response_headers = require('../../utility/response_headers.util'); // Import response headers
const validate_auth_header = require('../../utility/validate_auth_header.util'); // Import validate auth header
const jwt = require('jsonwebtoken'); // Import jwt module
const Cryptr = require('cryptr'); // Import cryptr module
const cryptr = new Cryptr(process.env.PASSWORD_ENCRYPT_DECRYPT_KEY, { pbkdf2Iterations: 10000, saltLength: 10 }); // Get encryption/descryption key for cryptr module

const fetch_dropoff_locations = async (req, res) => {
    response_headers(res); // Response headers

    let auth_token = validate_auth_header(req.headers['authorization']); // Validate the authorization header

    if (auth_token == null){
        res.statusCode = 400;
        res.json({ err_msg: 'Invalid credentials', result: null, succ_msg: null, res_code: 400 });
    } else {
        let decrypted_auth_token;
        let check = true;

        try {
            decrypted_auth_token = cryptr.decrypt(auth_token);
        } catch (error) {
            check = false;
        }

        if (check === true){
            jwt.verify(decrypted_auth_token, process.env.AUTH_TOKEN_SECRET, async (err, user) => {
                if (err){
                    res.statusCode = 400;
                    res.json({ err_msg: 'Invalid credentials', result: null, succ_msg: null, res_code: 400 });
                } else {
                    let student_id = user.user_id;
    
                    let result1 = await db_query.get_all_student_details(student_id);
    
                    if (result1.status === false){
                        res.statusCode = 400;
                        res.json({ err_msg: 'An error just occured, Try again later', result: null, succ_msg: null, res_code: 400 });
                    } else if (result1.status === true){
                        if (result1.data.length > 0 && result1.data.length === 1){
                            let result2 = await db_query.fetch_all_dropoff_locations();
    
                            if (result2.status === false){
                                res.statusCode = 400;
                                res.json({ err_msg: 'An error just occured, Try again later', result: null, succ_msg: null, res_code: 400 });
                            } else if (result2.status === true){
                                let drop_off_locations = result2.data;

                                res.statusCode = 200;
                                res.json({ err_msg: null, result: { locations: drop_off_locations }, succ_msg: 'All dropoff locations fetched successfully', res_code: 200 }); 
                            }
                        } else {
                            res.statusCode = 404;
                            res.json({ err_msg: 'User does not exist', result: null, succ_msg: null, res_code: 404 });
                        }
                    }
                }
            });
        } else {
            res.statusCode = 400;
            res.json({ err_msg: 'Invalid credentials', result: null, succ_msg: null, res_code: 400 });
        }
    }
}

module.exports = fetch_dropoff_locations;