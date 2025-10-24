import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  createMember,
  deleteAllMembers,
  deleteMember,
  editMember,
  getAllChildren,
  getAllMembers,
  getAllUnmarriedFemales,
  getAllUnmarriedMales,
  getMember,
  getRecommendedMembers,
} from "../controllers/members.controller.js";

const router = express.Router();

// apply auth middleware to all routes
router.use(protectRoute);

router.post("/member", createMember);
router.get("/member/:id", getMember);
router.get("/recommended/members/:id", getRecommendedMembers);
router.get("/members", getAllMembers);
router.get("/male/members", getAllUnmarriedMales);
router.get("/female/members", getAllUnmarriedFemales);
router.get("/members/as/children", getAllChildren);
router.patch("/member/:id", editMember);
router.delete("/member/:id", deleteMember);
router.delete("/members", deleteAllMembers);

export default router;
