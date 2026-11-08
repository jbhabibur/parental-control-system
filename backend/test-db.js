import { connectDatabase, prisma } from "./src/config/database.js";

try {
  await connectDatabase();
} finally {
  await prisma.$disconnect();
}
