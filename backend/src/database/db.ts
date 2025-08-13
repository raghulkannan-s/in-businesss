import { PrismaClient } from "@prisma/client";
import mongoose from "mongoose";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  });

  const MONGODB_URL = process.env.MONGODB_URL;

export const connectDB = async () => {
  try {

    if(!MONGODB_URL) {
      console.error("❌ MongoDB URL is not defined");
      process.exit(1);
    }

    await prisma.$connect();
    await mongoose.connect(MONGODB_URL);

    console.log(`✅ Database connected successfully`);
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    process.exit(1);
  }
};
  
export const disconnectDB = async () => {
  try {
    await prisma.$disconnect();
    await mongoose.disconnect();
    console.log("✅ Database disconnected successfully");
  } catch (error) {
    console.error("❌ Database disconnection failed:", error);
  }
};

["beforeExit", "SIGINT", "SIGTERM"].forEach((event) => {
  process.on(event as NodeJS.Signals, async () => {
    await disconnectDB();
    if (event !== "beforeExit") process.exit(0);
  });
});