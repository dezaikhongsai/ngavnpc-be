import { Request, Response, NextFunction } from 'express';
import ApiError from '../utils/ApiError';
import {envKey} from '../configs/key/key.config'
import { ApiErrorResponse } from '../types/api.type';

interface CustomError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

export const errorHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err.stack);

  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';
  // Nếu lỗi không phải là operational (do lập trình), trả về lỗi chung
  if (!err.isOperational) {
    statusCode = 500;
    message = 'Something went wrong on the server';
  }

 const response: ApiErrorResponse = {
    status: 'error',
    code: statusCode,
    message,
    ...(process.env.NODE_ENV === 'development' && { errors: { stack: err.stack } }),
  };

  res.status(statusCode).json(response);
};