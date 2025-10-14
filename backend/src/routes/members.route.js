import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  createMember,
  deleteAllMembers,
  deleteMember,
  editMember,
  getAllMembers,
  getMember,
} from "../controllers/members.controller.js";

const router = express.Router();

// apply auth middleware to all routes
router.use(protectRoute);

router.post("/member", createMember);
router.get("/member/:id", getMember);
router.get("/members", getAllMembers);
router.patch("/member/:id", editMember);
router.delete("/member/:id", deleteMember);
router.delete("/members", deleteAllMembers);

export default router;
