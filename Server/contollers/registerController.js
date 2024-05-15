const User = require('../model/User');
const bcrypt = require('bcrypt');

const handleNewUser = async (req, res) => {
    const { user, pwd, firstName, lastName, email } = req.body;
    if (!user || !pwd || !firstName || !lastName || !email) {
        return res.status(400).json({'message' : `All fields are required`});
    }
    // check for duplicate usernames in the db
    const duplicate = await User.findOne(
        {username: {'$regex': user , $options:'i'}, email: {'$regex': email , $options:'i'}}

    ).exec();
    if (duplicate) {
       return res.sendStatus(409);
    }
    try {
        //encrypt the password
        const hashedPwd = await bcrypt.hash(pwd, 10);
        // create and store the new user
        await User.create({
            'username': user,
            'password': hashedPwd,
            'firstName': firstName,
            'lastName': lastName,
            'email': email
        });

        // 'roles': { 'User': 2001, 'Editor': 1984, 'Admin': 5150}
        res.status(201).json({'message': `New user ${user} created!`});
    } catch (err) {
        res.status(500).json({'message' : err.message})
    }
}

const resetPassword = async (req, res) => {
    const { pwd, email } = req.body;
    if (!pwd || !email) {
        return res.status(400).json({'message' : `All fields are required`});
    }
    // find email sent to update the password
    const foundEmail = await User.findOne(
        {email: {'$regex': email , $options:'i'}}, null, null
    ).exec();

    try {
        //encrypt the password
        foundEmail.password = await bcrypt.hash(pwd, 10);
        const result = await foundEmail.save();
        res.status(201).json(result);
    } catch (err) {
        res.status(500).json({'message' : err.message})
    }
}

module.exports = { handleNewUser, resetPassword }