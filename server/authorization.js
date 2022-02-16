const cluster = process.env.NAIS_CLUSTER_NAME;

const retrieveToken = (headers) => headers.authorization?.replace('Bearer ', '');

const tokenIsValid = (token) => {
    return true;
};

const userIsLoggedIn = (req) => {
    console.log(
        'Authorization header:',
        req.headers.authorization,
        'Resten av headers:',
        req.headers
    );

    const token = retrieveToken(req.headers);
    return token && tokenIsValid(token);
};

const ensureLoggedIn = (req, res, next) => {
    if (userIsLoggedIn(req)) {
        next();
    } else {
        res.redirect(`/oauth2/login?redirect=${req.originalUrl}`);
    }
};

const opprettCookieFraAuthorizationHeader = (req, res, next) => {
    const token = retrieveToken(req.headers);

    if (token) {
        const cookieDomain = cluster === 'prod-gcp' ? 'intern.nav.no' : 'dev.intern.nav.no';

        res.header(
            'Set-Cookie',
            `isso-idtoken=${issoIdToken}; Domain=${cookieDomain}; Secure; HttpOnly; SameSite=Lax;`
        );

        next();
    } else {
        res.status(500).send('Klarte ikke å opprette isso-idtoken-cookie');
    }
};

module.exports = {
    ensureLoggedIn,
    opprettCookieFraAuthorizationHeader,
};
