import {NextFunction, Request , Response} from 'express';
import {
    login,
    refreshToken
} from './auth.service';
import {envKey} from '../../common/configs/key/key.config'
import { ApiResponse } from '../../common/types/api.type';
import { IUser } from '../../common/types/user.type';
import ApiError from '../../common/utils/ApiError';

// Extend Express Request interface to include 'user'
declare global {
    namespace Express {
        interface Request {
            user?: IUser;
        }
    }
}

export const loginController = async (req : Request , res : Response , next : NextFunction) => {
    try {
        const {email , password} = req.body;
        const userInfor = await login(email , password);
        
        // Set refresh token in HTTP-only cookie
        res.cookie('refreshToken', userInfor.refreshToken, {
            httpOnly: envKey.cookie.httpOnly,
            secure: envKey.cookie.secure,
            sameSite: envKey.cookie.sameSite,
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            path: '/'
        });

        res.cookie('accessToken', userInfor.accessToken, {
            httpOnly: envKey.cookie.httpOnly,
            secure: envKey.cookie.secure,
            sameSite: envKey.cookie.sameSite,
            maxAge: 1 * 24 * 60 * 60 * 1000, // 1 day
            path: '/'
        });

        const response : ApiResponse<any> = {
            status: "success",
            message: "Đăng nhập thành công !",
            data: {
                _id: userInfor.user._id.toString(),
                email: userInfor.user.email,
                role: userInfor.user.role,
                isActive : userInfor.user.isActive,
                accessToken: userInfor.accessToken,
                ...(userInfor.user.isActive && userInfor.profile ? { profile: userInfor.profile } : {})
                // Don't send refresh token in response body for security
            }
        }
        res.status(200).json(response);
    } catch (error) {
        next(error);
    }
}

export const logoutController = async (req : Request , res : Response , next : NextFunction)=>{
    try {
        // Clear refresh token cookie
        res.clearCookie('refreshToken', {
            httpOnly: envKey.cookie.httpOnly,
            secure: envKey.cookie.secure,
            sameSite: envKey.cookie.sameSite,
            path: '/'
        });
           res.clearCookie('accessToken', {
            httpOnly: envKey.cookie.httpOnly,
            secure: envKey.cookie.secure,
            sameSite: envKey.cookie.sameSite,
            path: '/'
        });

        const response : ApiResponse<any> = {
            status: "success",
            message: "Đăng xuất thành công !"
        }
        
        res.status(200).json(response);
    } catch (error) {
        next(error)
    }
}

export const refreshTokenController = async (req : Request , res : Response , next :NextFunction)=>{
    try {
        const user = req.user as IUser;
        if(!user || !user._id){
            throw new ApiError(400, 'Không tìm thấy user');
        }
        const {accessToken , user:userData , profile:profileData} = await refreshToken(user._id.toString());
        const response : ApiResponse<any> = {
            status : "success",
            message : "Refresh Token thành công",
            data : {
                accessToken,
                user : {
                    _id : userData.id,
                    email : userData.email,
                    role : userData.role
                },
                profile : profileData ? {
                    _id : profileData._id,
                    userId : profileData.userId,
                    name : profileData.name,
                    dob : profileData.dob,
                    emailContact : profileData.emailContact,
                    phoneContact : profileData.phoneContact
                } : undefined
            }
        };
        res.status(200).json(response);
    } catch (error) {
        next(error);
    }
}