const User = require('../model/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const handleLogin = async (req, res) => {
    const { user, pwd } = req.body;
    if (!user || !pwd) {
        return res.status(400).json({'message' : `Username and password are required`});
    }
    try {
        const foundUser = await User.findOne({username: user}).exec();
        if (!foundUser) {
            res.statusMessage = 'user not found';
            return res.sendStatus(401); //Unauthorized
        }
        // evaluate password
        const match = await bcrypt.compare(pwd, foundUser.password);
        if (match) {
            const roles = Object.values(foundUser.roles).filter(Boolean);
            const leagueIds = foundUser.leagues?.map(m => m.leagueId) ?? [];
            // create JWTs (token and refresh token)
            const accessToken = jwt.sign(
                {
                    "UserInfo": {
                        "username": foundUser.username,
                        "roles": roles,
                        "leagueIds": leagueIds
                    }
                },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '1d'}
            );
            const refreshToken = jwt.sign(
                {'username': foundUser.username},
                process.env.REFRESH_TOKEN_SECRET,
                { expiresIn: '1d'}
            );
            // Saving Refresh Token with current user
            foundUser.refreshToken = refreshToken;
            await foundUser.save();

            res.cookie('jwt', refreshToken, { httpOnly: true, sameSite: 'None', secure: true, maxAge: 24 * 60 * 60 * 1000});
            res.status(200).json({
                userInfo: {
                    firstName: foundUser.firstName,
                    lastName: foundUser.lastName,
                    email: foundUser.email,
                    id: foundUser.id
                },
                roles,
                leagueIds,
                accessToken });
        } else {
            res.sendStatus(401);
        }
    } catch (err) {
        return res.status(500).json({'message' : `Failed Login`});
    }

}

const handleGetUser = async (req, res) => {
    const userId = req.query.id;
    if (!userId) {
        return res.status(400).json({'message' : `User Id is required`});
    }
    try {
        const foundUser = await User.findOne({_id: userId}).exec();
        if (!foundUser) {
            return res.sendStatus(401); //Unauthorized
        }

        // create JWTs (token and refresh token)
        const refreshToken = jwt.sign(
            {'username': foundUser.username},
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '1d'}
        );
        // Saving Refresh Token with current user
        foundUser.refreshToken = refreshToken;

        res.cookie('jwt', refreshToken, { httpOnly: true, sameSite: 'None', secure: true, maxAge: 24 * 60 * 60 * 1000});
        res.status(200).json({
                firstName: foundUser.firstName,
                lastName: foundUser.lastName,
                email: foundUser.email,
                id: foundUser.id
            });

    } catch (e) {
        res.status(500).json({"message": `Server error attempting to get\r ${err.me}`})
    }
}

module.exports = { handleLogin, handleGetUser };