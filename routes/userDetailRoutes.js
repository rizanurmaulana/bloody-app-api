import express from "express";
import * as authMiddleware from "../middlewares/authMiddleware.js";
import * as userDetailController from "../controllers/userDetailController.js";
import upload from "../middlewares/uploadMiddleware.js";

const router = express.Router();

router.post(
  "/user_detail",
  upload.single("image"),
  authMiddleware.authenticate,
  authMiddleware.authorizeRole(["admin", "pmi", "donor"]),
  userDetailController.createUserDetail
);

router.get(
  "/user_detail",
  authMiddleware.authenticate,
  authMiddleware.authorizeRole(["admin", "pmi", "donor"]),
  userDetailController.getAllUserDetails
);

router.get(
  "/user_detail/me",
  authMiddleware.authenticate,
  authMiddleware.authorizeRole(["admin", "pmi", "donor"]),
  userDetailController.getUserDetailById
);

router.put(
  "/user_detail/:user_id",
  upload.single("image"),
  authMiddleware.authenticate,
  authMiddleware.authorizeRole(["admin", "pmi", "donor"]),
  userDetailController.updateUserDetailById
);

export default router;
