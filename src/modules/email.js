const nodemailer = require('nodemailer');

/**
 * Send email
 *
 * @param {Object} smtp
 * @param {Object} data (keys: from, to, subject, text, html)
 */
const send = (smtp, data) => {
    // Create transporter object
    let transporter = nodemailer.createTransport({
        host: smtp.host,
        port: smtp.port,
        secure: smtp.secure,
        auth: {
            user: smtp.user,
            pass: smtp.password
        }
    });

    // Send mail
    transporter.sendMail(data, (error, info) => {
        if (error) {
            console.error(error);
        }
    });
};

module.exports = {
    send,
};
