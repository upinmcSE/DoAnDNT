import mongoose from "mongoose";

const connectDB = async () => {
    try{
        const conn = await mongoose.connect(process.env.MONGO_URI)
        console.log(`MongoDB Connected: successfully`);
    }catch(error){
        if(error.code == 8000){
            throw new Error('Invalid connection string');
        }else if(error.code == 'ENOTFOUND'){
            throw new Error('Invalid host');
        }else if(error.code == 'ECONNREFUSED'){
            throw new Error('Invalid port');
        }
        throw new Error('Error connecting to database');
    }
}

export default connectDB;