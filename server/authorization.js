const userIsLoggedIn = (req) => {
    console.log(
        'Authorization header:',
        req.headers.authorization,
        'Resten av headers:',
        req.headers
    );

    return true;
};

const cluster = process.env.NAIS_CLUSTER_NAME;

const ensureLoggedIn = (req, res, next) => {
    if (userIsLoggedIn(req)) {
        next();
    } else {
        res.redirect(`/oauth2/login?redirect=${req.originalUrl}`);
    }
};

const opprettCookieFraAuthorizationHeader = (req, res, next) => {
    const authorizationHeader = req.headers.authorization;

    if (authorizationHeader) {
        const issoIdToken = authorizationHeader?.replace('Bearer ', '');
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
