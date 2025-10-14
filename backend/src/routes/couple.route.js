import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { createCouple, deleteCouple, getCouple } from "../controllers/couple.controller.js";

const router = express.Router();

// apply auth middleware to all routes
router.use(protectRoute);

router.post("/couple/:id", createCouple);
router.get("/couple/:id", getCouple);
router.delete("/couple/:id", deleteCouple);

export default router;
