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
        from: req.body.from,
        to: req.body.to,
        subject: req.body.subject,
        html: req.body.html
    }

    try {
        await transporter.sendMail(mailOptions, function(error, info) {
            if (error) {
                console.log(error);
                res.status(500).json({"message": "Server error attempting to send email"})
            } else {
                res.statusMessage = 'Email sent: ' + info.response;
            }
        })
        return res.status(200).end();
    } catch (err) {
        return res.status(500).json({"message": "Server error attempting to send email. End."})
    }
}
module.exports = {
    emailSend
}