const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = (app) => {
    const setupProxy = (path, target) => {
        app.use(
            path,
            createProxyMiddleware({
                target,
                changeOrigin: true,
            })
        );
    };

    setupProxy('/rekrutteringsbistand-statistikk', 'http://localhost:3001');
    setupProxy('/rekrutteringsbistand-stilling', 'http://localhost:3002');
    setupProxy('/rekrutteringsbistand-kandidat', 'http://localhost:3003');
    setupProxy('/rekrutteringsbistand-stillingssok', 'http://localhost:3004');
    setupProxy('/rekrutteringsbistand-jobbtreff', 'https://rekrutteringsbistand-jobbtreff.dev.intern.nav.no/');
};
