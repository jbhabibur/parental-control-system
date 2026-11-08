import {
  createDomainCategory,
  getAllDomainCategories,
  getDomainCategoryById,
  updateDomainCategory,
  deleteDomainCategory,
} from "../services/domain-category.service.js";

// ========== Create Domain Category ==========
export const createCategory = async (req, res) => {
  try {
    const data = await createDomainCategory(req.body);

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
