const transporter = require('../mail_configuration/mail_config'); // Import transporter for mail config

// Mail sending service utility
let mail_service = (mail_type, reciever_address, subject_title, plain_mail_text, verification_code, user_name) => {
    var email_sender_address = 'babtransit@gmail.com';

    if (mail_type === 'plain_mail'){
        const mailData = {
            from: email_sender_address, //Sender address
            to: reciever_address, //Reciever address
            subject: `${subject_title} | Babcock-Transit`, //Subject of mail
            text: plain_mail_text, //Plain mail text
            html: `
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta http-equiv="X-UA-Compatible" content="IE=edge">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>${subject_title}</title>                                      
                </head>
                <body>
                    <p>Hello ${user_name}, Your verification code is ${verification_code}</p>
                </body>
                </html>
            `
        }

        transporter.sendMail(mailData)
            .then(info => {
                console.log(info);
            })
            .catch(err => {
                console.log(err);
            });
    } 
}
//-----------------------------------------------

module.exports = mail_service;