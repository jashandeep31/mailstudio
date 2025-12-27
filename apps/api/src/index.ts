import express from "express";
import cors from "cors";
import { env } from "./lib/env.js";
import authRoutes from "./routes/auth-routes.js";
import cookiesParser from "cookie-parser";
import { checkAuthorization } from "./middlewares/check-authorization.js";
// app config.
const app = express();
app.use(express.json());
app.use(cors());
app.use(cookiesParser());

const RANDOM_CODE = Math.floor(Math.random() * 100);

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

app.listen(env.PORT, () => {
  console.log(`server is running at the port ${env.PORT}.`);
});
