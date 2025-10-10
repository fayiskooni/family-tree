import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  createFamily,
  deleteAllFamily,
  deleteFamily,
  editFamily,
  getFamily,
} from "../controllers/family.controller.js";

const router = express.Router();

// apply auth middleware to all routes
router.use(protectRoute);

router.post("/family", createFamily);
router.get("/family/:id", getFamily);
router.patch("/edit-family/:id", editFamily);
router.delete("/delete-family/:id", deleteFamily);
router.delete("/delete-all-family", deleteAllFamily);

export default router;
