import express from "express";
import userRouter from "./routes/user.js";
import leaderboardRouter from "./routes/leaderboard.js";
import postRouter from "./routes/post.js";
import { config } from "dotenv";
import cookieParser from "cookie-parser";
import { errorMiddleware } from "./middlewares/error.js";
import cors from "cors";

export const app = express();

config({
  path: "./data/config.env",
});

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: ['http://localhost:5173','https://nitjsr-cp-portal.vercel.app'],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);


app.use("/api/v1/users", userRouter);
app.use("/api/v1/leaderboard", leaderboardRouter);
app.use("/api/v1/posts", postRouter);

app.get("/", (req, res) => {
  res.send("Nice working");
});

app.use(errorMiddleware);
