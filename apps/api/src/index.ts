import express from "express";
import cors from "cors";
import { env } from "./lib/env.js";
const app = express();
app.use(express.json());
app.use(cors());

const RANDOM_CODE = Math.floor(Math.random() * 100);

app.get("/test", (req, res) => {
  res.status(200).json({
    message: "Hello world",
    code: RANDOM_CODE,
  });
});

app.listen(env.PORT, () => {
  console.log(`server is running at the port ${env.PORT}.`);
});
