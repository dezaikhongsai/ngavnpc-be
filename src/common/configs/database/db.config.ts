import mongoose from 'mongoose';
import {envKey} from '../key/key.config'
const connectDB = async () => {
    try {
        await mongoose.connect(envKey.db.uri as string , {dbName : envKey.db.name});
        console.log(`Connected to MongoDB Database: ${envKey.db.name} in local`);
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1);    
        
    }
   }
export default connectDB;