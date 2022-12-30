"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
exports.default = (err, request, response, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';
    if (err instanceof client_1.Prisma.PrismaClientKnownRequestError) {
        if (err.code === 'P2002' && err.meta) {
            return response.status(200).json({
                status: 'fail',
                message: `Field(s) ${Object.values(err.meta.target).join(', ')} already exist.`,
            });
        }
    }
    return response.status(err.statusCode).json(err.message);
};
