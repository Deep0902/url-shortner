import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      injectRegister: "auto",
      registerType: "autoUpdate",
      devOptions: {
        enabled: true,
      },
      manifest: {
        name: "ChopURL",
        short_name: "ChopURL",
        description: "A simple URL shortener app",
        theme_color: "#ffffff",
        icons: [
          {
            src: "url-short-72x72.png",
            sizes: "72x72",
            type: "image/png",
          },
          {
            src: "url-short-96x96.png",
            sizes: "96x96",
            type: "image/png",
          },
          {
            src: "url-short-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "url-short-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "url-short.svg",
            sizes: "any",
            type: "image/svg+xml",
            purpose: "any maskable",
          },
          {
            src: "close-red.svg",
            sizes: "any",
            type: "image/svg+xml",
            purpose: "any maskable",
          },
          {
            src: "close.svg",
            sizes: "any",
            type: "image/svg+xml",
            purpose: "any maskable",
          },
          {
            src: "error-toast.svg",
            sizes: "any",
            type: "image/svg+xml",
            purpose: "any maskable",
          },
          {
            src: "tick.svg",
            sizes: "any",
            type: "image/svg+xml",
            purpose: "any maskable",
          },
          {
            src: "vite.svg",
            sizes: "any",
            type: "image/svg+xml",
            purpose: "any maskable",
          },
          {
            src: "warning-toast.svg",
            sizes: "any",
            type: "image/svg+xml",
            purpose: "any maskable",
          },
        ],
      },
      // workbox: {
      //   clientsClaim: true,
      //   skipWaiting: true,
      // },
    }),
  ],
});
