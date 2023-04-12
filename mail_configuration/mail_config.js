const nodemailer = require('nodemailer'); // Import nodemailer module

// Configure Nodemailer to send mails
const transporter = nodemailer.createTransport({
    port: process.env.MAIL_PORT, // 587
    host: process.env.MAIL_HOST,
    secure: true, // Use SSL
    auth: {
        user: process.env.EMAIL_USERNAME, // Email username
        pass: process.env.EMAIL_PASSWORD // Email password
    },
    secure: true // Use SSL
});

module.exports = transporter; // Export the transporter variable
