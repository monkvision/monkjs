import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import basicSsl from '@vitejs/plugin-basic-ssl';

export default defineConfig({
  plugins: [
    basicSsl(),
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
  ],
  define: {
    'process.env': 'import.meta.env',
  },
  server: {
    port: Number(process.env['PORT']) || 17201,
  },
  preview: {
    port: Number(process.env['PORT']) || 17201,
  },
  optimizeDeps: {
    include: [
      '@monkvision/sentry',
      '@monkvision/common',
      '@monkvision/monitoring',
      '@monkvision/network',
      '@monkvision/types',
      '@monkvision/analytics',
      '@monkvision/camera-web',
      '@monkvision/common-ui-web',
      '@monkvision/inspection-capture-web',
      '@monkvision/posthog',
      '@monkvision/sights',
    ],
  },
  build: {
    outDir: 'build',
    commonjsOptions: {
      include: [/node_modules/, /packages/],
    },
  },
});
