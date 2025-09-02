import express from "express";
import { getMyProfile, login, logout, register,updateProfile, giveUserDetails } from "../controllers/user.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.post("/new", register);
router.post("/login", login);

router.get("/logout", logout);

router.get("/me", isAuthenticated, getMyProfile);
router.post("/editme", isAuthenticated, updateProfile);

router.get("/:id", isAuthenticated, giveUserDetails);

export default router;
