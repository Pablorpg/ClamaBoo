import express from "express";
import {
  register,
  login,
  forgotPassword,
  resetPassword,
  getUsers,
  getProfile,
  updateProfileUser
} from "../controllers/authController.js";

import authUser from "../middleware/authUser.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

router.get("/users", getUsers);
router.get("/me", authUser, getProfile);
router.put("/profile/me", authUser, updateProfileUser);

export default router;