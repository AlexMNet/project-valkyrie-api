import { db } from '../utils/db.server';
import type { Request, Response, NextFunction } from 'express';
import AppError from '../utils/appError';
import jwt from 'jsonwebtoken';
import argon2 from 'argon2';

declare module 'express-serve-static-core' {
  interface Request {
    user?: any;
  }
}

export const loginUser = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const { email, password } = request.body;

  const user = await db.user.findUnique({ where: { email } });

  if (!user) return next(new AppError(400, 'user not found'));

  const pwMatch = await argon2.verify(user.password, password);

  if (!pwMatch) {
    return next(new AppError(400, 'password or email is invalid'));
  }

  const token = jwt.sign({ id: user.id }, 'thisisasecret');

  return response
    .status(200)
    .cookie('access_token', token, { httpOnly: true })
    .json({ status: 'success', message: 'login successful' });
};

export const registerUser = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const { email, firstName, lastName } = request.body;
  const hashedPassword = await argon2.hash(request.body.password);

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

  const token = jwt.sign({ id: newUser.id }, 'thisisasecret');

  response
    .status(200)
    .cookie('access_token', token, { httpOnly: true })
    .json({ status: 'success', message: 'login successful' });
};

export const authorization = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  let token: string | undefined = request.cookies.access_token;

  if (!token) return next(new AppError(403, 'please log in to view this page'));

  const decoded = jwt.verify(token, 'thisisasecret');

  request.user = decoded;
  next();
};

export const logout = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  response
    .clearCookie('access_token')
    .status(200)
    .json({ status: 'success', message: 'successfully logged out' });
};
