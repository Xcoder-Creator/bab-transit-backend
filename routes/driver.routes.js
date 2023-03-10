const express = require('express'); // Import express
const router = express.Router(); // Use express router object
const cors = require('cors'); // Import cors module
const multer = require('multer'); // Import multer module

// Set up folder that multer can use to upload files to
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})
//-----------------------------------------

// Set up multer with options to prepare for file upload
const upload = multer({ storage: storage, limits: { fileSize: 5000000 }, fileFilter: (req, file, callback) => {
    const allowedMimes = ['image/jpeg', 'image/png', 'application/pdf'];

    if (allowedMimes.includes(file.mimetype)) {
      callback(null, true);
    } else {
      callback(new Error('Invalid file type'));
    }
  } 
})
//------------------------------------------------

// Import the required controllers
const register_controller = require('../controllers/driver_controllers/register_driver.controller');
const verify_account_controller = require('../controllers/driver_controllers/verify_driver_account.controller');
const generate_new_verif_code_controller = require('../controllers/driver_controllers/generate_new_verif_code.controller');
const driver_login_controller = require('../controllers/driver_controllers/driver_login.controller');
const auth_process_controller = require('../controllers/driver_controllers/auth_process.controller');
const modify_ride_controller = require('../controllers/driver_controllers/modify_ride.controller');
const list_all_rides_controller = require('../controllers/driver_controllers/list_all_rides.controller');
const ride_details_controller = require('../controllers/driver_controllers/ride_details.controller');
//-----------------------------------------

// Register account POST handler
router.post('/register', upload.single('file'), register_controller);

// Verify account POST handler
router.post('/verify-account', verify_account_controller);

// Generate new verification code POST handler
router.post('/generate-new-verification-code', generate_new_verif_code_controller);

// Account login POST handler
router.post('/login', driver_login_controller);

// Authentication process POST handler
router.options('/auth-process', cors()); // Enable cors
router.post('/auth-process', cors(), auth_process_controller);

// Modify ride POST handler
router.options('/modify-ride', cors()); // Enable cors
router.post('/modify-ride', cors(), modify_ride_controller);

// List all rides POST handler
router.options('/list-all-rides', cors());
router.post('/list-all-rides', cors(), list_all_rides_controller);

// Ride details POST handler
router.options('/ride-details', cors());
router.post('/ride-details', cors(), ride_details_controller);

module.exports = router;