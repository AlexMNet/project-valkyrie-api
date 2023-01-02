import { db } from '../utils/db.server';
import type { Request, Response, NextFunction } from 'express';
import AppError from '../utils/appError';
import jwt from 'jsonwebtoken';
import argon2 from 'argon2';
import { sendEmail } from '../utils/email';
import { obscureEmail } from '../utils/helpers';
import { signToken, sendResponse, createResetToken, hashResetToken } from './auth.services';

declare module 'express-serve-static-core' {
  interface Request {
    user?: any;
  }
}

/**
 * Login User
 */
export const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  const user = await db.user.findUnique({ where: { email } });

  if (!user) return next(new AppError(400, 'user not found'));

  const pwMatch = await argon2.verify(user.password, password);

  if (!pwMatch) {
    return next(new AppError(400, 'password or email is invalid'));
  }

  const token = signToken({ id: user.id, role: user.role });

  sendResponse(res, 200, 'login successful', token);
};

/**
 * Register User
 */
export const registerUser = async (req: Request, res: Response, next: NextFunction) => {
  const { email, firstName, lastName, password } = req.body;
  const hashedPassword = await argon2.hash(password);

  const user = {
    email,
    password: hashedPassword,
    firstName,
    lastName,
  };

  const newUser = await db.user.create({
    data: user,
    select: {
      id: true,
      email: true,
      role: true,
      firstName: true,
      lastName: true,
    },
  });

  const token = signToken({ id: newUser.id, role: newUser.role });

  sendResponse(res, 200, 'registration successfull', token);
};

/**
 * Authorization
 */
export const authorization = async (req: Request, res: Response, next: NextFunction) => {
  let token: string | undefined = req.cookies.access_token;

  if (!token) return next(new AppError(403, 'please log in to view this page'));

  const decoded = jwt.verify(token, process.env.JWT_SECRET as string);

  req.user = decoded;

  next();
};

/**
 *  Check if Admin
 */
export const adminOnly = async (req: Request, res: Response, next: NextFunction) => {
  if (req.user.role !== 'ADMIN') {
    return next(new AppError(401, 'You must be an admin to access this resource'));
  }
  return next();
};

/**
 * Logout
 */
export const logout = async (req: Request, res: Response, next: NextFunction) => {
  res
    .clearCookie('access_token')
    .status(200)
    .json({ status: 'success', message: 'successfully logged out' });
};

/**
 * Forgot Password
 */
export const forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
  const { email } = req.body;

  const user = await db.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    return next(new AppError(404, 'User does not exist with that email'));
  }

  const resetToken = createResetToken();

  await db.user.update({
    where: {
      id: user.id,
    },
    data: {
      passwordResetToken: hashResetToken(resetToken),
      passwordResetExpires: new Date(Date.now() + 10 * 60 * 1000),
    },
  });

  const resetURL = `${req.protocol}://${req.get('host')}/user/reset-password/${resetToken}`;

  const message = `Forgot your password? Submit a patch request to ${resetURL} with your new password. \n If this wasn't you, please change your password!`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Your password reset token is valid for 10 minutes',
      message,
    });
  } catch (err) {
    return next(
      new AppError(500, 'Something went wrong. Email could not be sent. Try again later.')
    );
  }

  sendResponse(res, 200, `Reset token send to ${obscureEmail(user.email)}`);
};

/**
 * Reset Password
 */
export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
  const { token } = req.params;
  const { password } = req.body;

  const hashedToken = hashResetToken(token);

  const user = await db.user.findFirst({
    where: {
      passwordResetToken: {
        equals: hashedToken,
      },
      passwordResetExpires: {
        gt: new Date(),
      },
    },
  });

  if (!user) {
    return next(new AppError(404, 'Token invalid or expired'));
  }

  const updateUser = await db.user.update({
    where: {
      id: user.id,
    },
    data: {
      password: await argon2.hash(password),
      passwordResetToken: null,
      passwordResetExpires: null,
    },
  });

  const jwtToken = signToken({ id: user.id, role: user.role });

  sendResponse(res, 200, 'password reset', jwtToken);
};
