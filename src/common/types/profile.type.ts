import { ObjectId } from "mongoose";

export interface IProfile {
    _id : ObjectId
    userId : ObjectId
    name : string,
    dob : Date,
    emailContact : string
    phoneContact : string
    createdAt? : Date,
    updatedAt? : Date,
}

export interface IProfileData{
    name : string,
    dob : string,
    emailContact : string
    phoneContact : string
    createdAt? : Date,
    updatedAt? : Date,
}

export interface IProfileResponse {
    _id: string;
    userId: string;
    name: string;
    dob: string;  // Format dd/mm/yyyy
    emailContact: string;
    phoneContact: string;
    createdAt?: string;
    updatedAt?: string;
}