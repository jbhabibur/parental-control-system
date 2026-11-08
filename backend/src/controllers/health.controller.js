import { prisma } from "../config/database.js";

export const getHealthStatus = async (req, res) => {
  try {
    const dbResult = await prisma.$queryRaw`SELECT NOW() AS now`;

    res.status(200).json({
      success: true,
      status: "Healthy",
      database: "Connected",
      time: dbResult[0].now,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      status: "Unhealthy",
      database: "Disconnected",
      error: error.message,
    });
  }
};
