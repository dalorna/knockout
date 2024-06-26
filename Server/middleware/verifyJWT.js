const jwt = require('jsonwebtoken');

const verifyJWT = (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (!authHeader?.startsWith('Bearer ')) return res.sendStatus(401); // Unauthorized
    const token = authHeader.split(' ')[1];
    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        (err, decoded) => {
            if(err) {
                res.statusMessage = err.message;
                return res.sendStatus(403); // forbidden (invalid token)
            }
            req.user = decoded.UserInfo.username;
            req.roles = decoded.UserInfo.roles;
            req.leagueId = decoded.UserInfo.leagueIds ?? [];
            next();
        }
    );
}

module.exports = verifyJWT;