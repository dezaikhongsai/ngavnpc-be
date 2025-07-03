import mongoose , {Model} from 'mongoose';
import { ICustomer } from '../../common/types/customer.type';

export const customerSchema = new mongoose.Schema<ICustomer>({
    name : {type : String , required: true},
    yearOfBirth : {type : Number, required: true},
    phoneNumber : {type : String , unique : true, required: true},
    note : {type : String },
    isPriod : {type : Boolean , default : false},
    createdBy : {type : mongoose.Schema.Types.ObjectId , ref : "User", required: true },
    updatedBy : {type : mongoose.Schema.Types.ObjectId , ref : "User", required: true}
} , {
    timestamps : true,

})
 
const Customer : Model<ICustomer> = mongoose.model<ICustomer>('Customer' , customerSchema);
export default Customer;