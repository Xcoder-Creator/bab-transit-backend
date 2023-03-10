const db_query = require('../models/db_model'); // Import db model
const jwt = require('jsonwebtoken'); // Import jwt module
const Cryptr = require('cryptr'); // Import cryptr module
const cryptr = new Cryptr(process.env.PASSWORD_ENCRYPT_DECRYPT_KEY, { pbkdf2Iterations: 10000, saltLength: 10 }); // Get encryption/descryption key for cryptr module

const driver_event = async (auth_token) => {
    return new Promise(async (resolve, reject) => {
      if (auth_token == null || auth_token == undefined){
          resolve({ status: false });
      } else {
          let decrypted_auth_token;
          let check = true;

          try {
              decrypted_auth_token = cryptr.decrypt(auth_token);
          } catch (error) {
              check = false;
          }

          if (check === true){
            try {
              const user = await jwt.verify(decrypted_auth_token, process.env.AUTH_TOKEN_SECRET);
              const driver_id = user.user_id;

              const result1 = await db_query.get_all_driver_details(driver_id);

              if (result1.status === false){
                  resolve({ status: false });
              } else if (result1.status === true){
                  if (result1.data.length > 0 && result1.data.length === 1){
                      const result2 = await db_query.check_for_available_driver_notification(driver_id);

                      if (result2.status === false){
                          resolve({ status: false });
                      } else if (result2.status === true){
                          if (result2.data.length > 0){
                              const new_notifications = result2.data.length;

                              resolve({ status: true, new_notifications: new_notifications });
                          } else {
                              resolve({ status: false });
                          }
                      }
                  } else {
                      resolve({ status: false });
                  }
              }
            } catch (err) {
              resolve({ status: false });
            }
          } else {
              resolve({ status: false });
          }
      }
    });
}

module.exports = driver_event;