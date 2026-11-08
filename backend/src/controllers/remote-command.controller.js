import {
  createRemoteCommand,
  getPendingCommands,
  updateCommandStatus,
  getDeviceCommandHistory,
} from "../services/remote-command.service.js";

// ========== Create Remote Command (PARENT) ==========
export const createCommand = async (req, res) => {
  try {
    const data = await createRemoteCommand(
      req.user.id,
      req.params.deviceId,
      req.body,
    );

    return res.status(201).json({
      success: true,
      message: "Remote command created successfully",
      data,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
    });
  }
};

// ========== Get Pending Commands (CHILD DEVICE) ==========
export const getPendingDeviceCommands = async (req, res) => {
  try {
    const data = await getPendingCommands(req.device.id);

    return res.status(200).json({
      success: true,
      message: "Pending commands retrieved successfully",
      data,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
    });
  }
};

// ========== Update Command Status (CHILD DEVICE) ==========
export const updateDeviceCommandStatus = async (req, res) => {
  try {
    const data = await updateCommandStatus(
      req.device.id,
      req.params.commandId,
      req.body,
    );

    return res.status(200).json({
      success: true,
      message: "Command status updated successfully",
      data,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================ Get Device Command History (PARENT) ==========
export const getCommandHistory = async (req, res) => {
  try {
    const data = await getDeviceCommandHistory(
      req.user.id,
      req.params.deviceId,
    );

    return res.status(200).json({
      success: true,
      message: "Device command history retrieved successfully",
      data,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
    });
  }
};
