import express from "express";
import cors from "cors";
import { env } from "./lib/env.js";
// Routes only
import authRoutes from "./routes/auth-routes.js";
import userRoutes from "./routes/user-routes.js";
import chatRoutes from "./routes/chat-routes.js";
import internalRoutes from "./routes/internal-routes.js";
import paymentRoutes from "./routes/payment-routes.js";
import utilRoutes from "./routes/util-routes.js";
import brandKitRoutes from "./routes/brandkit-routes.js";
import marketplaceRoutes from "./routes/marketplace-routes.js";

import cookiesParser from "cookie-parser";
import { checkAuthorization } from "./middlewares/check-authorization.js";
import { createServer } from "node:http";
import { WebSocketServer } from "ws";
import { SocketHandler } from "./web-sockets/socket-handler.js";
import cookie from "cookie";
import { test } from "./test.js";
import { errorHandler } from "./middlewares/error-hanlder.js";
import { handleDodoPaymentWebhook } from "./controllers/payments/dodo-payments.js";
import { checkAllPromptFiles } from "./prompts/index.js";

// TODO: think of the better alternative to this approach
// Global error handlers to prevent server crashes
// process.on("unhandledRejection", (reason, promise) => {
//   console.error("Unhandled Rejection at:", promise, "reason:", reason);
// });

// process.on("uncaughtException", (error) => {
//   console.error("Uncaught Exception:", error);
// });

const RANDOM_CODE = Math.floor(Math.random() * 100);

// check the prompt and warn in the console when not found
// TODO: replace it with the throwing the error instead of just the warning
checkAllPromptFiles();
// app config.
const app = express();

// TODO: fix this spellings in the dodo payments as we as the code
app.post(
  "/api/v1/payments/dodo-webhook",
  express.raw({ type: "application/json" }),
  handleDodoPaymentWebhook,
);
app.use(express.json());

// global middleware to log the request and response
app.use(
  (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const startTime = Date.now();
    res.on("finish", () => {
      const duration = Date.now() - startTime;
      console.log(
        `[${new Date().toISOString()}] ${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`,
      );
    });
    next();
  },
);
app.use(
  cors({
    origin: "https://www.mailstudio.dev",
    credentials: true,
  }),
);
app.use(cookiesParser());
const server = createServer(app);

// routes of all application
app.use("/api/v1", authRoutes);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/chats", chatRoutes);
app.use("/api/v1/internal", internalRoutes);
app.use("/api/v1/payments", paymentRoutes);
app.use("/api/v1/utils", utilRoutes);
app.use("/api/v1/brandkits", brandKitRoutes);
app.use("/api/v1/marketplace", marketplaceRoutes);
// Testing route of the application
app.get("/", checkAuthorization(["all"]), (req, res, next) => {
  res.status(200).json({ message: "hello" });
});

app.get("/test", (req, res) => {
  const session = req.cookies.session;
  res.status(200).json({
    message: "Hello world",
    code: RANDOM_CODE,
    session,
  });
});
// GLOBAL ERROR HANDLING
app.use(errorHandler);
const ws = new WebSocketServer({
  server,
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
test();
server.listen(env.PORT, () => {
  console.log(`Server is running at 🔥 ${env.PORT}`);
});
