const db_query = require('../../models/db_model'); // Import db model
const response_headers = require('../../utility/response_headers.util'); // Import response headers
const validate_auth_header = require('../../utility/validate_auth_header.util'); // Import validate auth header
const jwt = require('jsonwebtoken'); // Import jwt module
const Cryptr = require('cryptr'); // Import cryptr module
const cryptr = new Cryptr(process.env.PASSWORD_ENCRYPT_DECRYPT_KEY, { pbkdf2Iterations: 10000, saltLength: 10 }); // Get encryption/descryption key for cryptr module

const get_available_drivers = async (req, res) => {
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
                            let result2 = await db_query.get_all_available_drivers();
    
                            if (result2.status === false){
                                res.statusCode = 400;
                                res.json({ err_msg: 'An error just occured, Try again later', result: null, succ_msg: null, res_code: 400 });
                            } else if (result2.status === true){
                                if (result2.data.length > 0){
                                    let available_drivers = result2.data;
                                    let new_array_of_drivers = [];

                                    for (let [i, driver] of available_drivers.entries()) {
                                        let time_array = [ 3, 4, 5 ];
                                        driver['ride_price'] = parseFloat(250.00);
                                        driver['ride_time'] = time_array[Math.floor(Math.random() * time_array.length)];
                                        driver['arrival_time'] = time_array[Math.floor(Math.random() * time_array.length)];
                                        new_array_of_drivers.push(driver);
                                    }

                                    res.statusCode = 200;
                                    res.json({ err_msg: null, result: new_array_of_drivers, succ_msg: 'All available drivers fetched successfully', res_code: 200 });
                                } else {
                                    res.statusCode = 404;
                                    res.json({ err_msg: 'No available drivers found', result: null, succ_msg: null, res_code: 315 });
                                }
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

module.exports = get_available_drivers;