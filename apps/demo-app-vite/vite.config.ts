import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import basicSsl from "@vitejs/plugin-basic-ssl";
import path from "path";

export default defineConfig({
  plugins: [
    basicSsl(),
    react({
      babel: {
        plugins: [["babel-plugin-react-compiler"]],
      },
    }),
  ],
  resolve: {
    alias: {
      "react-router-dom": path.resolve(
        __dirname,
        "node_modules/react-router-dom"
      ),
    },
  },
  define: {
    "process.env": "import.meta.env",
  },
  server: {
    port: 17200,
  },
  optimizeDeps: {
    include: [
      "react-router-dom",
      "@monkvision/sentry",
      "@monkvision/common",
      "@monkvision/monitoring",
      "@monkvision/network",
      "@monkvision/types",
      "@monkvision/analytics",
      "@monkvision/camera-web",
      "@monkvision/common-ui-web",
      "@monkvision/inspection-capture-web",
      "@monkvision/inspection-review",
      "@monkvision/posthog",
      "@monkvision/sights",
    ],
  },
  build: {
    commonjsOptions: {
      include: [/node_modules/, /packages/],
    },
  },
});
