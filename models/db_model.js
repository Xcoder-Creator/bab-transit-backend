const pool = require('../models/db_connect'); // Connect to database

// Check if a particular hostel exists in the database
var fetch_student_hostels = (hostel_id) => {
    return new Promise((resolve, reject) => {
        pool.getConnection(async (err, connection) => {
            if(err) throw err
            connection.query('SELECT * FROM student_hostels WHERE hostel_id = ?;', [ hostel_id ], async (err, rows) => {
                connection.release() // return the connection to pool

                if (err) {
                    return resolve({ status: false });
                } else {
                    return resolve({ status: true, data: rows });
                }
            })
        });
    });
}
//------------------------------------------

// Check if a particular student email exists in the database
var check_student_email = (email) => {
    return new Promise((resolve, reject) => {
        pool.getConnection(async (err, connection) => {
            if(err) throw err
            connection.query('SELECT * FROM student_account_details WHERE student_email = ?;', [ email ], async (err, rows) => {
                connection.release() // return the connection to pool

                if (err) {
                    return resolve({ status: false });
                } else {
                    return resolve({ status: true, data: rows });
                }
            })
        });
    });
}
//------------------------------------------

// Get all student passwords from the database
var get_all_student_passwords = () => {
    return new Promise((resolve, reject) => {
        pool.getConnection(async (err, connection) => {
            if(err) throw err
            connection.query('SELECT student_password FROM student_account_details;', [], async (err, rows) => {
                connection.release() // return the connection to pool

                if (err) {
                    return resolve({ status: false });
                } else {
                    return resolve({ status: true, data: rows });
                }
            })
        });
    });
}
//------------------------------------------

// Insert a new student account record into the database
var create_new_student_account = (email, password, phone_no, matric_no, user_name, gender, hostel, report, profile_img, verif_status) => {
    return new Promise((resolve, reject) => {
        pool.getConnection(async (err, connection) => {
            if(err) throw err
            connection.query('INSERT INTO student_account_details(student_email, student_password, student_phone_no, matric_no, student_name, student_gender, student_hostel, medical_report, profile_image, verification_status, registered_at) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW()); SELECT LAST_INSERT_ID() AS user_id;', [ email, password, phone_no, matric_no, user_name, gender, hostel, report, profile_img, verif_status ], async (err, rows) => {
                connection.release() // return the connection to pool

                if (err) {
                    console.log(err);
                    return resolve({ status: false });
                } else {
                    return resolve({ status: true, data: rows[1] });
                }
            })
        });
    });
}
//------------------------------------------

// Delete student account record from the database
var delete_student_account = (user_id) => {
    return new Promise((resolve, reject) => {
        pool.getConnection(async (err, connection) => {
            if(err) throw err
            connection.query('DELETE FROM student_account_details WHERE student_id = ?', [ user_id ], async (err, rows) => {
                connection.release() // return the connection to pool

                if (err) {
                    console.log(err);
                    return resolve({ status: false });
                } else {
                    return resolve({ status: true });
                }
            })
        });
    });
}
//------------------------------------------

// Update the medical report url of student in the database
var update_student_report_url = (user_id, url) => {
    return new Promise((resolve, reject) => {
        pool.getConnection(async (err, connection) => {
            if(err) throw err
            connection.query('UPDATE student_account_details SET medical_report = ? WHERE student_id = ?;', [ url, user_id ], async (err, rows) => {
                connection.release() // return the connection to pool

                if (err) {
                    return resolve({ status: false });
                } else {
                    return resolve({ status: true });
                }
            })
        });
    });
}
//------------------------------------------

// Update the medical report url of student in the database
var store_student_verification_code = (user_id, verif_code, token) => {
    return new Promise((resolve, reject) => {
        pool.getConnection(async (err, connection) => {
            if(err) throw err
            connection.query('INSERT INTO student_account_verification(student_id, verify_code, token, created_at) VALUES(?, ?, ?, NOW());', [ user_id, verif_code, token ], async (err, rows) => {
                connection.release() // return the connection to pool

                if (err) {
                    return resolve({ status: false });
                } else {
                    return resolve({ status: true });
                }
            })
        });
    });
}
//------------------------------------------

// Check if the verification code exists in the database
var check_student_verification_code = (user_id, verif_code) => {
    return new Promise((resolve, reject) => {
        pool.getConnection(async (err, connection) => {
            if(err) throw err
            connection.query('SELECT * FROM student_account_verification WHERE student_id = ? AND verify_code = ?;', [ user_id, verif_code ], async (err, rows) => {
                connection.release() // return the connection to pool

                if (err) {
                    return resolve({ status: false });
                } else {
                    return resolve({ status: true, data: rows });
                }
            })
        });
    });
}
//------------------------------------------

// Delete verification code from the database
var delete_student_verification_code = (user_id, verif_code) => {
    return new Promise((resolve, reject) => {
        pool.getConnection(async (err, connection) => {
            if(err) throw err
            connection.query('DELETE FROM student_account_verification WHERE student_id = ? AND verify_code = ?;', [ user_id, verif_code ], async (err, rows) => {
                connection.release() // return the connection to pool

                if (err) {
                    return resolve({ status: false });
                } else {
                    return resolve({ status: true });
                }
            })
        });
    });
}
//------------------------------------------

// Verify the student account in the database
var verify_student_account = (user_id) => {
    return new Promise((resolve, reject) => {
        pool.getConnection(async (err, connection) => {
            if(err) throw err
            connection.query('UPDATE student_account_details SET verification_status = 1 WHERE student_id = ?;', [ user_id ], async (err, rows) => {
                connection.release() // return the connection to pool

                if (err) {
                    return resolve({ status: false });
                } else {
                    return resolve({ status: true });
                }
            })
        });
    });
}
//------------------------------------------

// Check if student is not verified in the database
var check_if_student_is_not_verified = (user_id) => {
    return new Promise((resolve, reject) => {
        pool.getConnection(async (err, connection) => {
            if(err) throw err
            connection.query('SELECT * FROM student_account_details WHERE verification_status = 0 AND student_id = ?', [ user_id ], async (err, rows) => {
                connection.release() // return the connection to pool

                if (err) {
                    return resolve({ status: false });
                } else {
                    return resolve({ status: true, data: rows });
                }
            })
        });
    });
}
//------------------------------------------

// Delete all verification codes for a student from the database
var delete_all_student_verification_codes = (user_id) => {
    return new Promise((resolve, reject) => {
        pool.getConnection(async (err, connection) => {
            if(err) throw err
            connection.query('DELETE FROM student_account_verification WHERE student_id = ?;', [ user_id ], async (err, rows) => {
                connection.release() // return the connection to pool

                if (err) {
                    return resolve({ status: false });
                } else {
                    return resolve({ status: true });
                }
            })
        });
    });
}
//------------------------------------------

// Check if a particular student phone number exists in the database
var check_student_phone_no = (phone_no) => {
    return new Promise((resolve, reject) => {
        pool.getConnection(async (err, connection) => {
            if(err) throw err
            connection.query('SELECT * FROM student_account_details WHERE student_phone_no = ?;', [ phone_no ], async (err, rows) => {
                connection.release() // return the connection to pool

                if (err) {
                    return resolve({ status: false });
                } else {
                    return resolve({ status: true, data: rows });
                }
            })
        });
    });
}
//------------------------------------------

// Check if a particular drivers phone number exists in the database
var check_driver_phone_no = (phone_no) => {
    return new Promise((resolve, reject) => {
        pool.getConnection(async (err, connection) => {
            if(err) throw err
            connection.query('SELECT * FROM driver_account_details WHERE driver_phone_no = ?;', [ phone_no ], async (err, rows) => {
                connection.release() // return the connection to pool

                if (err) {
                    return resolve({ status: false });
                } else {
                    return resolve({ status: true, data: rows });
                }
            })
        });
    });
}
//------------------------------------------

// Get all driver passwords from the database
var get_all_driver_passwords = () => {
    return new Promise((resolve, reject) => {
        pool.getConnection(async (err, connection) => {
            if(err) throw err
            connection.query('SELECT driver_password FROM driver_account_details;', [], async (err, rows) => {
                connection.release() // return the connection to pool

                if (err) {
                    return resolve({ status: false });
                } else {
                    return resolve({ status: true, data: rows });
                }
            })
        });
    });
}
//------------------------------------------

// Insert a new driver account record into the database
var create_new_driver_account = (email, password, phone_no, plate_no, user_name, gender, vehicle_type, capacity, driver_status, profile_img, vehicle_report, verif_status, rating) => {
    return new Promise((resolve, reject) => {
        pool.getConnection(async (err, connection) => {
            if(err) throw err
            connection.query('INSERT INTO driver_account_details(driver_email, driver_password, driver_phone_no, driver_plate_no, driver_name, driver_gender, vehicle_type, capacity, driver_status, profile_image, vehicle_report, verification_status, rating, account_balance, registered_at) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW()); SELECT LAST_INSERT_ID() AS user_id;', [ email, password, phone_no, plate_no, user_name, gender, vehicle_type, capacity, driver_status, profile_img, vehicle_report, verif_status, rating, 0 ], async (err, rows) => {
                connection.release() // return the connection to pool

                if (err) {
                    console.log(err);
                    return resolve({ status: false });
                } else {
                    return resolve({ status: true, data: rows[1] });
                }
            })
        });
    });
}
//------------------------------------------

// Delete driver account record from the database
var delete_driver_account = (user_id) => {
    return new Promise((resolve, reject) => {
        pool.getConnection(async (err, connection) => {
            if(err) throw err
            connection.query('DELETE FROM driver_account_details WHERE driver_id = ?', [ user_id ], async (err, rows) => {
                connection.release() // return the connection to pool

                if (err) {
                    console.log(err);
                    return resolve({ status: false });
                } else {
                    return resolve({ status: true });
                }
            })
        });
    });
}
//------------------------------------------

// Update the vehicle report url of driver in the database
var update_driver_report_url = (user_id, url) => {
    return new Promise((resolve, reject) => {
        pool.getConnection(async (err, connection) => {
            if(err) throw err
            connection.query('UPDATE driver_account_details SET vehicle_report = ? WHERE driver_id = ?;', [ url, user_id ], async (err, rows) => {
                connection.release() // return the connection to pool

                if (err) {
                    return resolve({ status: false });
                } else {
                    return resolve({ status: true });
                }
            })
        });
    });
}
//------------------------------------------

// Insert a new verification code record in the database
var store_driver_verification_code = (user_id, verif_code, token) => {
    return new Promise((resolve, reject) => {
        pool.getConnection(async (err, connection) => {
            if(err) throw err
            connection.query('INSERT INTO driver_account_verification(driver_id, verify_code, token, created_at) VALUES(?, ?, ?, NOW());', [ user_id, verif_code, token ], async (err, rows) => {
                connection.release() // return the connection to pool

                if (err) {
                    return resolve({ status: false });
                } else {
                    return resolve({ status: true });
                }
            })
        });
    });
}
//------------------------------------------

// Check if the verification code exists in the database
var check_driver_verification_code = (user_id, verif_code) => {
    return new Promise((resolve, reject) => {
        pool.getConnection(async (err, connection) => {
            if(err) throw err
            connection.query('SELECT * FROM driver_account_verification WHERE driver_id = ? AND verify_code = ?;', [ user_id, verif_code ], async (err, rows) => {
                connection.release() // return the connection to pool

                if (err) {
                    return resolve({ status: false });
                } else {
                    return resolve({ status: true, data: rows });
                }
            })
        });
    });
}
//------------------------------------------

// Delete verification code from the database
var delete_driver_verification_code = (user_id, verif_code) => {
    return new Promise((resolve, reject) => {
        pool.getConnection(async (err, connection) => {
            if(err) throw err
            connection.query('DELETE FROM driver_account_verification WHERE driver_id = ? AND verify_code = ?;', [ user_id, verif_code ], async (err, rows) => {
                connection.release() // return the connection to pool

                if (err) {
                    console.log(err)
                    return resolve({ status: false });
                } else {
                    return resolve({ status: true });
                }
            })
        });
    });
}
//------------------------------------------

// Verify the driver account in the database
var verify_driver_account = (user_id) => {
    return new Promise((resolve, reject) => {
        pool.getConnection(async (err, connection) => {
            if(err) throw err
            connection.query('UPDATE driver_account_details SET verification_status = 1 WHERE driver_id = ?;', [ user_id ], async (err, rows) => {
                connection.release() // return the connection to pool

                if (err) {
                    return resolve({ status: false });
                } else {
                    return resolve({ status: true });
                }
            })
        });
    });
}
//------------------------------------------

// Fetch all details of the student from the database
var get_all_student_details = (user_id) => {
    return new Promise((resolve, reject) => {
        pool.getConnection(async (err, connection) => {
            if(err) throw err
            connection.query('SELECT * FROM student_account_details WHERE student_id = ?;', [ user_id ], async (err, rows) => {
                connection.release() // return the connection to pool

                if (err) {
                    return resolve({ status: false });
                } else {
                    return resolve({ status: true, data: rows });
                }
            })
        });
    });
}
//------------------------------------------

// Fetch all details of the driver from the database
var get_all_driver_details = (user_id) => {
    return new Promise((resolve, reject) => {
        pool.getConnection(async (err, connection) => {
            if(err) throw err
            connection.query('SELECT * FROM driver_account_details WHERE driver_id = ?;', [ user_id ], async (err, rows) => {
                connection.release() // return the connection to pool

                if (err) {
                    return resolve({ status: false });
                } else {
                    return resolve({ status: true, data: rows });
                }
            })
        });
    });
}
//------------------------------------------

// Check if driver is not verified in the database
var check_if_driver_is_not_verified = (user_id) => {
    return new Promise((resolve, reject) => {
        pool.getConnection(async (err, connection) => {
            if(err) throw err
            connection.query('SELECT * FROM driver_account_details WHERE verification_status = 0 AND driver_id = ?', [ user_id ], async (err, rows) => {
                connection.release() // return the connection to pool

                if (err) {
                    return resolve({ status: false });
                } else {
                    return resolve({ status: true, data: rows });
                }
            })
        });
    });
}
//------------------------------------------

// Delete all verification codes for a driver from the database
var delete_all_driver_verification_codes = (user_id) => {
    return new Promise((resolve, reject) => {
        pool.getConnection(async (err, connection) => {
            if(err) throw err
            connection.query('DELETE FROM driver_account_verification WHERE driver_id = ?;', [ user_id ], async (err, rows) => {
                connection.release() // return the connection to pool

                if (err) {
                    return resolve({ status: false });
                } else {
                    return resolve({ status: true });
                }
            })
        });
    });
}
//------------------------------------------

// Fetch all dropoff locations
var fetch_all_dropoff_locations = () => {
    return new Promise((resolve, reject) => {
        pool.getConnection(async (err, connection) => {
            if(err) throw err
            connection.query('SELECT location_id, location_name FROM drop_off_locations;', [], async (err, rows) => {
                connection.release() // return the connection to pool

                if (err) {
                    return resolve({ status: false });
                } else {
                    return resolve({ status: true, data: rows });
                }
            })
        });
    });
}
//------------------------------------------

// Fetch all available drivers
var get_all_available_drivers = () => {
    return new Promise((resolve, reject) => {
        pool.getConnection(async (err, connection) => {
            if(err) throw err
            connection.query('SELECT driver_id, driver_name, capacity, vehicle_type, rating, driver_plate_no, driver_phone_no, profile_image FROM driver_account_details WHERE vehicle_type = ? AND capacity > 0 AND driver_status = 1;', [ 'keke' ], async (err, rows) => {
                connection.release() // return the connection to pool

                if (err) {
                    return resolve({ status: false });
                } else {
                    return resolve({ status: true, data: rows });
                }
            })
        });
    });
}
//------------------------------------------

// Search for dropoff locations
var search_dropoff_location = (search) => {
    return new Promise((resolve, reject) => {
        pool.getConnection(async (err, connection) => {
            if(err) throw err
            connection.query('SELECT location_id, location_name FROM drop_off_locations WHERE location_name LIKE ?', [ '%' + search + '%' ], async (err, rows) => {
                connection.release() // return the connection to pool

                if (err) {
                    return resolve({ status: false });
                } else {
                    return resolve({ status: true, data: rows });
                }
            })
        });
    });
}
//------------------------------------------

// Search for dropoff locations by ID in the database
var search_dropoff_location_by_id = (id) => {
    return new Promise((resolve, reject) => {
        pool.getConnection(async (err, connection) => {
            if(err) throw err
            connection.query('SELECT * FROM drop_off_locations WHERE location_id = ?;', [ id ], async (err, rows) => {
                connection.release() // return the connection to pool

                if (err) {
                    return resolve({ status: false });
                } else {
                    return resolve({ status: true, data: rows });
                }
            })
        });
    });
}
//------------------------------------------

// Check if a particular driver exists in the database
var check_if_driver_exists = (driver_id) => {
    return new Promise((resolve, reject) => {
        pool.getConnection(async (err, connection) => {
            if(err) throw err
            connection.query('SELECT * FROM driver_account_details WHERE driver_id = ?;', [ driver_id ], async (err, rows) => {
                connection.release() // return the connection to pool

                if (err) {
                    return resolve({ status: false });
                } else {
                    return resolve({ status: true, data: rows });
                }
            })
        });
    });
}
//------------------------------------------

// Save the student card details in the database
var save_student_card_details = (user_id, card_no, exp_date, cvv, card_type) => {
    return new Promise((resolve, reject) => {
        pool.getConnection(async (err, connection) => {
            if(err) throw err
            connection.query('INSERT INTO student_card_details(student_id, card_number, expiry_date, cvv, card_type) VALUES(?, ?, ?, ?, ?)', [ user_id, card_no, exp_date, cvv, card_type ], async (err, rows) => {
                connection.release() // return the connection to pool

                if (err) {
                    return resolve({ status: false });
                } else {
                    return resolve({ status: true });
                }
            })
        });
    });
}
//------------------------------------------

// Create keke ride for student in the database
var create_keke_ride = (user_id, driver_id, current_location, destination, drive_type, student_notification_state, driver_notification_state, student_reason_for_notification, driver_reason_for_notification) => {
    return new Promise((resolve, reject) => {
        pool.getConnection(async (err, connection) => {
            if(err) throw err
            connection.query('INSERT INTO transport_rides(ride_booker, payment_status, driver_for_ride, student_current_location, student_destination, drive_type, ride_status, student_notification_state, driver_notification_state, student_reason_for_notification, driver_reason_for_notification, ride_booked_at) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())', [ user_id, 0, driver_id, current_location, destination, drive_type, 0, student_notification_state, driver_notification_state, student_reason_for_notification, driver_reason_for_notification ], async (err, rows) => {
                connection.release() // return the connection to pool

                if (err) {
                    return resolve({ status: false });
                } else {
                    return resolve({ status: true });
                }
            })
        });
    });
}
//------------------------------------------

// Check if a student added his/her card details in the database
var check_if_student_added_card_details = (student_id) => {
    return new Promise((resolve, reject) => {
        pool.getConnection(async (err, connection) => {
            if(err) throw err
            connection.query('SELECT * FROM student_card_details WHERE student_id = ?;', [ student_id ], async (err, rows) => {
                connection.release() // return the connection to pool

                if (err) {
                    return resolve({ status: false });
                } else {
                    return resolve({ status: true, data: rows });
                }
            })
        });
    });
}
//------------------------------------------

// Check if a particular card number exists in the database
var check_if_student_card_no_exists = (card_no) => {
    return new Promise((resolve, reject) => {
        pool.getConnection(async (err, connection) => {
            if(err) throw err
            connection.query('SELECT * FROM student_card_details WHERE card_number = ?;', [ card_no ], async (err, rows) => {
                connection.release() // return the connection to pool

                if (err) {
                    return resolve({ status: false });
                } else {
                    return resolve({ status: true, data: rows });
                }
            })
        });
    });
}
//------------------------------------------

// Update driver account balance in the database
var update_driver_account_balance_and_vehicle_capacity = (account_balance, driver_id, capacity) => {
    return new Promise((resolve, reject) => {
        pool.getConnection(async (err, connection) => {
            if(err) throw err
            connection.query('UPDATE driver_account_details SET account_balance = ?, capacity = ? WHERE driver_id = ?;', [ account_balance, capacity, driver_id ], async (err, rows) => {
                connection.release() // return the connection to pool

                if (err) {
                    return resolve({ status: false });
                } else {
                    return resolve({ status: true });
                }
            })
        });
    });
}
//------------------------------------------

// Update driver account balance in the database
var check_if_student_ride_is_pending = (student_id) => {
    return new Promise((resolve, reject) => {
        pool.getConnection(async (err, connection) => {
            if(err) throw err
            connection.query('SELECT * FROM transport_rides WHERE ride_booker = ? AND ride_status = 0 OR ride_status = 1;', [ student_id ], async (err, rows) => {
                connection.release() // return the connection to pool

                if (err) {
                    return resolve({ status: false });
                } else {
                    return resolve({ status: true, data: rows });
                }
            })
        });
    });
}
//------------------------------------------

// Check if a particular driver is available in the database
var check_if_driver_is_available = (driver_id) => {
    return new Promise((resolve, reject) => {
        pool.getConnection(async (err, connection) => {
            if(err) throw err
            connection.query('SELECT * FROM driver_account_details WHERE driver_id = ? AND driver_status = 1 AND vehicle_type = ?;', [ driver_id, 'keke' ], async (err, rows) => {
                connection.release() // return the connection to pool

                if (err) {
                    return resolve({ status: false });
                } else {
                    return resolve({ status: true, data: rows });
                }
            })
        });
    });
}
//------------------------------------------

// Check if a particular ride exists in the database
var check_if_ride_exists = (transport_ride_id, driver_id) => {
    return new Promise((resolve, reject) => {
        pool.getConnection(async (err, connection) => {
            if(err) throw err
            connection.query('SELECT * FROM transport_rides WHERE transport_ride_id  = ? AND driver_for_ride = ?;', [ transport_ride_id, driver_id ], async (err, rows) => {
                connection.release() // return the connection to pool

                if (err) {
                    return resolve({ status: false });
                } else {
                    return resolve({ status: true, data: rows });
                }
            })
        });
    });
}
//------------------------------------------

// Check if a particular ride has not started in the database
var check_if_ride_has_not_started = (transport_ride_id) => {
    return new Promise((resolve, reject) => {
        pool.getConnection(async (err, connection) => {
            if(err) throw err
            connection.query('SELECT * FROM transport_rides WHERE transport_ride_id  = ? AND ride_status = 0;', [ transport_ride_id ], async (err, rows) => {
                connection.release() // return the connection to pool

                if (err) {
                    return resolve({ status: false });
                } else {
                    return resolve({ status: true, data: rows });
                }
            })
        });
    });
}
//------------------------------------------

// Update the status of a ride in the database
var update_status_of_ride = (transport_ride_id, status, student_notification_state, driver_notification_state, student_reason_for_notification, driver_reason_for_notification) => {
    return new Promise((resolve, reject) => {
        pool.getConnection(async (err, connection) => {
            if(err) throw err
            connection.query('UPDATE transport_rides SET ride_status = ?, student_notification_state = ?, driver_notification_state = ?, student_reason_for_notification = ?, driver_reason_for_notification = ? WHERE transport_ride_id  = ?;', [ status, student_notification_state, driver_notification_state, student_reason_for_notification, driver_reason_for_notification, transport_ride_id ], async (err, rows) => {
                connection.release() // return the connection to pool

                if (err) {
                    return resolve({ status: false });
                } else {
                    return resolve({ status: true });
                }
            })
        });
    });
}
//------------------------------------------

// Check if a particular ride has not started or has started in the database
var check_if_ride_has_not_started_or_has_started = (transport_ride_id) => {
    return new Promise((resolve, reject) => {
        pool.getConnection(async (err, connection) => {
            if(err) throw err
            connection.query('SELECT * FROM transport_rides WHERE transport_ride_id  = ? AND ride_status = 0 OR ride_status = 1;', [ transport_ride_id ], async (err, rows) => {
                connection.release() // return the connection to pool

                if (err) {
                    return resolve({ status: false });
                } else {
                    return resolve({ status: true, data: rows });
                }
            })
        });
    });
}
//------------------------------------------

// Check if a particular driver is available in the database
var check_if_ambulance_driver_is_available = (driver_id) => {
    return new Promise((resolve, reject) => {
        pool.getConnection(async (err, connection) => {
            if(err) throw err
            connection.query('SELECT * FROM driver_account_details WHERE driver_id = ? AND driver_status = 1 AND vehicle_type = ?;', [ driver_id, 'ambulance' ], async (err, rows) => {
                connection.release() // return the connection to pool

                if (err) {
                    return resolve({ status: false });
                } else {
                    return resolve({ status: true, data: rows });
                }
            })
        });
    });
}
//------------------------------------------

// Create ambulance ride for student in the database
var create_ambulance_ride = (user_id, driver_id, current_location, destination, drive_type, emerg_desc, vic_name, stu_amb_state, student_notification_state, driver_notification_state, student_reason_for_notification, driver_reason_for_notification) => {
    return new Promise((resolve, reject) => {
        pool.getConnection(async (err, connection) => {
            if(err) throw err
            connection.query('INSERT INTO transport_rides(ride_booker, payment_status, driver_for_ride, student_current_location, student_destination, drive_type, ride_status, emergency_description, victim_name, student_ambulance_state, student_notification_state, driver_notification_state, student_reason_for_notification, driver_reason_for_notification, ride_booked_at) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())', [ user_id, 1, driver_id, current_location, destination, drive_type, 0, emerg_desc, vic_name, stu_amb_state, student_notification_state, driver_notification_state, student_reason_for_notification, driver_reason_for_notification ], async (err, rows) => {
                connection.release() // return the connection to pool

                if (err) {
                    return resolve({ status: false });
                } else {
                    return resolve({ status: true });
                }
            })
        });
    });
}
//------------------------------------------

// Check a student by ID in the database
var check_student_by_id = (user_id) => {
    return new Promise((resolve, reject) => {
        pool.getConnection(async (err, connection) => {
            if(err) throw err
            connection.query('SELECT * FROM student_account_details WHERE student_id = ?;', [ user_id ], async (err, rows) => {
                connection.release() // return the connection to pool

                if (err) {
                    return resolve({ status: false });
                } else {
                    return resolve({ status: true, data: rows });
                }
            })
        });
    });
}
//------------------------------------------

// Get available ambulance driver in the database
var get_available_ambulance_driver = () => {
    return new Promise((resolve, reject) => {
        pool.getConnection(async (err, connection) => {
            if(err) throw err
            connection.query('SELECT * FROM driver_account_details WHERE driver_status = 1 AND vehicle_type = ? ORDER BY RAND() LIMIT 1;', [ 'ambulance' ], async (err, rows) => {
                connection.release() // return the connection to pool

                if (err) {
                    return resolve({ status: false });
                } else {
                    return resolve({ status: true, data: rows });
                }
            })
        });
    });
}
//------------------------------------------

// Check if a particular ride exists in the database
var check_if_ride_exists2 = (transport_ride_id, student_id) => {
    return new Promise((resolve, reject) => {
        pool.getConnection(async (err, connection) => {
            if(err) throw err
            connection.query('SELECT * FROM transport_rides WHERE transport_ride_id  = ? AND ride_booker = ?;', [ transport_ride_id, student_id ], async (err, rows) => {
                connection.release() // return the connection to pool

                if (err) {
                    return resolve({ status: false });
                } else {
                    return resolve({ status: true, data: rows });
                }
            })
        });
    });
}
//------------------------------------------

// Check for available student notification in the database
var check_for_available_student_notification = (student_id) => {
    return new Promise((resolve, reject) => {
        pool.getConnection(async (err, connection) => {
            if(err) throw err
            connection.query('SELECT * FROM transport_rides WHERE ride_booker = ? AND student_notification_state = ?;', [ student_id, 1 ], async (err, rows) => {
                connection.release() // return the connection to pool

                if (err) {
                    return resolve({ status: false });
                } else {
                    return resolve({ status: true, data: rows });
                }
            })
        });
    });
}
//------------------------------------------

// Check for available driver notification in the database
var check_for_available_driver_notification = (driver_id) => {
    return new Promise((resolve, reject) => {
        pool.getConnection(async (err, connection) => {
            if(err) throw err
            connection.query('SELECT * FROM transport_rides WHERE driver_for_ride = ? AND driver_notification_state = ?;', [ driver_id, 1 ], async (err, rows) => {
                connection.release() // return the connection to pool

                if (err) {
                    return resolve({ status: false });
                } else {
                    return resolve({ status: true, data: rows });
                }
            })
        });
    });
}
//------------------------------------------

// Get all student available rides in the database
var get_all_student_available_rides = (student_id) => {
    return new Promise((resolve, reject) => {
        pool.getConnection(async (err, connection) => {
            if(err) throw err
            connection.query('SELECT * FROM transport_rides WHERE ride_booker = ? ORDER BY transport_ride_id DESC;', [ student_id ], async (err, rows) => {
                connection.release() // return the connection to pool

                if (err) {
                    return resolve({ status: false });
                } else {
                    return resolve({ status: true, data: rows });
                }
            })
        });
    });
}
//------------------------------------------

// Update all student rides in the database
var update_all_student_rides = (student_id) => {
    return new Promise((resolve, reject) => {
        pool.getConnection(async (err, connection) => {
            if(err) throw err
            connection.query('UPDATE transport_rides SET student_notification_state = ?, student_reason_for_notification = ? WHERE ride_booker = ?;', [ 0, 4, student_id ], async (err, rows) => {
                connection.release() // return the connection to pool

                if (err) {
                    return resolve({ status: false });
                } else {
                    return resolve({ status: true, data: rows });
                }
            })
        });
    });
}
//------------------------------------------

// Get all driver available rides in the database
var get_all_driver_available_rides = (driver_id) => {
    return new Promise((resolve, reject) => {
        pool.getConnection(async (err, connection) => {
            if(err) throw err
            connection.query('SELECT * FROM transport_rides WHERE driver_for_ride = ? ORDER BY transport_ride_id DESC;', [ driver_id ], async (err, rows) => {
                connection.release() // return the connection to pool

                if (err) {
                    console.log(err);
                    return resolve({ status: false });
                } else {
                    return resolve({ status: true, data: rows });
                }
            })
        });
    });
}
//------------------------------------------

// Update all driver rides in the database
var update_all_driver_rides = (driver_id) => {
    return new Promise((resolve, reject) => {
        pool.getConnection(async (err, connection) => {
            if(err) throw err
            connection.query('UPDATE transport_rides SET driver_notification_state = ?, driver_reason_for_notification = ? WHERE driver_for_ride = ?;', [ 0, 4, driver_id ], async (err, rows) => {
                connection.release() // return the connection to pool

                if (err) {
                    return resolve({ status: false });
                } else {
                    return resolve({ status: true, data: rows });
                }
            })
        });
    });
}
//------------------------------------------

// Export all the functions above
module.exports = {
    fetch_student_hostels,
    check_student_email,
    get_all_student_passwords,
    create_new_student_account,
    delete_student_account,
    update_student_report_url,
    store_student_verification_code,
    check_student_verification_code,
    delete_student_verification_code,
    verify_student_account,
    check_if_student_is_not_verified,
    delete_all_student_verification_codes,
    check_student_phone_no,
    check_driver_phone_no,
    get_all_driver_passwords,
    create_new_driver_account,
    delete_driver_account,
    update_driver_report_url,
    store_driver_verification_code,
    check_driver_verification_code,
    delete_driver_verification_code,
    verify_driver_account,
    get_all_student_details,
    get_all_driver_details,
    check_if_driver_is_not_verified,
    delete_all_driver_verification_codes,
    fetch_all_dropoff_locations,
    get_all_available_drivers,
    search_dropoff_location,
    search_dropoff_location_by_id,
    check_if_driver_exists,
    save_student_card_details,
    create_keke_ride,
    check_if_student_added_card_details,
    check_if_student_card_no_exists,
    update_driver_account_balance_and_vehicle_capacity,
    check_if_student_ride_is_pending,
    check_if_driver_is_available,
    check_if_ride_exists,
    check_if_ride_has_not_started,
    update_status_of_ride,
    check_if_ride_has_not_started_or_has_started,
    check_if_ambulance_driver_is_available,
    create_ambulance_ride,
    check_student_by_id,
    get_available_ambulance_driver,
    check_if_ride_exists2,
    check_for_available_student_notification,
    check_for_available_driver_notification,
    get_all_student_available_rides,
    update_all_student_rides,
    get_all_driver_available_rides,
    update_all_driver_rides
}
//----------------------------------