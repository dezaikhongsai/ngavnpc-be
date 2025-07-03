import { ObjectId } from "mongoose"

export interface IUser {
    _id ? : string;
    email : string;
    password : string;
    role : string;
    // profileId ?: ObjectId;
    isActive ?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
    isModified(arg0: string): boolean;
    matchPassword(enteredPassword: string): Promise<boolean>;
}

export interface IUserData {
    email : string,
    password : string,
    role : string,
    createdAt? : Date,
    updatedAt? : Date
}

export interface IActive {
    isActive : boolean
}
