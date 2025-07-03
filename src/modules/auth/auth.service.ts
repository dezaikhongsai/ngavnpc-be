import User from '../user/user.model';
import {genAccessToken , genRefreshToken} from '../../common/utils/jwt.util';
import ApiError from '../../common/utils/ApiError';
import Profile from '../profile/profile.model';

export const login = async (email : string , password : string) => {
    try {
        const user = await User.findOne({email : email});
        if(!user) throw new ApiError(400 , 'Không tìm thấy thông tin tài khoản, vui lòng kiểm tra lại !');
        const isMactch = await user.matchPassword(password);
        if(!isMactch) throw new ApiError(400 , 'Không tìm thấy thông tin tài khoản, vui lòng kiểm tra lại !');
        const accessToken = genAccessToken(user._id);
        const refreshToken = genRefreshToken(user._id);
        if(user.isActive){
            const profile = await Profile.findOne({userId : user._id});
            return {
                user,
                profile, 
                accessToken,
                refreshToken
            }
        }
       else {
         return{
            user,
            accessToken,
            refreshToken
        }
       }
    } catch (error : any) {
        throw new ApiError(400 , error.message)
    }
}

export const refreshToken = async (userId : string) => {
    try {
        const user = await User.findById(userId);
        if(!user) throw new ApiError(400, 'Tài khoản không tồn tại');
        const accessToken = genAccessToken(user._id);
        const profile = user.isActive ? await Profile.findOne({userId: user._id}) : null;
        return {
            user,
            accessToken,
            profile
        };
   } catch (error : any) {
        throw new ApiError(400 , error.message);
   }
}