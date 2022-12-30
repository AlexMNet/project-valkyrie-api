"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateCreateRecord = void 0;
const express_validator_1 = require("express-validator");
exports.validateCreateRecord = [
    (0, express_validator_1.body)('title')
        .trim()
        .notEmpty()
        .withMessage('You must provide a title')
        .isLength({ min: 5 })
        .withMessage('Title must be 5 characters or more'),
    (request, response, next) => {
        const errors = (0, express_validator_1.validationResult)(request);
        if (!errors.isEmpty()) {
            return response
                .status(400)
                .json({ status: 'fail', errors: errors.array() });
        }
        next();
    },
];
