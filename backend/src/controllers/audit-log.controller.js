import { getAuditLogs } from "../services/audit-log.service.js";

// ========== Get Audit Logs ==========
export const getAuditLogsHandler = async (req, res, next) => {
  try {
    const result = await getAuditLogs(req.user.id, {
      deviceId: req.query.deviceId,
      action: req.query.action,
      startDate: req.query.startDate,
      endDate: req.query.endDate,
      page: Number(req.query.page) || 1,
      limit: Number(req.query.limit) || 20,
    });

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
