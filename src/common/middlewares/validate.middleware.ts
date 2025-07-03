import { Request, Response, NextFunction } from 'express';
import { ObjectSchema } from 'joi';
import ApiError from '../utils/ApiError'; // Bạn đã có file này

export const validate = (schema: ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      const messages = error.details.map((d) => d.message);
      // Ném lỗi lên tầng xử lý chung
      return next(new ApiError(400, messages.join('; ')));
    }
    next();
  };
};
