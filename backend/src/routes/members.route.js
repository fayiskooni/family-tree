import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  createMember,
  deleteAllMembers,
  deleteMember,
  editMember,
  getMember,
} from "../controllers/members.controller.js";

const router = express.Router();

// apply auth middleware to all routes
router.use(protectRoute);

router.post("/member", createMember);
router.get("/member/:id", getMember);
router.patch("/edit-member/:id", editMember);
router.delete("/delete-member/:id", deleteMember);
router.delete("/delete-all-family", deleteAllMembers);

export default router;
