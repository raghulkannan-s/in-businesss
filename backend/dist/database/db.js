"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.disconnectDB = exports.connectDB = exports.prisma = void 0;
const client_1 = require("@prisma/client");
const mongoose_1 = __importDefault(require("mongoose"));
const globalForPrisma = globalThis;
exports.prisma = globalForPrisma.prisma ??
    new client_1.PrismaClient({
        datasources: {
            db: {
                url: process.env.DATABASE_URL,
            },
        },
    });
const MONGODB_URL = process.env.MONGO_URL;
const connectDB = async () => {
    try {
        if (!MONGODB_URL) {
            console.error("❌ MongoDB URL is not defined");
            process.exit(1);
        }
        await exports.prisma.$connect();
        await mongoose_1.default.connect(MONGODB_URL);
        console.log(`✅ Database connected successfully`);
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
        await mongoose_1.default.disconnect();
        console.log("✅ Database disconnected successfully");
    }
    catch (error) {
        console.error("❌ Database disconnection failed:", error);
    }
};
exports.disconnectDB = disconnectDB;
["beforeExit", "SIGINT", "SIGTERM"].forEach((event) => {
    process.on(event, async () => {
        await (0, exports.disconnectDB)();
        if (event !== "beforeExit")
            process.exit(0);
    });
});
