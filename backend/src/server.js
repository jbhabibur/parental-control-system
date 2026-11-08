import "./config/dotenv.js";

import app from "./app.js";
import { connectDatabase } from "./config/database.js";
import env from "./config/dotenv.js";

const startServer = async () => {
  await connectDatabase();

  app.listen(env.PORT, () => {
    console.log("--------------------------------");
    console.log("Parental Control Backend (PostgreSQL)");
    console.log(`[SUCCESS] Server is running on port ${env.PORT}`);
    console.log(`Local URL: http://localhost:${env.PORT}`);
    console.log("--------------------------------");
  });
};

startServer();
