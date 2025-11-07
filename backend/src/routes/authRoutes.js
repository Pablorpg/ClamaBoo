const express = require("express");
const router = express.Router();
const {
  register,
  login,
  forgotPassword,
  resetPassword,
  getUsers,
  getProfile
} = require("../controllers/authController");

const authUser = require("../middleware/authUser");

router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

router.get("/users", getUsers);

router.get("/me", authUser, getProfile);

module.exports = router;
