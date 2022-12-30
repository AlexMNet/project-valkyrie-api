import { db } from '../utils/db.server';

import type { Request, Response, NextFunction } from 'express';
import AppError from '../utils/appError';

export const getAllRecords = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const records = await db.record.findMany({
    where: { authorId: request.user.id },
  });
  return response.status(200).json({ status: 'success', data: records });
};

export const createRecord = async (request: Request, response: Response) => {
  const { title } = request.body;

  const newRecord = await db.record.create({
    data: {
      title,
      authorId: request.user.id,
    },
    select: {
      id: true,
      title: true,
    },
  });

  return response.status(200).json({ status: 'success', data: newRecord });
};

export const getRecordById = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const id: number = parseInt(request.params.id, 10);

  const record = await db.record.findFirst({
    where: {
      id,
      authorId: request.user.id,
    },
    select: {
      id: true,
      title: true,
      authorId: true,
    },
  });

  if (!record) {
    // throw Error('No Record Found!');
    return next(response.status(404).json({ message: 'No record Found!' }));
  }

  return response.status(200).json({ status: 'success', data: [record] });
};

export const updateRecord = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const id: number = parseInt(request.params.id, 10);

  const record = await db.record.findFirst({
    where: {
      id,
      authorId: request.user.id,
    },
    select: {
      id: true,
      title: true,
      authorId: true,
    },
  });

  if (!record) return next(new AppError(400, 'record not found'));

  const updatedRecord = await db.record.update({
    where: {
      id,
    },
    data: request.body,
    select: {
      id: true,
      title: true,
      authorId: true,
    },
  });

  return response.status(200).json(updatedRecord);
};

export const deleteRecord = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const id: number = parseInt(request.params.id, 10);

  const record = await db.record.findFirst({
    where: {
      id,
      authorId: request.user.id,
    },
    select: {
      id: true,
      title: true,
      authorId: true,
    },
  });

  if (!record) return next(new AppError(400, 'record not found'));

  const deletedRecord = await db.record.delete({
    where: {
      id,
    },
  });

  return response.status(200).json({ message: 'Record successfully deleted' });
};
