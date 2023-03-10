const db_query = require('../../models/db_model'); // Import db model
const response_headers = require('../../utility/response_headers.util'); // Import response headers
const validate_auth_header = require('../../utility/validate_auth_header.util'); // Import validate auth header
const jwt = require('jsonwebtoken'); // Import jwt module
const Cryptr = require('cryptr'); // Import cryptr module
const cryptr = new Cryptr(process.env.PASSWORD_ENCRYPT_DECRYPT_KEY, { pbkdf2Iterations: 10000, saltLength: 10 }); // Get encryption/descryption key for cryptr module

const ride_details = async (req, res) => {
    response_headers(res); // Response headers

    // Validate the request form body data
    if (req.body){
        let form_data = req.body; // Form data from the frontend

        // Check if the appropriate request parameters are set
        if (form_data.transport_ride_id){

            // Variables to hold form data individually and remove any quotes contained in them from left to right
            // and also remove leading and trailing whitespaces
            var transport_ride_id = parseInt(form_data.transport_ride_id);
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
                            let driver_id = user.user_id;

                            let result1 = await db_query.check_if_ride_exists(transport_ride_id, driver_id);
            
                            if (result1.status === false){
                                res.statusCode = 400;
                                res.json({ err_msg: 'An error just occured, Try again later', result: null, succ_msg: null, res_code: 400 });
                            } else if (result1.status === true){
                                if (result1.data.length > 0 && result1.data.length === 1){
                                    let ride = result1.data[0];
                                    let ride_id = ride.transport_ride_id;
                                    let current_ride_state = (ride.ride_status === 0) ? 'Not started' : (ride.ride_status === 1) ? 'Started' : (ride.ride_status === 2) ? 'Ended' : (ride.ride_status === 3) ? 'Canceled' : '';
                                    let ride_vehicle = ride.drive_type;
                                    let current_location = ride.student_current_location;
                                    let destination;

                                    if (ride.student_destination === 1){
                                        destination = 'Adeleke hall';
                                    } else if (ride.student_destination === 2){
                                        destination = 'School Cafeteria';
                                    } else if (ride.student_destination === 3){
                                        destination = 'BUTH';
                                    } else if (ride.student_destination === 4){
                                        destination = 'BUCODEL';
                                    } else if (ride.student_destination === 5){
                                        destination = 'BUSA';
                                    } else if (ride.student_destination === 6){
                                        destination = 'BGH';
                                    } else if (ride.student_destination === 7){
                                        destination = 'Nelson Mandela Activity Hall';
                                    } else if (ride.student_destination === 8){
                                        destination = 'Samuel Akhande Activity Hall';
                                    } else if (ride.student_destination === 9){
                                        destination = 'Bethel Splendor Hall';
                                    } else if (ride.student_destination === 10){
                                        destination = 'Neal Wilson Hall';
                                    } else if (ride.student_destination === 11){
                                        destination = 'Main Campus Library';
                                    } else if (ride.student_destination === 12){
                                        destination = 'Amphitheatre';
                                    } else if (ride.student_destination === 13){
                                        destination = 'Babrite Super Store';
                                    }

                                    let date_time = ride.ride_booked_at;

                                    let data = {
                                        ride_id: ride_id,
                                        current_ride_state: current_ride_state,
                                        ride_vehicle: ride_vehicle,
                                        current_location: current_location,
                                        destination: destination,
                                        date_time: date_time
                                    }

                                    res.statusCode = 200;
                                    res.json({ err_msg: null, result: data, succ_msg: 'Ride details fetched successfully', res_code: 200 });
                                } else {
                                    res.statusCode = 404;
                                    res.json({ err_msg: 'This ride does not exist', result: null, succ_msg: null, res_code: 404 });
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

module.exports = ride_details;