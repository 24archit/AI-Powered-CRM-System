import mongoose, { Schema, Document } from 'mongoose';

export interface ICustomer extends Document {
    name: string;
    email: string;
    phone?: string;
    company?: string;
    createdAt: Date;
    updatedAt: Date;
}

const CustomerSchema: Schema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String },
    company: { type: String }
}, {
    timestamps: true
});

export default mongoose.model<ICustomer>('Customer', CustomerSchema);
