import express from "express";
import * as authMiddleware from "../middlewares/authMiddleware.js";
import * as scheduleController from "../controllers/scheduleController.js";
import upload from "../middlewares/uploadMiddleware.js";

const router = express.Router();

router.post(
  "/schedule",
  upload.single("image"),
  authMiddleware.authenticate,
  authMiddleware.authorizeRole(["admin", "hospital", "donor"]),
  scheduleController.createSchedule
);

router.get(
  "/schedule",
  authMiddleware.authenticate,
  authMiddleware.authorizeRole(["admin", "hospital", "donor"]),
  scheduleController.getAllSchedules
);

router.get(
  "/schedule/:id",
  authMiddleware.authenticate,
  authMiddleware.authorizeRole(["admin", "hospital", "donor"]),
  scheduleController.getScheduleById
);

router.put(
  "/schedule/:id",
  upload.single("image"),
  authMiddleware.authenticate,
  authMiddleware.authorizeRole(["admin", "hospital", "donor"]),
  scheduleController.updateScheduleById
);

export default router;
