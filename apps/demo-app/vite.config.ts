import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import basicSsl from '@vitejs/plugin-basic-ssl';

export default defineConfig(({ mode }) => {
  // Load VITE_* env vars from .env files so they are available at build time.
  // Using a static JSON object for process.env instead of 'import.meta.env' because
  // Vite only statically replaces import.meta.env.PROP (static access) in production builds.
  // Dynamic access like import.meta.env[key] leaves import.meta.env undefined at runtime.
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [
      basicSsl(),
      react({
        babel: {
          plugins: [['babel-plugin-react-compiler']],
        },
        // Don't run Babel on pre-compiled CJS lib output from workspace packages.
        // The React compiler can add ESM imports to CJS files, producing a mixed
        // ESM+CJS module that @rollup/plugin-commonjs skips — leaving raw `exports`
        // in the bundle and causing "exports is not defined" at runtime in production.
        exclude: [/node_modules/, /\/packages\/[^/]+\/lib\//],
      }),
    ],
    define: {
      'process.env': JSON.stringify(env),
    },
    server: {
      port: Number(process.env['PORT']) || 17200,
    },
    preview: {
      port: Number(process.env['PORT']) || 17200,
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
      // ml-web uses new Worker(new URL(..., import.meta.url)) to spawn the OCR worker.
      // Vite's native bundler handles that pattern correctly; esbuild (used for pre-bundling)
      // does not — the worker URL ends up inside the esbuild chunk instead of pointing at
      // the actual worker file. Excluding ml-web lets Vite process it natively.
      exclude: ['@monkvision/ml-web'],
    },
    worker: {
      plugins: () => [
        {
          name: 'ort-wasm-cdn-only',
          transform(code: string, id: string) {
            if (!id.includes('onnxruntime-web')) return null;
            // ort.bundle.min.mjs references ort-wasm-simd-threaded.jsep.wasm via
            // new URL(..., import.meta.url), causing Vite to emit the 27 MB JSEP (WebGPU) WASM.
            // We use CPU inference with wasmPaths pointing to the jsDelivr CDN, so this local
            // asset is never fetched at runtime. Strip the pattern to suppress the asset emit.
            return {
              code: code.replace(
                /new URL\("ort-wasm-simd-threaded\.jsep\.wasm",import\.meta\.url\)/g,
                '"__wasm_cdn__"',
              ),
              map: null,
            };
          },
        },
      ],
    },
    build: {
      outDir: 'build',
      commonjsOptions: {
        include: [/node_modules/, /packages/],
      },
      rollupOptions: {
        output: {
          manualChunks: (id): string | undefined => {
            // Stable vendor chunks — long cache TTL, rarely invalidated by app changes
            if (id.includes('@sentry')) return 'vendor-sentry';
            if (id.match(/node_modules\/(react|react-dom|scheduler)\//)) return 'vendor-react';
            if (id.match(/node_modules\/(i18next|react-i18next)\//)) return 'vendor-i18n';
            // Large MonkVision data chunk — SVG overlays for every sight, stable across releases.
            // Match both the npm name and the resolved workspace symlink path.
            if (id.includes('@monkvision/sights') || id.includes('/packages/sights/')) return 'monk-sights';
            return undefined;
          },
        },
      },
    },
  };
});
