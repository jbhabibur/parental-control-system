import {
  registerUser,
  loginUser,
  refreshUserToken,
  logoutUser,
} from "../services/auth.service.js";

// ========== Parent registration ==========
export const register = async (req, res, next) => {
  try {
    const result = await registerUser(req.body, req);

    return res.status(201).json({
      success: true,
      message: "Registration successful",
      ...result,
    });
  } catch (error) {
    next(error);
  }
};

// ========== User login ==========
export const login = async (req, res, next) => {
  try {
    const result = await loginUser(req.body, req);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      ...result,
    });
  } catch (error) {
    next(error);
  }
};

// ========== Refresh access token ==========
export const refresh = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    const result = await refreshUserToken(refreshToken, req);

    return res.status(200).json({
      success: true,
      message: "Token refreshed successfully",
      ...result,
    });
  } catch (error) {
    next(error);
  }
};

// ========== User logout ==========
export const logout = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    await logoutUser(refreshToken);

    return res.status(200).json({
      success: true,
      message: "Logout successful",
    });
  } catch (error) {
    next(error);
  }
};

// ========== Get authenticated user profile ==========
export const getCurrentUser = async (req, res) => {
  return res.status(200).json({
    success: true,
    user: req.user,
  });
};
