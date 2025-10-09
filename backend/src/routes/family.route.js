import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { createFamily, getFamily } from "../controllers/family.controller.js";

const router = express.Router();

// apply auth middleware to all routes
router.use(protectRoute);

router.post("/family", createFamily);
router.get("/family/:id", getFamily);

export default router;
