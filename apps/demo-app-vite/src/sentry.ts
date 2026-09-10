import { SentryMonitoringAdapter } from "@monkvision/sentry";
import { getEnvOrThrow } from "@monkvision/common";

export const sentryMonitoringAdapter = new SentryMonitoringAdapter({
  dsn: getEnvOrThrow("VITE_SENTRY_DSN"),
  environment: getEnvOrThrow("VITE_ENVIRONMENT"),
  debug: process.env["VITE_SENTRY_DEBUG"] === "true",
  tracesSampleRate: 0.025,
  release: "1.0",
});
