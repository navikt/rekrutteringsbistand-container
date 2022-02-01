const loginEndpoint = '/oauth2/login';

function ensureLoggedIn(req, res, next) {
    const erAutentisert = req.get('Authorization');

    if (erAutentisert) {
        return next();
    } else {
        res.redirect(loginEndpoint);
    }
}

module.exports = ensureLoggedIn;
