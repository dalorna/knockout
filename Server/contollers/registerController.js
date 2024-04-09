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
        const result = await User.create({
            'username': user,
            'password': hashedPwd,
            'firstName': firstName,
            'lastName': lastName,
            'email': email
        });

        // 'roles': { 'User': 2001, 'Editor': 1984, 'Admin': 5150}
        console.log('create user result: ', result);
        res.status(201).json({'message': `New user ${user} created!`});
    } catch (err) {
        res.status(500).json({'message' : err.message})
    }
}

module.exports = { handleNewUser }