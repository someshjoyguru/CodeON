import express from "express";
import { isAuthenticated } from "../middlewares/auth.js";
import { showLeaderboard } from "../controllers/leaderboard.js";

const router = express.Router();

router.get("/", isAuthenticated, showLeaderboard);
export default router;
