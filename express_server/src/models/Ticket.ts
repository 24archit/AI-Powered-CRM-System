import mongoose, { Schema, Document } from 'mongoose';

export interface ITicket extends Document {
    customer: mongoose.Types.ObjectId;
    subject: string;
    description: string;
    status: 'Open' | 'In Progress' | 'Resolved' | 'Closed';
    
    // AI Generated Fields
    aiSentiment?: string;
    aiSentimentConfidence?: number;
    aiCategory?: string;
    aiCategoryConfidence?: number;
    aiSuggestedResponse?: string;
    
    createdAt: Date;
    updatedAt: Date;
}

const TicketSchema: Schema = new Schema({
    customer: { type: Schema.Types.ObjectId, ref: 'Customer', required: true },
    subject: { type: String, required: true },
    description: { type: String, required: true },
    status: { type: String, enum: ['Open', 'In Progress', 'Resolved', 'Closed'], default: 'Open' },
    
    aiSentiment: { type: String },
    aiSentimentConfidence: { type: Number },
    aiCategory: { type: String },
    aiCategoryConfidence: { type: Number },
    aiSuggestedResponse: { type: String }
}, {
    timestamps: true
});

export default mongoose.model<ITicket>('Ticket', TicketSchema);
