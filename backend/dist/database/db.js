"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
exports.connectToDatabase = connectToDatabase;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
exports.prisma = prisma;
async function connectToDatabase() {
    try {
        await prisma.$connect();
        console.log("Connected to the database successfully.");
    }
    catch (error) {
        console.error("Error connecting to the database:", error);
    }
}
