import express from "express";
import * as authMiddleware from "../middlewares/authMiddleware.js";
import * as userController from "../controllers/userController.js";

const router = express.Router();

router.post(
  "/user",
  authMiddleware.authenticate,
  authMiddleware.authorizeRole(["admin", "hospital", "donor"]),
  userController.createUser
);

router.get(
  "/user",
  authMiddleware.authenticate,
  authMiddleware.authorizeRole(["admin", "hospital", "donor"]),
  userController.getAllUsers
);

router.get(
  "/user/:id",
  authMiddleware.authenticate,
  authMiddleware.authorizeRole(["admin", "hospital", "donor"]),
  userController.getUserById
);

router.put(
  "/user/:id",
  authMiddleware.authenticate,
  authMiddleware.authorizeRole(["admin", "hospital", "donor"]),
  userController.updateUserById
);

router.put(
  "/user/:id/password",
  authMiddleware.authenticate,
  authMiddleware.authorizeRole(["admin", "hospital", "donor"]),
  userController.updateUserPassword
);

router.delete(
  "/user/:id",
  authMiddleware.authenticate,
  authMiddleware.authorizeRole(["admin"]),
  userController.deleteUser
);

if (process.env.NODE_ENV === "development") {
  router.get("/dev/user", userController.getAllUsers);
  router.post("/dev/user", userController.createUser);
}

export default router;
