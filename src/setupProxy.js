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

    setupProxy('/statistikk', 'http://localhost:3001');
    setupProxy('/kandidater', 'http://localhost:3002');
};
