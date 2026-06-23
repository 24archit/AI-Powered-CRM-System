import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
    try {
        const uri = process.env.MONGO_URI;
        if (!uri || uri === 'your_mongo_db_connection_string_here') {
            console.warn('⚠️ MongoDB URI is missing or using placeholder. Database will not connect.');
            return;
        }
        
        await mongoose.connect(uri);
        console.log('✅ MongoDB Connected successfully.');
    } catch (error) {
        console.error('❌ MongoDB Connection Error:', error);
        process.exit(1);
    }
};

export default connectDB;
