import express from "express";
import authUser from "../middleware/authUser.js";
import {
  followCompany,
  unfollowCompany,
  checkFollowing,
  getFollowersCount,
  getFollowing
} from "../controllers/followController.js";

const router = express.Router();

router.get("/following", authUser, getFollowing);
router.get("/check/:id", authUser, checkFollowing);
router.get("/count/:id", getFollowersCount);

router.post("/:id", authUser, followCompany);
router.delete("/:id", authUser, unfollowCompany);

export default router;