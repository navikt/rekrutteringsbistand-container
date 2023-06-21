import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgrPlugin from 'vite-plugin-svgr';

export default defineConfig(({ mode }) => {
    return {
        plugins: [react(), svgrPlugin()],
        build: {
            manifest: true,
            rollupOptions: {
                external: ['./nais.js'],
            },
        },
        server: {
            port: 3000,
            proxy: {
                '/kandidatsok-proxy': 'http://localhost:3005/kandidatsok-proxy',

                '/rekrutteringsbistand-statistikk': 'http://localhost:3001',
                '/rekrutteringsbistand-stilling': 'http://localhost:3002',
                '/rekrutteringsbistand-kandidat': 'http://localhost:3003',
                '/rekrutteringsbistand-stillingssok': 'http://localhost:3004',
                '/rekrutteringsbistand-kandidatsok': 'http://localhost:3005',
            },
        },
    };
});
