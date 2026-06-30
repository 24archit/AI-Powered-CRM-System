import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User';

dotenv.config();

const seedDemoUsers = async () => {
    try {
        const adminPhone = '0000000000';
        const userPhone = '1111111111';

        const adminExists = await User.findOne({ phone: adminPhone });
        if (!adminExists) {
            await User.create({
                name: 'Demo Admin',
                phone: adminPhone,
                password: 'AdminPassword123',
                role: 'Admin'
            });
            console.log('✅ Demo Admin seeded.');
        }

        const userExists = await User.findOne({ phone: userPhone });
        if (!userExists) {
            await User.create({
                name: 'Demo User',
                phone: userPhone,
                password: 'UserPassword123',
                role: 'User'
            });
            console.log('✅ Demo User seeded.');
        }
    } catch (error) {
        console.error('❌ Failed to seed demo users:', error);
    }
};

const connectDB = async () => {
    try {
        const uri = process.env.MONGO_URI;
        if (!uri || uri === 'your_mongo_db_connection_string_here') {
            console.warn('⚠️ MongoDB URI is missing or using placeholder. Database will not connect.');
            return;
        }
        
        await mongoose.connect(uri);
        console.log('✅ MongoDB Connected successfully.');

        await seedDemoUsers();
    } catch (error) {
        console.error('❌ MongoDB Connection Error:', error);
        process.exit(1);
    }
};

export default connectDB;
