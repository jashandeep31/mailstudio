import express from "express";
import cors from "cors";
import { env } from "./lib/env.js";
import authRoutes from "./routes/auth-routes.js";

// app config.
const app = express();
app.use(express.json());
app.use(cors());

const RANDOM_CODE = Math.floor(Math.random() * 100);

// routes of all application
app.use("/api/v1", authRoutes);

// Testing route of the application
app.get("/test", (req, res) => {
  res.status(200).json({
    message: "Hello world",
    code: RANDOM_CODE,
    env: JSON.stringify(env),
  });
});

app.listen(env.PORT, () => {
  console.log(`server is running at the port ${env.PORT}.`);
});
