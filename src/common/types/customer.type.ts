import { Types } from "mongoose";

export interface ICustomer {
    _id?: Types.ObjectId | string;
    name: string;
    yearOfBirth: number;
    phoneNumber: string;
    note?: string;
    isPriod?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
    createdBy?: Types.ObjectId | string;
    updatedBy?: Types.ObjectId | string;
}