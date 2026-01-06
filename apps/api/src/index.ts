import express from "express";
import cors from "cors";
import { env } from "./lib/env.js";
import authRoutes from "./routes/auth-routes.js";
import cookiesParser from "cookie-parser";
import { checkAuthorization } from "./middlewares/check-authorization.js";
import { createServer } from "node:http";
import { WebSocketServer } from "ws";
import { SocketHandler } from "./web-sockets/socket-handler.js";
import cookie from "cookie";
import { test } from "./test.js";

const RANDOM_CODE = Math.floor(Math.random() * 100);

// app config.
const app = express();
app.use(express.json());
app.use(cors());
app.use(cookiesParser());
const server = createServer(app);

// routes of all application
app.use("/api/v1", authRoutes);

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

const ws = new WebSocketServer({
  server,
});

ws.on("connection", (socket, req) => {
  const cookies = req.headers.cookie;
  if (!cookies) {
    console.log(`not authenticated `);
    return;
  }
  const parsedCookie = cookie.parse(req.headers.cookie!);
  const session = JSON.parse(decodeURIComponent(parsedCookie.session!));
  socket.userId = session.id;
  SocketHandler(socket);
});

// test()
server.listen(env.PORT, () => {
  console.log(`Server is running at ${env.PORT}`);
});
