"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.compareToken = exports.hashToken = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const hashToken = async (token) => {
    return await bcryptjs_1.default.hash(token, 10);
};
exports.hashToken = hashToken;
const compareToken = async (token, hashed) => {
    return await bcryptjs_1.default.compare(token, hashed);
};
exports.compareToken = compareToken;
