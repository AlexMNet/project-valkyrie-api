import { body, validationResult } from 'express-validator';
import type { Request, Response, NextFunction } from 'express';

export const validateCreateRecord = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('You must provide a title')
    .isLength({ min: 5 })
    .withMessage('Title must be 5 characters or more'),

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
