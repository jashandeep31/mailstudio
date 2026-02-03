import * as Sentry from "@sentry/node";
import { env } from "./lib/env.js";
Sentry.init({
  dsn: env.DSN,
  // Add Tracing by setting tracesSampleRate
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,
  // Setting this option to true will send default PII data to Sentry.
  // For example, automatic IP address collection on events
  sendDefaultPii: true,
});
