let prismaClient: any = null;

try {
  // Use dynamic require so Next.js build doesn't fail if @prisma/client is not yet installed
  const { PrismaClient } = require("@prisma/client");
  const globalForPrisma = globalThis as unknown as {
    prisma: any;
  };

  prismaClient =
    globalForPrisma.prisma ??
    new PrismaClient({
      log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
    });

  if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prismaClient;
} catch {
  prismaClient = null;
}

export const db = prismaClient;
export default db;

