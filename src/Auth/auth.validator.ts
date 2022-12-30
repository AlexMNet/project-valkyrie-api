import { body, validationResult } from 'express-validator';
import type { Request, Response, NextFunction } from 'express';

export const validateLogin = [
  body('email')
    .trim()
    .isEmail()
    .withMessage('You must provide a valid email')
    .notEmpty()
    .withMessage('Email must not be empty'),
  body('password')
    .trim()
    .notEmpty()
    .withMessage('You must provide your password')
    .isAlphanumeric()
    .withMessage('Password must be alphanumeric')
    .isLength({ min: 5 })
    .withMessage('Password must be more than 5 characters long'),

  (request: Request, response: Response, next: NextFunction) => {
    const errors = validationResult(request);

    if (!errors.isEmpty()) {
      return response
        .status(400)
        .json({ status: 'fail', errors: errors.array() });
    }
    next();
  },
];

export const validateRegister = [
  body('email')
    .trim()
    .isEmail()
    .withMessage('You must provide a valid email')
    .notEmpty()
    .withMessage('Email must not be empty'),
  body('password')
    .trim()
    .notEmpty()
    .withMessage('You must provide your password')
    .isAlphanumeric()
    .withMessage('Password must be alphanumeric')
    .isLength({ min: 5 })
    .withMessage('Password must be more than 5 characters long'),
  body('firstName')
    .trim()
    .notEmpty()
    .withMessage('Please provide your first name'),
  body('lastName')
    .trim()
    .notEmpty()
    .withMessage('Please provide your first name'),

  (request: Request, response: Response, next: NextFunction) => {
    const errors = validationResult(request);

    if (!errors.isEmpty()) {
      return response
        .status(400)
        .json({ status: 'fail', errors: errors.array() });
    }
    next();
  },
];
