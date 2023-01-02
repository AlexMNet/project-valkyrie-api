"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hashResetToken = exports.createResetToken = exports.signToken = exports.sendResponse = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const crypto_1 = __importDefault(require("crypto"));
const sendResponse = (res, statusCode, message, token) => {
    return res
        .status(statusCode)
        .cookie('access_token', token, {
        httpOnly: true,
    })
        .json({
        status: 'success',
        message,
    });
};
exports.sendResponse = sendResponse;
const signToken = (payload) => {
    return jsonwebtoken_1.default.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRY,
    });
};
exports.signToken = signToken;
const createResetToken = () => {
    return crypto_1.default.randomBytes(32).toString('hex');
};
exports.createResetToken = createResetToken;
const hashResetToken = (resetToken) => {
    return crypto_1.default.createHash('sha256').update(resetToken).digest('hex');
};
exports.hashResetToken = hashResetToken;
