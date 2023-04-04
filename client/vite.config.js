import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react(), VitePWA({
        registerType: 'autoUpdate',
        injectRegister: 'auto',
        includeAssets: ['favicon-96x96.png', 'android-icon-192x192.png'],
        manifest: {
            name: 'Dashboard',
            short_name: 'Dashboard',
            description: 'Admin Dashboard for Sales Transactions',
            theme_color: '#000',
            icons: [{
                    src: 'android-chrome-192x192',
                    sizes: '192x192',
                    type: 'image/png'
                },
                {
                    src: 'android-chrome-512x512',
                    sizes: '512x512',
                    type: 'image/png'
                }
            ],
            // start_url: '/'
        }
    })],
});