const nodemailer = require('nodemailer');
const Email_Transport = require('../config/emailTransport');

const emailSend = async (req, res) => {
    const transporter = nodemailer.createTransport({
        service: Email_Transport.service,
        auth: {
            user: Email_Transport.auth.user,
            pass: Email_Transport.auth.pass
        }
    });

    const mailOptions = {
        from: Email_Transport.auth.user,
        to: req.body.to,
        subject: req.body.subject,
        html: req.body.html
    }

    try {
        await transporter.sendMail(mailOptions, function(error, info) {
            if (error) {
                res.statusText = 'Failed to send text';
                res.sendStatus(500).json({"message": "Server error attempting to send email"})
            } else {
                return res.statusMessage = 'Email sent: ' + info.response;
            }
        });
        res.sendStatus(200);
    } catch (err) {
        return res.sendStatus(500).json({"message": "Server error attempting to send email. End."})
    }
}
module.exports = {
    emailSend
}