import { ApiResponse } from '../../common/types/api.type';
import { IProfileData } from '../../common/types/profile.type';
import { IActive } from '../../common/types/user.type';
import {
    createProfile,
    getMe,
    updateProfileById
} from './profile.service';
import {Request , Response , NextFunction} from 'express';
import ApiError from '../../common/utils/ApiError';

export const createProfileController = async(req : Request , res : Response , next : NextFunction) => {
    try {
        const {name , dob , emailContact , phoneContact} = req.body;
        
        if (!req.user?._id) {
            throw new ApiError(401, "Không tìm thấy thông tin người dùng");
        }
        
        const userId = req.user._id.toString();
        console.log("uId ----- " , userId);
        
        const userData : IActive = {
            isActive : true
        }
        const profileData : IProfileData = {
            name : name ,
            dob : dob,
            emailContact : emailContact,
            phoneContact: phoneContact
        } 
        const newProfile= await createProfile(userId , profileData , userData); 
        const response : ApiResponse<any> = {
            status :'success',
            message : 'Tạo thông tin mới thành công !',
            data : newProfile
        }
        res.status(201).json(response);
    } catch (error) {
        next(error);
    }
}

export const getMeController = async (req : Request , res : Response , next : NextFunction) => {
    try {
        const userId = req.user?._id;
        const userProfile = await getMe(userId as string);
        const response : ApiResponse<typeof userProfile> = {
            status : 'success',
            message : 'Lấy thông tin tài khoản thành công !',
            data : userProfile,
        }
        res.status(200).json(response);
    } catch (error) {
        next(error);
    }
}

export const updateProfileController = async (req : Request , res : Response , next : NextFunction) => {
    try {
        const userId = req.user?._id as string;
        console.log("UId" ,userId)
        const { name , dob , emailContact , phoneContact} = req.body;
        const profileData : IProfileData = {
            name  : name,
            dob : dob,
            emailContact : emailContact,
            phoneContact: phoneContact,
            updatedAt : new Date()
        }
        const updatedProfile = await updateProfileById(profileData, userId);
        const response: ApiResponse<typeof updatedProfile> = {
            status: 'success',
            message: 'Cập nhật thông tin thành công!',
            data: updatedProfile
        };
        res.status(200).json(response);
    } catch (error) {
        next(error);
    }
}