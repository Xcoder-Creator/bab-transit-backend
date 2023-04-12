const express = require('express'); // Import express
const router = express.Router(); // Use express router object
const cors = require('cors'); // Import cors module

// Import the required controllers
const register_controller = require('../controllers/student_controllers/register_student.controller');
const verify_account_controller = require('../controllers/student_controllers/verify_student_account.controller');
const generate_new_verif_code_controller = require('../controllers/student_controllers/generate_new_verif_code.controller');
const student_login_controller = require('../controllers/student_controllers/student_login.controller');
const auth_process_controller = require('../controllers/student_controllers/auth_process.controller');
const fetch_dropoff_loacations_controller = require('../controllers/student_controllers/fetch_dropoff_loacations.controller');
const get_available_drivers_controller = require('../controllers/student_controllers/get_available_drivers.controller');
const search_location_controller = require('../controllers/student_controllers/search_location.controller');
const keke_book_ride_controller = require('../controllers/student_controllers/keke_book_ride.controller');
const ambulance_book_ride_controller = require('../controllers/student_controllers/ambulance_book_ride.controller');
const cancel_ride_controller = require('../controllers/student_controllers/cancel_ride.controller');
const list_all_rides_controller = require('../controllers/student_controllers/list_all_rides.controller');
const ride_details_controller = require('../controllers/student_controllers/ride_details.controller');
//-----------------------------------------

// Register account POST handler
router.post('/register', register_controller);

// Verify account POST handler
router.post('/verify-account', verify_account_controller);

// Generate new verification code POST handler
router.post('/generate-new-verification-code', generate_new_verif_code_controller);

// Account login POST handler
router.post('/login', student_login_controller);

// Authentication process POST handler
router.options('/auth-process', cors()); // Enable cors
router.post('/auth-process', cors(), auth_process_controller);

// Fetch dropoff locations POST handler
router.options('/fetch-dropoff-locations', cors()); // Enable cors
router.post('/fetch-dropoff-locations', cors(), fetch_dropoff_loacations_controller);

// Fetch available drivers POST handler
router.options('/fetch-available-drivers', cors()); // Enable cors
router.post('/fetch-available-drivers', cors(), get_available_drivers_controller);

// Search for location POST handler
router.options('/search-location', cors());
router.post('/search-location', cors(), search_location_controller);

// Book keke ride POST handler
router.options('/book-keke-ride', cors());
router.post('/book-keke-ride', cors(), keke_book_ride_controller);

// Book ambulance ride POST handler
router.options('/book-ambulance-ride', cors());
router.post('/book-ambulance-ride', cors(), ambulance_book_ride_controller);

// Cancel ride POST handler
router.options('/cancel-ride', cors());
router.post('/cancel-ride', cors(), cancel_ride_controller);

// List all rides POST handler
router.options('/list-all-rides', cors());
router.post('/list-all-rides', cors(), list_all_rides_controller);

// Ride details POST handler
router.options('/ride-details', cors());
router.post('/ride-details', cors(), ride_details_controller);

module.exports = router;
