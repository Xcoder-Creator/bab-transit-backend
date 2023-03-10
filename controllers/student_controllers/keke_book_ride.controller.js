const db_query = require('../../models/db_model'); // Import db model
const sanitize_data = require('../../utility/sanitize_data.util'); // Import sanitize data
const response_headers = require('../../utility/response_headers.util'); // Import response headers
const card_validation = require('../../utility/card_validation.util'); // Import card validation
const card_exp_date_validation = require('../../utility/card_exp_date_validation.util'); // Import card exp date validation
const validate_card_cvv = require('../../utility/validate_card_cvv.util'); // Import validate card cvv
const validate_auth_header = require('../../utility/validate_auth_header.util'); // Import validate auth header
const jwt = require('jsonwebtoken'); // Import jwt module
const Cryptr = require('cryptr'); // Import cryptr module
const cryptr = new Cryptr(process.env.PASSWORD_ENCRYPT_DECRYPT_KEY, { pbkdf2Iterations: 10000, saltLength: 10 }); // Get encryption/descryption key for cryptr module

const keke_book_ride = async (req, res) => {
    response_headers(res); // Response headers

    // Validate the request form body data
    if (req.body){
        let form_data = req.body; // Form data from the frontend

        // Check if the appropriate request parameters are set
        if (form_data.current_location && form_data.dropoff_location && form_data.vehicle_type && form_data.driver_id && form_data.arrival_time && form_data.ride_time && form_data.card_type && form_data.card_no && form_data.card_exp_month && form_data.card_exp_year && form_data.card_cvv){

            // Variables to hold form data individually and remove any quotes contained in them from left to right
            // and also remove leading and trailing whitespaces
            var current_location = sanitize_data(form_data.current_location);
            var drop_off_location = parseInt(form_data.dropoff_location);
            var vehicle_type = sanitize_data(form_data.vehicle_type).toLowerCase();
            var driver_id = parseInt(form_data.driver_id);
            var arrival_time = parseInt(form_data.arrival_time);
            var ride_time = parseInt(form_data.ride_time);
            var card_type = parseInt(form_data.card_type);
            var card_no = form_data.card_no;
            var card_exp_month = parseInt(form_data.card_exp_month);
            var card_exp_year = parseInt(form_data.card_exp_year);
            var card_cvv = form_data.card_cvv;
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
                                                let result2 = await db_query.search_dropoff_location_by_id(drop_off_location);
                    
                                                if (result2.status === false){
                                                    res.statusCode = 400;
                                                    res.json({ err_msg: 'An error just occured, Try again later', result: null, succ_msg: null, res_code: 400 });
                                                } else if (result2.status === true){
                                                    if (result2.data.length > 0 && result2.data.length === 1){
                                                        if (vehicle_type === 'keke'){
                                                            let result3 = await db_query.check_if_driver_is_available(driver_id);
                    
                                                            if (result3.status === false){
                                                                res.statusCode = 400;
                                                                res.json({ err_msg: 'An error just occured, Try again later', result: null, succ_msg: null, res_code: 400 });
                                                            } else if (result3.status === true){
                                                                if (result3.data.length > 0 && result3.data.length === 1){
                                                                    let driver_vehicle_capacity = result3.data[0].capacity;

                                                                    if (driver_vehicle_capacity > 0){
                                                                        let result3x = await db_query.check_if_student_added_card_details(student_id);
                    
                                                                        if (result3x.status === false){
                                                                            res.statusCode = 400;
                                                                            res.json({ err_msg: 'An error just occured, Try again later', result: null, succ_msg: null, res_code: 400 });
                                                                        } else if (result3x.status === true){
                                                                            if (result3x.data.length > 0 && result3x.data.length === 1){
                                                                                let time_array = [ 3, 4, 5 ];
                                                                                if (time_array.includes(arrival_time)){
                                                                                    if (time_array.includes(ride_time)){
                                                                                        let result3x1 = await db_query.get_all_driver_details(driver_id);
                        
                                                                                        if (result3x1.status === false){
                                                                                            res.statusCode = 400;
                                                                                            res.json({ err_msg: 'An error just occured, Try again later', result: null, succ_msg: null, res_code: 400 });
                                                                                        } else if (result3x1.status === true){
                                                                                            if (result3x1.data.length > 0 && result3x1.data.length === 1){
                                                                                                let driver_account_balance = result3x1.data[0].account_balance;
                                                                                                let vehicle_capacity = result3x1.data[0].capacity - 1;
                                                                                                driver_account_balance = driver_account_balance + 250;

                                                                                                let result3x2 = await db_query.update_driver_account_balance_and_vehicle_capacity(driver_account_balance, driver_id, vehicle_capacity);
                                
                                                                                                if (result3x2.status === false){
                                                                                                    res.statusCode = 400;
                                                                                                    res.json({ err_msg: 'An error just occured, Try again later', result: null, succ_msg: null, res_code: 400 });
                                                                                                } else if (result3x2.status === true){
                                                                                                    let result5 = await db_query.create_keke_ride(student_id, driver_id, current_location, drop_off_location, vehicle_type, 0, 1, 4, 0);
                                
                                                                                                    if (result5.status === false){
                                                                                                        res.statusCode = 400;
                                                                                                        res.json({ err_msg: 'An error just occured, Try again later', result: null, succ_msg: null, res_code: 400 });
                                                                                                    } else if (result5.status === true){
                                                                                                        res.statusCode = 200;
                                                                                                        res.json({ err_msg: null, result: { arrival_time: arrival_time - 1 }, succ_msg: 'Your keke ride has been booked successfully', res_code: 200 });
                                                                                                    }
                                                                                                }
                                                                                            }
                                                                                        }
                                                                                    } else {
                                                                                        res.statusCode = 400;
                                                                                        res.json({ err_msg: 'Invalid ride time', result: null, succ_msg: null, res_code: 400 });
                                                                                    }
                                                                                } else {
                                                                                    res.statusCode = 400;
                                                                                    res.json({ err_msg: 'Invalid arrival time', result: null, succ_msg: null, res_code: 400 });
                                                                                }  
                                                                            } else {
                                                                                let time_array = [ 3, 4, 5 ];
                                                                                if (time_array.includes(arrival_time)){
                                                                                    if (time_array.includes(ride_time)){
                                                                                        let card_type_value;

                                                                                        if (card_type === 1){
                                                                                            card_type_value = 'mastercard';
                                                                                        } else if (card_type === 2){
                                                                                            card_type_value = 'visacard';
                                                                                        } else {
                                                                                            card_type_value = null;
                                                                                        }

                                                                                        let card_valid = card_validation(card_type_value, card_no);

                                                                                        if (card_valid === true){
                                                                                            let exp_date_validation = card_exp_date_validation(card_exp_month, card_exp_year);
                                                                                            if (exp_date_validation.state === true){
                                                                                                let exp_date = exp_date_validation.date;

                                                                                                if (validate_card_cvv(card_cvv) === true){
                                                                                                    let result4 = await db_query.save_student_card_details(student_id, card_no, exp_date, card_cvv, card_type_value);
                                
                                                                                                    if (result4.status === false){
                                                                                                        res.statusCode = 400;
                                                                                                        res.json({ err_msg: 'An error just occured, Try again later', result: null, succ_msg: null, res_code: 400 });
                                                                                                    } else if (result4.status === true){
                                                                                                        let result5 = await db_query.create_keke_ride(student_id, driver_id, current_location, drop_off_location, vehicle_type, 0, 1, 4, 0);
                                
                                                                                                        if (result5.status === false){
                                                                                                            res.statusCode = 400;
                                                                                                            res.json({ err_msg: 'An error just occured, Try again later', result: null, succ_msg: null, res_code: 400 });
                                                                                                        } else if (result5.status === true){
                                                                                                            let result6 = await db_query.get_all_driver_details(driver_id);
                        
                                                                                                            if (result6.status === false){
                                                                                                                res.statusCode = 400;
                                                                                                                res.json({ err_msg: 'An error just occured, Try again later', result: null, succ_msg: null, res_code: 400 });
                                                                                                            } else if (result6.status === true){
                                                                                                                if (result6.data.length > 0 && result6.data.length === 1){
                                                                                                                    let driver_account_balance = result6.data[0].account_balance;
                                                                                                                    let vehicle_capacity = result6.data[0].capacity - 1;
                                                                                                                    driver_account_balance = driver_account_balance + 250;

                                                                                                                    let result7 = await db_query.update_driver_account_balance_and_vehicle_capacity(driver_account_balance, driver_id, vehicle_capacity);
                                                    
                                                                                                                    if (result7.status === false){
                                                                                                                        res.statusCode = 400;
                                                                                                                        res.json({ err_msg: 'An error just occured, Try again later', result: null, succ_msg: null, res_code: 400 });
                                                                                                                    } else if (result7.status === true){
                                                                                                                        res.statusCode = 200;
                                                                                                                        res.json({ err_msg: null, result: { arrival_time: arrival_time - 1 }, succ_msg: 'Your keke ride has been booked successfully', res_code: 200 });
                                                                                                                    }
                                                                                                                }
                                                                                                            }
                                                                                                        }
                                                                                                    }
                                                                                                } else {
                                                                                                    res.statusCode = 400;
                                                                                                    res.json({ err_msg: 'Invalid credit card cvv number', result: null, succ_msg: null, res_code: 400 });
                                                                                                }
                                                                                            } else if (exp_date_validation.state === false){
                                                                                                res.statusCode = 400;
                                                                                                res.json({ err_msg: 'Invalid credit card expiry date', result: null, succ_msg: null, res_code: 400 });
                                                                                            }
                                                                                        } else if (card_valid === false){
                                                                                            res.statusCode = 400;
                                                                                            res.json({ err_msg: 'Invalid credit card number', result: null, succ_msg: null, res_code: 400 });
                                                                                        } else {
                                                                                            res.statusCode = 400;
                                                                                            res.json({ err_msg: 'Invalid credit card number', result: null, succ_msg: null, res_code: 400 });
                                                                                        }
                                                                                    } else {
                                                                                        res.statusCode = 400;
                                                                                        res.json({ err_msg: 'Invalid ride time', result: null, succ_msg: null, res_code: 400 });
                                                                                    }
                                                                                } else {
                                                                                    res.statusCode = 400;
                                                                                    res.json({ err_msg: 'Invalid arrival time', result: null, succ_msg: null, res_code: 400 });
                                                                                }
                                                                            }
                                                                        }
                                                                    } else {
                                                                        res.statusCode = 400;
                                                                        res.json({ err_msg: 'No free sits available for this vehicle', result: null, succ_msg: null, res_code: 400 });
                                                                    }
                                                                } else {
                                                                    res.statusCode = 404;
                                                                    res.json({ err_msg: 'This driver is no longer available for a ride', result: null, succ_msg: null, res_code: 404 });
                                                                }
                                                            }
                                                        } else {
                                                            res.statusCode = 400;
                                                            res.json({ err_msg: 'Invalid vehicle type', result: null, succ_msg: null, res_code: 400 });
                                                        }
                                                    } else {
                                                        res.statusCode = 400;
                                                        res.json({ err_msg: 'No such dropoff location exists', result: null, succ_msg: null, res_code: 400 });
                                                    }
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

module.exports = keke_book_ride;