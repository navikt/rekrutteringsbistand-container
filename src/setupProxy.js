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

    setupProxy('/microfrontend-ressurser/statistikk', 'http://localhost:3001');
    setupProxy('/microfrontend-ressurser/stilling', 'http://localhost:3002');
};
