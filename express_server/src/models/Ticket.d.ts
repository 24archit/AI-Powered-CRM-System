import mongoose, { Document } from 'mongoose';
export interface ITicket extends Document {
    user: mongoose.Types.ObjectId;
    subject: string;
    description: string;
    status: 'Open' | 'In Progress' | 'Resolved' | 'Closed';
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
declare const _default: mongoose.Model<ITicket, {}, {}, {}, mongoose.Document<unknown, {}, ITicket, {}, mongoose.DefaultSchemaOptions> & ITicket & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, ITicket>;
export default _default;
//# sourceMappingURL=Ticket.d.ts.map