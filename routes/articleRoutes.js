import express from "express";
import * as authMiddleware from "../middlewares/authMiddleware.js";
import * as articleController from "../controllers/articleController.js";
import upload from "../middlewares/uploadMiddleware.js";

const router = express.Router();

router.post(
  "/article",
  upload.single("image"),
  authMiddleware.authenticate,
  authMiddleware.authorizeRole(["admin", "pmi", "donor"]),
  articleController.createArticle
);

router.get(
  "/article",
  authMiddleware.authenticate,
  authMiddleware.authorizeRole(["admin", "pmi", "donor"]),
  articleController.getAllArticles
);

router.get(
  "/article/:id",
  authMiddleware.authenticate,
  authMiddleware.authorizeRole(["admin", "pmi", "donor"]),
  articleController.getArticleById
);

router.put(
  "/article/:id",
  upload.single("image"),
  authMiddleware.authenticate,
  authMiddleware.authorizeRole(["admin", "pmi", "donor"]),
  articleController.updateArticleById
);

export default router;
