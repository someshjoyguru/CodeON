import express from "express";
import userRouter from "./routes/user.js";
import leaderboardRouter from "./routes/leaderboard.js";
import { config } from "dotenv";
import cookieParser from "cookie-parser";
import { errorMiddleware } from "./middlewares/error.js";
import cors from "cors";

export const app = express();

config();

app.use(express.json());
app.use(cookieParser());



app.use("/api/v1/users", userRouter);
app.use("/api/v1/leaderboard", leaderboardRouter);

app.get("/", (req, res) => {
  res.send("Nice working");
});

app.use(errorMiddleware);
