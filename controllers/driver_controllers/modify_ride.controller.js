const db_query = require('../../models/db_model'); // Import db model
const response_headers = require('../../utility/response_headers.util'); // Import response headers
const validate_auth_header = require('../../utility/validate_auth_header.util'); // Import validate auth header
const jwt = require('jsonwebtoken'); // Import jwt module
const Cryptr = require('cryptr'); // Import cryptr module
const cryptr = new Cryptr(process.env.PASSWORD_ENCRYPT_DECRYPT_KEY, { pbkdf2Iterations: 10000, saltLength: 10 }); // Get encryption/descryption key for cryptr module
const yup = require('yup');

const modifyRideSchema = yup.object().shape({
    transport_ride_id: yup.number().required(),
    change_state: yup.number().required()
});

const modify_ride = async (req, res) => {
    response_headers(res); // Response headers

    // Validate the request form body data
    if (req.body){
        let form_data = req.body; // Form data from the frontend

        // Check if the appropriate request parameters are set
        if (form_data.transport_ride_id && form_data.change_state){
            const data = {
                transport_ride_id: form_data.transport_ride_id,
                change_state: form_data.change_state
            };

            modifyRideSchema.validate(data)
                .then((validatedUser) => {
                    var modify_ride = async () => {
                        let transport_ride_id = data.transport_ride_id;
                        let change_state = data.change_state;
                        
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
                                        let driver_id = user.user_id;

                                        // 1 is for starting a ride, 2 is for ending a ride
                                        if (change_state === 1){
                                            let result1 = await db_query.check_if_ride_exists(transport_ride_id, driver_id);
                        
                                            if (result1.status === false){
                                                res.statusCode = 400;
                                                res.json({ err_msg: 'An error just occured, Try again later', result: null, succ_msg: null, res_code: 400 });
                                            } else if (result1.status === true){
                                                if (result1.data.length > 0 && result1.data.length === 1){
                                                    let result2 = await db_query.check_if_ride_has_not_started(transport_ride_id);
                        
                                                    if (result2.status === false){
                                                        res.statusCode = 400;
                                                        res.json({ err_msg: 'An error just occured, Try again later', result: null, succ_msg: null, res_code: 400 });
                                                    } else if (result2.status === true){
                                                        if (result2.data.length > 0 && result2.data.length === 1){
                                                            let result3 = await db_query.update_status_of_ride(transport_ride_id, 1, 1, 0, 1, 4);
                        
                                                            if (result3.status === false){
                                                                res.statusCode = 400;
                                                                res.json({ err_msg: 'An error just occured, Try again later', result: null, succ_msg: null, res_code: 400 });
                                                            } else if (result3.status === true){
                                                                res.statusCode = 200;
                                                                res.json({ err_msg: null, result: null, succ_msg: 'This ride has started successfully', res_code: 200 });
                                                            }
                                                        } else {
                                                            res.statusCode = 400;
                                                            res.json({ err_msg: 'This ride cannot be started either because it has already started or it has ended or canceled by the student who booked it', result: null, succ_msg: null, res_code: 400 });
                                                        }
                                                    }
                                                } else {
                                                    res.statusCode = 404;
                                                    res.json({ err_msg: 'This ride does not exist', result: null, succ_msg: null, res_code: 404 });
                                                }
                                            }
                                        } else if (change_state === 2){ 
                                            let result1 = await db_query.check_if_ride_exists(transport_ride_id, driver_id);
                        
                                            if (result1.status === false){
                                                res.statusCode = 400;
                                                res.json({ err_msg: 'An error just occured, Try again later', result: null, succ_msg: null, res_code: 400 });
                                            } else if (result1.status === true){
                                                if (result1.data.length > 0 && result1.data.length === 1){
                                                    let result2 = await db_query.check_if_ride_has_not_started_or_has_started(transport_ride_id);
                        
                                                    if (result2.status === false){
                                                        res.statusCode = 400;
                                                        res.json({ err_msg: 'An error just occured, Try again later', result: null, succ_msg: null, res_code: 400 });
                                                    } else if (result2.status === true){
                                                        if (result2.data.length > 0 && result2.data.length === 1){
                                                            let result3 = await db_query.update_status_of_ride(transport_ride_id, 2, 1, 0, 2, 4);
                        
                                                            if (result3.status === false){
                                                                res.statusCode = 400;
                                                                res.json({ err_msg: 'An error just occured, Try again later', result: null, succ_msg: null, res_code: 400 });
                                                            } else if (result3.status === true){
                                                                let result4 = await db_query.get_all_driver_details(driver_id);

                                                                if (result4.status === false){
                                                                    res.statusCode = 400;
                                                                    res.json({ err_msg: 'An error just occured, Try again later', result: null, succ_msg: null, res_code: 400 });
                                                                } else if (result4.status === true){
                                                                    let capacity = result4.data[0].capacity;

                                                                    if (capacity < 3){
                                                                        let updated_capacity = capacity + 1;

                                                                        let result5 = await db_query.increase_capacity(driver_id, updated_capacity);

                                                                        if (result5.status === false){
                                                                            res.statusCode = 400;
                                                                            res.json({ err_msg: 'An error just occured, Try again later', result: null, succ_msg: null, res_code: 400 });
                                                                        } else if (result5.status === true){
                                                                            res.statusCode = 200;
                                                                            res.json({ err_msg: null, result: null, succ_msg: 'This ride has ended successfully', res_code: 200 });
                                                                        }
                                                                    } else {
                                                                        res.statusCode = 200;
                                                                        res.json({ err_msg: null, result: null, succ_msg: 'This ride has ended successfully', res_code: 200 });
                                                                    }
                                                                }
                                                            }
                                                        } else {
                                                            res.statusCode = 400;
                                                            res.json({ err_msg: 'This ride has probably ended or it has been canceled', result: null, succ_msg: null, res_code: 400 });
                                                        }
                                                    }
                                                } else {
                                                    res.statusCode = 404;
                                                    res.json({ err_msg: 'This ride does not exist', result: null, succ_msg: null, res_code: 404 });
                                                }
                                            }
                                        } else {
                                            res.statusCode = 400;
                                            res.json({ err_msg: 'Invalid state selected', result: null, succ_msg: null, res_code: 400 });
                                        }
                                        //--------------------------------------------------------
                                    }
                                });
                            } else {
                                res.statusCode = 400;
                                res.json({ err_msg: 'Invalid credentials', result: null, succ_msg: null, res_code: 400 });
                            }
                        }
                    }

                    modify_ride();
                })
                .catch((validationError) => {
                    res.statusCode = 400;
                    res.json({ err_msg: 'Invalid credentials', result: null, succ_msg: null, res_code: 400 });
                });
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

module.exports = modify_ride;