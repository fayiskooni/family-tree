import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { createParentChild, deleteParentChild, getParentChild } from "../controllers/parentChild.controller.js";

const router = express.Router();

// apply auth middleware to all routes
router.use(protectRoute);

router.post("/parent/child/:id", createParentChild);
router.get("/parent/children/:id", getParentChild);
router.delete("/parent/child/:id", deleteParentChild);



export default router;