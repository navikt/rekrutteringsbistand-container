const jws = require('jws');

const loginserviceUrl = process.env.LOGINSERVICE_URL;

function ensureLoggedIn(req, res, next) {
    const loginToken = hentLoginTokenFraCookies(req.headers.cookie);
    if (loginToken === undefined || tokenErUtløpt(loginToken)) {
        const hostname = req.get('host');
        if (hostname.includes('localhost')) {
            return next();
        }

        const redirectUrl = `${loginserviceUrl}?redirect=https://${hostname}`;
        return res.redirect(redirectUrl);
    }

    return next();
}

function hentLoginTokenFraCookies(cookies) {
    if (cookies !== undefined) {
        const erLoginCookie = (cookie) => typeof cookie === 'string' && cookie.includes('-idtoken');
        const loginCookie = cookies.split(';').find(erLoginCookie);

        if (loginCookie) {
            return loginCookie.split('=').pop().trim();
        }
    }

    return undefined;
}

function tokenErUtløpt(token) {
    let expiration = jws.decode(token).payload.exp;
    if (expiration.toString().length === 10) {
        expiration = expiration * 1000;
    }

    return expiration - Date.now() < 0;
}

module.exports = ensureLoggedIn;
