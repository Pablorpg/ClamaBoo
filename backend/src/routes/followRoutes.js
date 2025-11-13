import express from "express";
import authUser from "../middleware/authUser.js";
import authCompany from "../middleware/authCompany.js";
import {
  followCompany,
  unfollowCompany,
  getFollowers
} from "../controllers/followController.js";

const router = express.Router();

router.post("/follow/:companyId", authUser, followCompany);

router.delete("/unfollow/:companyId", authUser, unfollowCompany);

router.get("/followers", authCompany, getFollowers);

export default router;
