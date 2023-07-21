import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

export default defineConfig({
    base: process.env.NODE_ENV !== 'production' ? '/' : '/testmq-svelte/',
    plugins: [svelte()],
    server: {
        port: 5000,
    },
});
