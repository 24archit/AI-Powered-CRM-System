import mongoose, { Schema, Document } from 'mongoose';

export interface ITicket extends Document {
    user: mongoose.Types.ObjectId;
    subject: string;
    description: string;
    status: 'Open' | 'In Progress' | 'Resolved' | 'Closed';
    
    // AI Generated Fields
    aiProcessed: boolean;
    fraudRisk: number;
    isDuplicate: boolean;
    duplicateMaxSimilarity: number;
    aiSentiment?: string;
    aiSentimentConfidence?: number;
    aiCategory?: string;
    aiCategoryConfidence?: number;
    aiSuggestedResponse?: string;
    
    createdAt: Date;
    updatedAt: Date;
}

const TicketSchema: Schema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    subject: { type: String, required: true },
    description: { type: String, required: true },
    status: { type: String, enum: ['Open', 'In Progress', 'Resolved', 'Closed'], default: 'Open' },
    
    aiProcessed: { type: Boolean, default: false },
    fraudRisk: { type: Number, default: 0.0 },
    isDuplicate: { type: Boolean, default: false },
    duplicateMaxSimilarity: { type: Number, default: 0.0 },
    aiSentiment: { type: String },
    aiSentimentConfidence: { type: Number },
    aiCategory: { type: String },
    aiCategoryConfidence: { type: Number },
    aiSuggestedResponse: { type: String }
}, {
    timestamps: true,
    optimisticConcurrency: true // Enables Mongoose __v checking for atomic OCC
});

export default mongoose.model<ITicket>('Ticket', TicketSchema);
