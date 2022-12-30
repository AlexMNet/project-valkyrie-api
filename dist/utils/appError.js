"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class AppError extends Error {
    constructor(statusCode, message) {
        super();
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.message = message;
        // All errors using this class will be marked as operational
        this.operational = true;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.default = AppError;
