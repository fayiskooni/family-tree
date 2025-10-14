import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  createFamilyMember,
  deleteAllFAmilyMembers,
  deleteFamilyMember,
  getFamilyMembers,
} from "../controllers/familyMember.controller.js";

const router = express.Router();

// apply auth middleware to all routes
router.use(protectRoute);

router.post("/family/member/:id", createFamilyMember);
router.get("/family/members/:id", getFamilyMembers);
router.delete("/family/member/:id", deleteFamilyMember);
router.delete("/family/members", deleteAllFAmilyMembers);

export default router;
