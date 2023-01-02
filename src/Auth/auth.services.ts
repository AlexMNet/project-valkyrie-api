import type { Response } from 'express';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

export const sendResponse = (
  res: Response,
  statusCode: number,
  message: string,
  token?: string
): Response => {
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

export const signToken = (payload: object): string => {
  return jwt.sign(payload, process.env.JWT_SECRET as string, {
    expiresIn: process.env.JWT_EXPIRY,
  });
};

export const createResetToken = (): string => {
  return crypto.randomBytes(32).toString('hex');
};

export const hashResetToken = (resetToken: string) => {
  return crypto.createHash('sha256').update(resetToken).digest('hex');
};
