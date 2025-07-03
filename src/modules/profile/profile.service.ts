import Profile from './profile.model';
import ApiError from '../../common/utils/ApiError';
import { IProfile, IProfileData, IProfileResponse } from '../../common/types/profile.type';
import User from '../user/user.model';
import { IActive } from '../../common/types/user.type';

const parseDateString = (dateString: string): Date => {
    // Tách chuỗi ngày tháng và chuyển thành số
    const [day, month, year] = dateString.split('/').map(Number);
    
    // Kiểm tra tính hợp lệ của ngày tháng
    if (month < 1 || month > 12) {
        throw new ApiError(400, 'Tháng không hợp lệ (1-12)');
    }
    if (day < 1 || day > 31) {
        throw new ApiError(400, 'Ngày không hợp lệ (1-31)');
    }
    if (year < 1900 || year > new Date().getFullYear()) {
        throw new ApiError(400, 'Năm không hợp lệ');
    }

    // Tạo date với giờ là 00:00:00 theo giờ địa phương
    const date = new Date(year, month - 1, day, 0, 0, 0);
    
    // Kiểm tra xem ngày có hợp lệ không (ví dụ: 31/04 là không hợp lệ)
    if (date.getDate() !== day || date.getMonth() !== month - 1 || date.getFullYear() !== year) {
        throw new ApiError(400, 'Ngày tháng không hợp lệ');
    }

    return date;
};

const formatProfileResponse = (profile: IProfile): IProfileResponse => {
    const formattedProfile: IProfileResponse = {
        _id: profile._id.toString(),
        userId: profile.userId.toString(),
        name: profile.name,
        dob: profile.dob ? `${profile.dob.getDate().toString().padStart(2, '0')}/${(profile.dob.getMonth() + 1).toString().padStart(2, '0')}/${profile.dob.getFullYear()}` : '',
        emailContact: profile.emailContact,
        phoneContact: profile.phoneContact,
        createdAt: profile.createdAt?.toISOString(),
        updatedAt: profile.updatedAt?.toISOString()
    };
    return formattedProfile;
};

export const createProfile = async (userId: string, profileData: IProfileData, userData: IActive): Promise<IProfileResponse> => {
    try {
        // Kiểm tra user trước khi tạo profile
        const availableUser = await User.findById(userId);
        if (!availableUser) {
            throw new ApiError(400, 'Không tìm thấy người dùng!');
        }
        if (availableUser.isActive) {
            throw new ApiError(400, 'Người dùng đã có thông tin!');
        }

        // Tạo profile với userId và chuyển đổi ngày tháng
        const newProfileUser = await Profile.create({
            name: profileData.name,
            emailContact: profileData.emailContact,
            phoneContact: profileData.phoneContact,
            userId: userId,
            dob: profileData.dob ? parseDateString(profileData.dob) : undefined
        });
        
        if (!newProfileUser) {
            throw new ApiError(400, 'Tạo thông tin thất bại');
        }

        // Cập nhật trạng thái user
        const userUpdate = await User.findByIdAndUpdate(userId, userData);
        if (!userUpdate) {
            await Profile.findByIdAndDelete(newProfileUser._id);
            throw new ApiError(400, 'Cập nhật thông tin thất bại');
        }

        const formattedProfile: IProfileResponse = {
            _id: newProfileUser._id.toString(),
            userId: newProfileUser.userId.toString(),
            name: newProfileUser.name,
            dob: newProfileUser.dob ? `${newProfileUser.dob.getDate().toString().padStart(2, '0')}/${(newProfileUser.dob.getMonth() + 1).toString().padStart(2, '0')}/${newProfileUser.dob.getFullYear()}` : '',
            emailContact: newProfileUser.emailContact,
            phoneContact: newProfileUser.phoneContact,
            createdAt: newProfileUser.createdAt?.toISOString(),
            updatedAt: newProfileUser.updatedAt?.toISOString()
        };

        return formattedProfile;
    } catch (error: any) {
        throw new ApiError(500, error.message);
    }
}

export const getMe = async (userId: string): Promise<IProfileResponse> => {
    try {
        const me = await Profile.findOne({ userId: userId });
        if (!me) throw new ApiError(400, 'Profile không hợp lệ !');

        return formatProfileResponse(me);
    } catch (error: any) {
        throw new ApiError(500, error.message);
    }
}

export const updateProfileById = async (profileData: IProfileData, userId: string): Promise<IProfileResponse> => {
    try {
        const updatedProfile = await Profile.findOneAndUpdate(
            { userId: userId },
            {
                name: profileData.name,
                emailContact: profileData.emailContact,
                phoneContact: profileData.phoneContact,
                dob: profileData.dob ? parseDateString(profileData.dob) : undefined
            },
            { new: true }
        );
        
        if (!updatedProfile) {
            throw new ApiError(400, 'Cập nhật thông tin người dùng thất bại hoặc ngoài quyền truy cập!');
        }

        return formatProfileResponse(updatedProfile);
    } catch (error: any) {
        throw new ApiError(500, error.message);
    }
}