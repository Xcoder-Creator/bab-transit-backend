const db_query = require('../../models/db_model'); // Import db model
const sanitize_data = require('../../utility/sanitize_data.util'); // Import sanitize data
const response_headers = require('../../utility/response_headers.util'); // Import response headers
const validate_auth_header = require('../../utility/validate_auth_header.util'); // Import validate auth header
const jwt = require('jsonwebtoken'); // Import jwt module
const Cryptr = require('cryptr'); // Import cryptr module
const cryptr = new Cryptr(process.env.PASSWORD_ENCRYPT_DECRYPT_KEY, { pbkdf2Iterations: 10000, saltLength: 10 }); // Get encryption/descryption key for cryptr module

const ambulance_book_ride = async (req, res) => {
    response_headers(res); // Response headers

    // Validate the request form body data
    if (req.body){
        let form_data = req.body; // Form data from the frontend

        // Check if the appropriate request parameters are set
        if (form_data.current_location && form_data.vehicle_type && form_data.arrival_time && form_data.emergency_desc && form_data.victim_name && form_data.emergency_state){

            // Variables to hold form data individually and remove any quotes contained in them from left to right
            // and also remove leading and trailing whitespaces
            var current_location = sanitize_data(form_data.current_location);
            var vehicle_type = sanitize_data(form_data.vehicle_type).toLowerCase();
            var arrival_time = parseInt(form_data.arrival_time);
            var emergency_desc = sanitize_data(form_data.emergency_desc);
            var victim_name = sanitize_data(form_data.victim_name);
            var student_emergency_state = parseInt(form_data.emergency_state);
            //-------------------------------------------------------------------
            
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

                            let result011 = await db_query.check_student_by_id(student_id);
            
                            if (result011.status === false){
                                res.statusCode = 400;
                                res.json({ err_msg: 'An error just occured, Try again later', result: null, succ_msg: null, res_code: 400 });
                            } else if (result011.status === true){
                                let student_name = result011.data[0].student_name;

                                let result0 = await db_query.check_if_student_ride_is_pending(student_id);
            
                                if (result0.status === false){
                                    res.statusCode = 400;
                                    res.json({ err_msg: 'An error just occured, Try again later', result: null, succ_msg: null, res_code: 400 });
                                } else if (result0.status === true){
                                    if (result0.data.length > 0){
                                        res.statusCode = 400;
                                        res.json({ err_msg: 'Can\'t book ride until your recent pending ride has ended or is canceled', result: null, succ_msg: null, res_code: 400 });
                                    } else {
                                        let result1 = await db_query.get_all_student_details(student_id);
                
                                        if (result1.status === false){
                                            res.statusCode = 400;
                                            res.json({ err_msg: 'An error just occured, Try again later', result: null, succ_msg: null, res_code: 400 });
                                        } else if (result1.status === true){
                                            if (result1.data.length > 0 && result1.data.length === 1){
                                                if (current_location.length > 0){
                                                    if (vehicle_type === 'ambulance'){
                                                        let result3x = await db_query.get_available_ambulance_driver();
                
                                                        if (result3x.status === false){
                                                            res.statusCode = 400;
                                                            res.json({ err_msg: 'An error just occured, Try again later', result: null, succ_msg: null, res_code: 400 });
                                                        } else if (result3x.status === true){
                                                            if (result3x.data.length > 0 && result3x.data.length === 1){
                                                                let driver_id = result3x.data[0].driver_id;

                                                                if (emergency_desc.length > 0 && emergency_desc.length <= 600){
                                                                    if (student_emergency_state === 1){
                                                                        let result4 = await db_query.create_ambulance_ride(student_id, driver_id, current_location, 3, vehicle_type, emergency_desc, student_name, 0, 0, 1, 4, 0);
                            
                                                                        if (result4.status === false){
                                                                            res.statusCode = 400;
                                                                            res.json({ err_msg: 'An error just occured, Try again later', result: null, succ_msg: null, res_code: 400 });
                                                                        } else if (result4.status === true){
                                                                            res.statusCode = 200;
                                                                            res.json({ err_msg: null, result: { arrival_time: arrival_time - 1 }, succ_msg: 'Your ambulance ride has been booked successfully', res_code: 200 });
                                                                        }
                                                                    } else if (student_emergency_state === 2){
                                                                        if (victim_name.length > 0){
                                                                            let result4 = await db_query.create_ambulance_ride(student_id, driver_id, current_location, 3, vehicle_type, emergency_desc, victim_name, 1, 0, 1, 4, 0);
                            
                                                                            if (result4.status === false){
                                                                                res.statusCode = 400;
                                                                                res.json({ err_msg: 'An error just occured, Try again later', result: null, succ_msg: null, res_code: 400 });
                                                                            } else if (result4.status === true){
                                                                                res.statusCode = 200;
                                                                                res.json({ err_msg: null, result: { arrival_time: arrival_time - 1 }, succ_msg: 'Your ambulance ride has been booked successfully', res_code: 200 });
                                                                            }
                                                                        } else {
                                                                            res.statusCode = 400;
                                                                            res.json({ err_msg: 'Invalid victim name', result: null, succ_msg: null, res_code: 400 });
                                                                        }
                                                                    } else {
                                                                        res.statusCode = 400;
                                                                        res.json({ err_msg: 'Invalid emergency state', result: null, succ_msg: null, res_code: 400 });
                                                                    }
                                                                } else {
                                                                    res.statusCode = 400;
                                                                    res.json({ err_msg: 'Invalid emergency', result: null, succ_msg: null, res_code: 400 });
                                                                }
                                                            }
                                                        }
                                                    } else {
                                                        res.statusCode = 400;
                                                        res.json({ err_msg: 'Invalid vehicle type', result: null, succ_msg: null, res_code: 400 });
                                                    }
                                                } else {
                                                    res.statusCode = 400;
                                                    res.json({ err_msg: 'Invalid current location', result: null, succ_msg: null, res_code: 400 });
                                                }
                                            } else {
                                                res.statusCode = 404;
                                                res.json({ err_msg: 'User does not exist', result: null, succ_msg: null, res_code: 404 });
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    });
                } else {
                    res.statusCode = 400;
                    res.json({ err_msg: 'Invalid credentials', result: null, succ_msg: null, res_code: 400 });
                }
            }
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

module.exports = ambulance_book_ride;