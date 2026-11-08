import express from "express";

import { authenticate } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/role.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";

import {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from "../controllers/domain-category.controller.js";

import {
  createDomainCategorySchema,
  updateDomainCategorySchema,
} from "../validators/domain-category.validator.js";

const router = express.Router();

// ========== Create Domain Category ==========
router.post(
  "/domain-categories",
  authenticate,
  authorize("PARENT"),
  validate(createDomainCategorySchema),
  createCategory,
);

// ========== GET ALL DOMAIN CATEGORIES ==========
router.get(
  "/domain-categories",
  authenticate,
  authorize("PARENT"),
  getAllCategories,
);

// ========== GET SINGLE DOMAIN CATEGORY ==========
router.get(
  "/domain-categories/:categoryId",
  authenticate,
  authorize("PARENT"),
  getCategoryById,
);

// ========== UPDATE DOMAIN CATEGORY ==========
router.patch(
  "/domain-categories/:categoryId",
  authenticate,
  authorize("PARENT"),
  validate(updateDomainCategorySchema),
  updateCategory,
);

// ========== DELETE DOMAIN CATEGORY ==========
router.delete(
  "/domain-categories/:categoryId",
  authenticate,
  authorize("PARENT"),
  deleteCategory,
);

export default router;
