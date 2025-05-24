import express from "express";
import * as authMiddleware from "../middlewares/authMiddleware.js";
import * as registrationController from "../controllers/registrationController.js";

const router = express.Router();

router.post(
  "/registration",
  authMiddleware.authenticate,
  authMiddleware.authorizeRole(["admin", "pmi", "donor"]),
  registrationController.createRegistration
);

router.get(
  "/registration",
  authMiddleware.authenticate,
  authMiddleware.authorizeRole(["admin", "pmi", "donor"]),
  registrationController.getAllRegistrations
);

router.get(
  "/registration/:id",
  authMiddleware.authenticate,
  authMiddleware.authorizeRole(["admin", "pmi", "donor"]),
  registrationController.getRegistrationById
);

router.put(
  "/registration/:id",
  authMiddleware.authenticate,
  authMiddleware.authorizeRole(["admin", "pmi", "donor"]),
  registrationController.updateStatusRegistrationById
);

export default router;
