import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { cloudflare } from "@cloudflare/vite-plugin";
// Visualizer is optional; we attempt to import it at runtime.

export default defineConfig(async ({ mode }) => {
    const env = loadEnv(mode, '.', '');
    let visualizerPlugin: any = null;
    try {
      // Dynamically import to avoid crashing when not installed
      const mod = await import('rollup-plugin-visualizer');
      visualizerPlugin = mod.visualizer({ filename: 'bundle-stats.html', template: 'treemap', gzipSize: true, brotliSize: true });
    } catch (e) {
      // Plugin not installed; skip without failing dev server
      visualizerPlugin = null;
    }
    return {
      base: './', // Use relative paths for deployment
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react(), // Generate bundle analysis at build time if available
      ...(visualizerPlugin ? [visualizerPlugin] : []), cloudflare()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      },
      assetsInclude: ['**/exam-materials/**/*.html', '**/*.pdf', '**/*.docx', '**/*.zip']
    };
});