import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import basicSsl from '@vitejs/plugin-basic-ssl';

const viteEnv = Object.fromEntries(
  Object.entries(process.env).filter(([key]) => key.startsWith('VITE_')),
);

export default defineConfig({
  plugins: [
    basicSsl(),
    react({
      // Workspace packages resolve to their compiled CJS output (packages/*/lib) through symlinks.
      // Running the React Compiler on them injects an ESM import, which breaks the CJS conversion.
      exclude: [/\/node_modules\//, /\/packages\/[^/]+\/lib\//],
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
  ],
  define: {
    'process.env': JSON.stringify({ ...viteEnv, NODE_ENV: process.env['NODE_ENV'] ?? 'production' }),
  },
  server: {
    port: Number(process.env['PORT']) || 17200,
  },
  preview: {
    port: Number(process.env['PORT']) || 17200,
  },
  optimizeDeps: {
    force: true,
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
