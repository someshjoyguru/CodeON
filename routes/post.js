import express from "express";
import { isAuthenticated } from "../middlewares/auth.js";
import {showPosts, createPost} from "../controllers/post.js";

const router = express.Router();

router.get("/", isAuthenticated, showPosts);
router.post("/", isAuthenticated, createPost);
export default router;