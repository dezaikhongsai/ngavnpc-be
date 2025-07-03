import { IUser, IUserData } from '../../common/types/user.type';
import ApiError from '../../common/utils/ApiError';
import User from './user.model';

//service lưu các logic tạo , xem , xóa user

export const createUser = async (userData : IUserData) => {
    try {
         console.log("typeof userData:", typeof userData);
        console.log("userData:", userData);
        const newUser = await User.create(userData);
       
        if(!newUser) throw new ApiError(400 , 'Tạo user thất bại');
        return newUser;
    } catch (error : any) {
        throw new ApiError(400 , error.message);
    }
}

export const getUser = async () => {
    try {
        const users = await User.find();
        if(!users) throw new ApiError(400 , 'Không tìm thấy users');
        return users;
    } catch (error:any) {
        throw new ApiError(400 , error.message);
    }
}

export const deleteUser = async (userId : string) => {
    try {
        const deletedUser = await User.findByIdAndDelete(userId);
        if(!deletedUser) throw new ApiError(400 , 'Không tìm thấy user');
        return deletedUser;
    } catch (error : any) {
        throw new ApiError(400 , error.message);
    }
}

