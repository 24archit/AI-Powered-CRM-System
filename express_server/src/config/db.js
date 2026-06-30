"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const User_1 = __importDefault(require("../models/User"));
dotenv_1.default.config();
const seedDemoUsers = async () => {
    try {
        const adminPhone = '0000000000';
        const userPhone = '1111111111';
        const adminExists = await User_1.default.findOne({ phone: adminPhone });
        if (!adminExists) {
            await User_1.default.create({
                name: 'Demo Admin',
                phone: adminPhone,
                password: 'AdminPassword123',
                role: 'Admin'
            });
            console.log('✅ Demo Admin seeded.');
        }
        const userExists = await User_1.default.findOne({ phone: userPhone });
        if (!userExists) {
            await User_1.default.create({
                name: 'Demo User',
                phone: userPhone,
                password: 'UserPassword123',
                role: 'User'
            });
            console.log('✅ Demo User seeded.');
        }
    }
    catch (error) {
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
        await mongoose_1.default.connect(uri);
        console.log('✅ MongoDB Connected successfully.');
        await seedDemoUsers();
    }
    catch (error) {
        console.error('❌ MongoDB Connection Error:', error);
        process.exit(1);
    }
};
exports.default = connectDB;
//# sourceMappingURL=db.js.map