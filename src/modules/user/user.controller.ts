import { ApiResponse } from '../../common/types/api.type';
import { IUserData } from '../../common/types/user.type';
import {
    createUser,
    getUser,
    deleteUser
} from './user.service';
import {NextFunction, Request , Response} from 'express';

export const createUserController = async (req : Request , res : Response , next :NextFunction) => {
    try {
        const {email  , password , role } = req.body;
        console.log(req.body); // Thêm dòng này trước khi tạo user
        const userData : IUserData = {
            email : email,
            password : password,
            role : role,
        }
        const newUser = await createUser(userData);
        const response : ApiResponse<typeof newUser> = {
            status: "success",
            message : "Đăng ký thành viên thành công",
            data: newUser
        }
        res.status(201).json(response);
    } catch (error) {
        next(error);
    }
}

export const getUserController = async (req : Request , res : Response , next : NextFunction) => {
    try {
        const users = await getUser();
        const response : ApiResponse<typeof users> = {
            status : "success",
            message : "Lấy danh sách tài khoản thành công",
            data : users
        }
        res.status(200).json(response);
    } catch (error) {
        next(error);
    }
}

export const deletedUserController = async (req : Request , res : Response , next :NextFunction) => {
    try {
        const {userId} = req.params;
        const deletedUser =await deleteUser(userId);
        const response : ApiResponse<typeof deletedUser> = {
            status : "success",
            message : "Xóa tài khoản thành công !",
            data : deletedUser
        }
        res.status(200).json(response);
    } catch (error) {
        next(error); 
    }
}