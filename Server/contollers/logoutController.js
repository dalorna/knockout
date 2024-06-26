const User = require('../model/User');

const handleLogout = async (req, res) => {
    // On client, also delete the accessToken
    const cookies = req.cookies;
    if (!cookies?.jwt) {
        return res.sendStatus(204); // successful no content
    }
    const refreshToken = cookies.jwt;

    //Is refreshToken in the db?
    const foundUser = await User.findOne({refreshToken}).exec();
    if (!foundUser) {
        res.clearCookie('jwt', {httpOnly: true, sameSite: 'None', secure: true});
        return res.sendStatus(204);
    }

    //Delete refresh token in the database
    foundUser.refreshToken = null;
    await foundUser.save();
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });// secure: true - only serves on https
    res.sendStatus(204);
}

module.exports = { handleLogout }