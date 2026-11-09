import {
  createDomainCategory,
  getAllDomainCategories,
  getDomainCategoryById,
  updateDomainCategory,
  deleteDomainCategory,
} from "../services/domain-category.service.js";

import { createAuditLog } from "../services/audit-log.service.js";

// ========== Create Domain Category ==========
export const createCategory = async (req, res) => {
  try {
    const data = await createDomainCategory(req.body);

    await createAuditLog({
      actorId: req.user.id,
      action: "DOMAIN_CATEGORY_CREATED",
      entityType: "DomainCategory",
      entityId: data.id,
      metadata: {
        name: data.name,
      },
      ipAddress: req.ip,
    });

    return res.status(201).json({
      success: true,
      message: "Domain category created successfully",
      data,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
    });
  }
};

// ========== Get All Domain Categories ==========
export const getAllCategories = async (req, res) => {
  try {
    const data = await getAllDomainCategories();

    return res.status(200).json({
      success: true,
      message: "Domain categories retrieved successfully",
      data,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
    });
  }
};

// ========== Get Domain Category by ID ==========
export const getCategoryById = async (req, res) => {
  try {
    const data = await getDomainCategoryById(req.params.categoryId);

    return res.status(200).json({
      success: true,
      message: "Domain category retrieved successfully",
      data,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
    });
  }
};

// ========== Update Domain Category ==========
export const updateCategory = async (req, res) => {
  try {
    const data = await updateDomainCategory(req.params.categoryId, req.body);

    await createAuditLog({
      actorId: req.user.id,
      action: "DOMAIN_CATEGORY_UPDATED",
      entityType: "DomainCategory",
      entityId: req.params.categoryId,
      metadata: {
        name: data.name,
      },
      ipAddress: req.ip,
    });

    return res.status(200).json({
      success: true,
      message: "Domain category updated successfully",
      data,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
    });
  }
};

// ========== Delete Domain Category ==========
export const deleteCategory = async (req, res) => {
  try {
    await deleteDomainCategory(req.params.categoryId);

    await createAuditLog({
      actorId: req.user.id,
      action: "DOMAIN_CATEGORY_DELETED",
      entityType: "DomainCategory",
      entityId: req.params.categoryId,
      ipAddress: req.ip,
    });

    return res.status(200).json({
      success: true,
      message: "Domain category deleted successfully",
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
    });
  }
};
