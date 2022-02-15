const userIsLoggedIn = (req) => {
    console.log(
        'Authorization header:',
        req.headers.authorization,
        'Resten av headers:',
        req.headers
    );

    return true;
};

const ensureLoggedIn = (req, res, next) => {
    if (userIsLoggedIn(req)) {
        next();
    } else {
        res.redirect(`/oauth2/login?redirect=${req.originalUrl}`);
    }
};

module.exports = ensureLoggedIn;
