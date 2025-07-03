import mongoose , {Model} from 'mongoose';
import {IProfile} from '../../common/types/profile.type';

const profileSchema = new mongoose.Schema<IProfile>(
    {
        userId : {type : mongoose.Schema.Types.ObjectId , ref : 'User' , required : true , unique : true},
        name : {type : String , required : true},
        dob : {type : Date , default : Date.now()},
        emailContact : {type : String , unique : true},
        phoneContact : {type : String , unique : true},
    }, {timestamps : true}
)

const Profile : Model<IProfile> = mongoose.model<IProfile>('Profile' , profileSchema);
export default Profile;