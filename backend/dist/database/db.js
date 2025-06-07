"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.disconnectDB = exports.connectDB = exports.prisma = void 0;
const client_1 = require("@prisma/client");
const globalForPrisma = globalThis;
exports.prisma = globalForPrisma.prisma ??
    new client_1.PrismaClient({
        datasources: {
            db: {
                url: process.env.DATABASE_URL,
            },
        },
        log: process.env.NODE_ENV === "development"
            ? ["query", "error", "warn"]
            : ["error"],
    });
if (process.env.NODE_ENV !== "production")
    globalForPrisma.prisma = exports.prisma;
// Connection management functions
const connectDB = async () => {
    try {
        await exports.prisma.$connect();
        console.log("✅ Database connected successfully");
    }
    catch (error) {
        console.error("❌ Database connection failed:", error);
        process.exit(1);
    }
};
exports.connectDB = connectDB;
const disconnectDB = async () => {
    try {
        await exports.prisma.$disconnect();
        console.log("✅ Database disconnected successfully");
    }
    catch (error) {
        console.error("❌ Database disconnection failed:", error);
    }
};
exports.disconnectDB = disconnectDB;
// Graceful shutdown
process.on("beforeExit", async () => {
    await (0, exports.disconnectDB)();
});
process.on("SIGINT", async () => {
    await (0, exports.disconnectDB)();
    process.exit(0);
});
process.on("SIGTERM", async () => {
    await (0, exports.disconnectDB)();
    process.exit(0);
});
