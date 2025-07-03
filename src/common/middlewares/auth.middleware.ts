import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../../modules/user/user.model';
import { IUser } from '../types/user.type';
import ApiError from '../utils/ApiError';
import {envKey} from '../configs/key/key.config';


declare module 'express-serve-static-core' {
  interface Request {
    user?: IUser;
  }
}

export const protect = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        console.log("=== Auth Middleware Start ===");
        console.log("Headers:", req.headers);
        
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
            console.log("Token extracted:", token ? "Token exists" : "No token");
        }

        if (!token) {
            throw new ApiError(401, "Lỗi xác thực người dùng");
        }

        console.log("Verifying token...");
        const decoded = jwt.verify(token, envKey.jwt.jwt_access as string) as { userId: string };
        console.log("Token decoded:", decoded);

        const user = await User.findById(decoded.userId);
        console.log("User found:", user ? "Yes" : "No");

        if (!user) {
            throw new ApiError(401, "Lỗi xác thực người dùng"); 
        }

        // Ensure user object has _id
        if (!user._id) {
            throw new ApiError(401, "User ID không tồn tại");
        }

        // Convert to plain object and ensure _id is included
        req.user = {
            _id: user._id.toString(),
            email: user.email,
            password: user.password,
            role: user.role,
            isActive: user.isActive,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            isModified: user.isModified.bind(user),
            matchPassword: user.matchPassword.bind(user)
        };

        console.log("User set in request:", {
            _id: req.user._id,
            email: req.user.email,
            role: req.user.role
        });
        console.log("=== Auth Middleware End ===");
        next();
    } catch (error) {      
        console.error("Auth Middleware Error:", error);
        next(new ApiError(401, "Token không hợp lệ"));
    }
};

export const verifyRefreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) {
      throw new ApiError(401, 'Refresh token không được cung cấp');
    }

    const decoded = jwt.verify(refreshToken, envKey.jwt.jwt_refresh as string);
    if (!decoded || typeof decoded !== 'object' || !('userId' in decoded)) {
      throw new ApiError(401, 'Refresh token không hợp lệ');
    }

    const user = await User.findById((decoded as any).userId);
    if (!user) {
      throw new ApiError(401, 'Người dùng không tồn tại');
    }

    req.user = user;
    next();
  } catch (error: any) {
    console.error('[verifyRefreshToken]', error.message);
    throw new ApiError(401, 'Token không hợp lệ');
  }
};

// Middleware phân quyền
export const authorize = (...roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        const user = req.user as IUser;
        if (!user || !user.role) {
             throw new ApiError(401 , "Người dùng không có quyền !");  
        }
        if (!roles.includes(user.role)) {       
            throw new ApiError(401 , "Người dùng không có quyền !");
        }
        next();
    };
};

// middlewares/checkOwnership.ts

