const nodemailer = require('nodemailer');
const Email_Transport = require('../config/emailTransport');
const User = require('../model/User');

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
        subject: 'Password Recovery',
        html: recoveryHTML(req.body.code)
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

const usernameEmailSend = async (req, res) => {
    if (!req?.body?.to) {
        res.statusMessage = `No email found for ${req.body.to}`
        return res.status(400).json({"message": `Email is required`})
    }
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
        subject: 'Username Recovery',
        html: ''
    }

    try {

        const foundUser = await User.findOne({
            email: req.body.to
        }, null, null).exec();
        if (foundUser) {
            mailOptions.html = usernameRecoveryHTML(foundUser.username);
            await transporter.sendMail(mailOptions, function(error, info) {
                if (error) {
                    res.statusText = 'Failed to send text';
                    res.status(500).json({"message": "Server error attempting to send email"})
                } else {
                    return res.statusMessage = 'Email sent: ' + info.response;
                }
            });
            return res.sendStatus(200);
        }
        res.statusMessage = `No email found for ${req.body.to}`
        return res.sendStatus(400)
    } catch (err) {
        return res.sendStatus(500).json({"message": "Server error attempting to send email. End."})
    }
}


module.exports = {
    emailSend,
    usernameEmailSend
}

const recoveryHTML = (code) => `<div>Here's your password recovery code: ${code}</div>`
const usernameRecoveryHTML = (username) =>`<div>Here's your username: ${username}</div>`