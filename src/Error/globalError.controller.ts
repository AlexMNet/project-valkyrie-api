import type { Response, Request, NextFunction } from 'express';
import { Prisma } from '@prisma/client';

export default (
  err: any,
  request: Request,
  response: Response,
  next: NextFunction
) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2002' && err.meta) {
      return response.status(200).json({
        status: 'fail',
        message: `Field(s) ${Object.values(
          err.meta.target as Array<string>
        ).join(', ')} already exist.`,
      });
    }
  }

  return response.status(err.statusCode).json(err.message);
};
