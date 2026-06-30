import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
    name: string;
    phone: string;
    password?: string;
    role: 'User' | 'Admin';
    createdAt: Date;
    updatedAt: Date;
    comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema: Schema = new Schema({
    name: { type: String, required: true },
    phone: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['User', 'Admin'], default: 'User' },
}, {
    timestamps: true
});

// Hash password before saving
UserSchema.pre<IUser>('save', async function () {
    if (!this.isModified('password')) return;
    
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password as string, salt);
});

// Method to compare passwords
UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
    if (!this.password) return false;
    return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model<IUser>('User', UserSchema);
