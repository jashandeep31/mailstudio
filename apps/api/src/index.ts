import express from "express";
import cors from "cors";
import { env } from "./lib/env.js";
import cookiesParser from "cookie-parser";
import { createServer } from "node:http";
import { WebSocketServer } from "ws";
import { SocketHandler } from "./web-sockets/socket-handler.js";
import cookie from "cookie";
import { test } from "./test.js";
import { errorHandler } from "./middlewares/error-hanlder.js";
import { checkAllPromptFiles } from "./prompts/index.js";
import { redis } from "./lib/db.js";
import { handleDodoPaymentWebhook } from "./controllers/payments/dodo-webhook.js";
import authRoutes from "./routes/auth-routes.js";
import userRoutes from "./routes/user-routes.js";
import chatRoutes from "./routes/chat-routes.js";
import internalRoutes from "./routes/internal-routes.js";
import paymentRoutes from "./routes/payment-routes.js";
import utilRoutes from "./routes/util-routes.js";
import brandKitRoutes from "./routes/brandkit-routes.js";
import marketplaceRoutes from "./routes/marketplace-routes.js";
import client from "prom-client";

// 1️⃣ Collect default Node.js metrics (CPU, memory, event loop)
client.collectDefaultMetrics();

// 2️⃣ Create HTTP request timer
const httpDuration = new client.Histogram({
  name: "http_request_duration_seconds",
  help: "Time taken by API requests",
  labelNames: ["method", "route", "status"],
  buckets: [0.1, 0.3, 0.5, 1, 2, 5],
});

const app = express();
const server = createServer(app);
const ALLOWED_DOMAINS: string[] = env.ALLOWED_DOMAINS.split(",").map((domain) =>
  domain.trim(),
);
app.use(
  cors({
    origin: ALLOWED_DOMAINS,
    credentials: true,
  }),
);

// dodo-webhook needed to passed the raw body
app.post(
  "/api/v1/payments/dodo-webhook",
  express.raw({ type: "application/json" }),
  handleDodoPaymentWebhook,
);

app.use(express.json());
app.use(cookiesParser());

app.use((req, res, next) => {
  const end = httpDuration.startTimer({
    method: req.method,
    route: req.route?.path || req.path,
  });

  res.on("finish", () => {
    end({ status: res.statusCode });
  });

  next();
});

// routes of all application
app.use("/api/v1", authRoutes);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/chats", chatRoutes);
app.use("/api/v1/internal", internalRoutes);
app.use("/api/v1/payments", paymentRoutes);
app.use("/api/v1/utils", utilRoutes);
app.use("/api/v1/brandkits", brandKitRoutes);
app.use("/api/v1/marketplace", marketplaceRoutes);
app.get("/metrics", async (req, res) => {
  res.set("Content-Type", client.register.contentType);
  res.end(await client.register.metrics());
});
// Testing route of the application
const RANDOM_NUMBER = Math.floor(Math.random() * 1000);
const START_TIME = new Date();
function timeSinceStart() {
  const seconds = Math.floor((Date.now() - START_TIME.getTime()) / 1000);
  const mins = Math.floor(seconds / 60);
  const hrs = Math.floor(mins / 60);
  const days = Math.floor(hrs / 24);
  return `${days}d ${hrs % 24}h ${mins % 60}m`;
}

app.get("/", (req, res) => {
  res.status(200).json({
    message: "hello world",
    code: RANDOM_NUMBER,
    serverStartedAt: START_TIME.toISOString(),
    runningSince: timeSinceStart(),
  });
});
// app.get("/debug-sentry", function mainHandler(req, res) {
//   throw new Error("My first Sentry error!");
// });
// Sentry.setupExpressErrorHandler(app);

// GLOBAL ERROR HANDLING
app.use(errorHandler);
const ws = new WebSocketServer({
  server,
  verifyClient: (info, done) => {
    const origin = info.origin;
    if (!origin || !ALLOWED_DOMAINS.includes(origin)) {
      console.log("❌ WS blocked from:", origin);
      return done(false, 403, "Forbidden");
    }
    console.log("✅ WS allowed from:", origin);
    done(true);
  },
});

ws.on("connection", async (socket, req) => {
  try {
    const cookies = req.headers.cookie;
    if (!cookies) {
      console.log(`not authenticated `);
      return;
    }
    const parsedCookie = cookie.parse(req.headers.cookie!);
    if (!parsedCookie.session) return;

    let session;
    session = JSON.parse(decodeURIComponent(parsedCookie.session));

    socket.userId = session.id;
    await SocketHandler(socket);
  } catch (e) {
    console.log(`Error: ${e}`);
  }
});

// Dev things
if (env.ENVIRONMENT === "development") {
  test();
  checkAllPromptFiles();
  redis.flushdb();
}

server.listen(env.PORT, () => {
  console.log(`Server is running at 🔥 ${env.PORT}`);
});
