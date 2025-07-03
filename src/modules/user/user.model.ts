import mongoose, { Model } from 'mongoose';
import bcrypt from 'bcryptjs';
import {envKey} from '../../common/configs/key/key.config'
import { IUser } from '../../common/types/user.type';

const userSchema = new mongoose.Schema<IUser>(
    {
        email : {type : String , required : true , unique : true , trim : true},
        password : {type : String , required : true , unique : true , trim : true},
        role : {type : String , enum : ['admin' , 'staff'] , default : 'staff'},
        isActive : {type : Boolean , default : false}
    },{timestamps : true}
)

userSchema.pre<IUser>('save' , async function (next) {
   if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt( Number(envKey.app.passwordSlat) || 10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
})

userSchema.methods.matchPassword = async function (
  enteredPassword: string
): Promise<boolean> {
  return bcrypt.compare(enteredPassword, this.password);
};

const User: Model<IUser> = mongoose.model<IUser>('User', userSchema);
export default User;