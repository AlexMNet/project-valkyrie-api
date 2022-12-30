"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRegister = exports.validateLogin = void 0;
const express_validator_1 = require("express-validator");
exports.validateLogin = [
    (0, express_validator_1.body)('email')
        .trim()
        .isEmail()
        .withMessage('You must provide a valid email')
        .notEmpty()
        .withMessage('Email must not be empty'),
    (0, express_validator_1.body)('password')
        .trim()
        .notEmpty()
        .withMessage('You must provide your password')
        .isAlphanumeric()
        .withMessage('Password must be alphanumeric')
        .isLength({ min: 5 })
        .withMessage('Password must be more than 5 characters long'),
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
exports.validateRegister = [
    (0, express_validator_1.body)('email')
        .trim()
        .isEmail()
        .withMessage('You must provide a valid email')
        .notEmpty()
        .withMessage('Email must not be empty'),
    (0, express_validator_1.body)('password')
        .trim()
        .notEmpty()
        .withMessage('You must provide your password')
        .isAlphanumeric()
        .withMessage('Password must be alphanumeric')
        .isLength({ min: 5 })
        .withMessage('Password must be more than 5 characters long'),
    (0, express_validator_1.body)('firstName')
        .trim()
        .notEmpty()
        .withMessage('Please provide your first name'),
    (0, express_validator_1.body)('lastName')
        .trim()
        .notEmpty()
        .withMessage('Please provide your first name'),
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
