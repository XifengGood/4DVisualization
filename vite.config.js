// vite.config.js
import { resolve } from 'path';
import { defineConfig } from 'vite';
export default defineConfig({
    base: '/4DVisualization/',
    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
                intersect: resolve(__dirname, 'draw/intersect/geometry-browser.html'),
                projection: resolve(__dirname, 'draw/projection/geometry-browser.html'),
                marching: resolve(__dirname, 'draw/ray-marching/geometry-browser.html'),
            },
        },
    },
});
