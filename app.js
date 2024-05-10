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
const allowedOrigins = [
  'https://nitjsr-cp-portal-lgf6ixq33-someshjoygurus-projects.vercel.app',
  // Add other allowed origins if needed
];

const corsOptions = {
  origin: function(origin, callback) {
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // Allow credentials (cookies, authorization headers)
};

app.use(cors(corsOptions));


app.use("/api/v1/users", userRouter);
app.use("/api/v1/leaderboard", leaderboardRouter);

app.get("/", (req, res) => {
  res.send("Nice working");
});

app.use(errorMiddleware);
