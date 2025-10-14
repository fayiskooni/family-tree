import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  createFamily,
  deleteAllFamily,
  deleteFamily,
  editFamily,
  getAllFamily,
  getFamily,
} from "../controllers/family.controller.js";

const router = express.Router();

// apply auth middleware to all routes
router.use(protectRoute);

router.post("/family", createFamily);
router.get("/family/:id", getFamily);
router.get("/families", getAllFamily);
router.patch("/family/:id", editFamily);
router.delete("/family/:id", deleteFamily);
router.delete("/families", deleteAllFamily);

export default router;
