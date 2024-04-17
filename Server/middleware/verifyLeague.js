const verifyLeague = () => {
    return(req, res, next) => {
        if (!req?.leagueId) {
            return res.sendStatus(500);
        } else if (!req?.body?.id) {
            return res.sendStatus(400);
        }

        const result = req.leagueId.includes(l => l === req.body.id);

        if (!result) {
            return res.sendStatus(401);
        }
        next();
    }
}

module.exports = verifyLeague;