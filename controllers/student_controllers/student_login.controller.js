const bcrypt = require('bcrypt'); // Import bcrypt module
const db_query = require('../../models/db_model'); // Import db model
const sanitize_data = require('../../utility/sanitize_data.util'); // Import sanitize data
const response_headers = require('../../utility/response_headers.util'); // Import response headers
const generate_access_token = require('../../utility/generate_access_token.util'); // Import generate access token
const gen_code = require('../../utility/verification_code_gen.util'); // Import gen code
const mail_service = require('../../utility/mail_service.util'); // Import mail service
const Cryptr = require('cryptr'); // Import cryptr module
const cryptr = new Cryptr(process.env.PASSWORD_ENCRYPT_DECRYPT_KEY, { pbkdf2Iterations: 10000, saltLength: 10 }); // Get encryption/descryption key for cryptr module
const yup = require('yup');

const loginSchema = yup.object().shape({
    phone_no: yup.string().required().test(
        'is-only-white-spaces',
        'String must not contain only white spaces',
        value => !(/^\s*$/).test(value || '')
    ),
    password: yup.string().required().test(
        'is-only-white-spaces',
        'String must not contain only white spaces',
        value => !(/^\s*$/).test(value || '')
    )
});  

const login = async (req, res) => {
    response_headers(res); // Response headers

    // Validate the request form body data
    if (req.body){
        let form_data = req.body; // Form data from the frontend

        // Check if the appropriate request parameters are set
        if (form_data.phone_no && form_data.password){

            const data = {
                phone_no: form_data.phone_no,
                password: form_data.password,
            };

            loginSchema.validate(data)
                .then((validatedUser) => {
                    // Variables to hold form data individually and remove any quotes contained in them from left to right
                    // and also remove leading and trailing whitespaces
                    var user_phone_no = sanitize_data(data.phone_no);
                    var user_password = sanitize_data(data.password);
                    //-------------------------------------------------------------------

                    var login_process = async () => {
                        let result1 = await db_query.check_student_phone_no(user_phone_no);

                        if (result1.status === false){
                            res.statusCode = 400;
                            res.json({ err_msg: 'An error just occured, Try again later', result: null, succ_msg: null, res_code: 400 });
                        } else if (result1.status === true){
                            if (result1.data.length > 0 && result1.data.length === 1){
                                let student_id = result1.data[0].student_id;
                                let user_email = result1.data[0].student_email;
                                let user_name = result1.data[0].student_name;

                                if (result1.data[0].verification_status	=== 0){
                                    let result1x = await db_query.delete_all_student_verification_codes(student_id);

                                    if (result1x.status === false){
                                        res.statusCode = 400;
                                        res.json({ err_msg: 'An error just occured, Try again later', result: null, succ_msg: null, res_code: 400 }); 
                                    } else if (result1x.status === true){
                                        let verification_code = gen_code(6);

                                        let verif_token = generate_access_token(student_id, 'verification_code', 300);

                                        let result2 = await db_query.store_student_verification_code(student_id, verification_code, verif_token);

                                        if (result2.status === false){
                                            res.statusCode = 400;
                                            res.json({ err_msg: 'An error just occured, Try again later', result: null, succ_msg: null, res_code: 400 });
                                        } else if (result2.status === true){
                                            mail_service('plain_mail', user_email, 'Account Verification', `Your verification code is ${verification_code}`, verification_code, user_name); // Send mail

                                            res.statusCode = 400;
                                            res.json({ err_msg: 'Can\'t login, please verify your account first', result: { user_id: student_id }, succ_msg: null, res_code: 315 });
                                        }
                                    }
                                } else if (result1.data[0].verification_status === 1){
                                    let user_name = result1.data[0].student_name;
                                    let profile_image = result1.data[0].profile_image;
                                    let student_id = result1.data[0].student_id;
                                    let hashed_password_from_db = result1.data[0].student_password;

                                    let compare_passwords = bcrypt.compareSync(user_password, hashed_password_from_db);

                                    if (compare_passwords === true){
                                        let encrypted_access_token = cryptr.encrypt(generate_access_token(student_id, 'user_account', null));

                                        res.statusCode = 200;
                                        res.json({ err_msg: null, result: { auth_token: encrypted_access_token, user_data: { name: user_name, profile_image: profile_image } }, succ_msg: 'Login successfull', res_code: 200 }); 
                                    } else {
                                        res.statusCode = 400;
                                        res.json({ err_msg: 'Wrong password', result: null, succ_msg: null, res_code: 400 }); 
                                    }
                                }
                            } else {
                                res.statusCode = 400;
                                res.json({ err_msg: 'Wrong phone number', result: null, succ_msg: null, res_code: 400 });
                            }
                        }
                    }

                    login_process();
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

module.exports = login;