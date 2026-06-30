"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startFallbackPoller = void 0;
const Ticket_1 = __importDefault(require("../models/Ticket"));
const axios_1 = __importDefault(require("axios"));
const DL_SERVER_URL = process.env.DL_SERVER_URL || 'http://localhost:8000';
const startFallbackPoller = () => {
    // Poll every 5 minutes (300,000 ms)
    setInterval(async () => {
        try {
            const unprocessedTickets = await Ticket_1.default.find({ aiProcessed: false, status: 'Open' });
            if (unprocessedTickets.length === 0)
                return;
            console.log(`[Fallback Poller] Found ${unprocessedTickets.length} unprocessed tickets. Retrying AI pipeline...`);
            const recentOpenTickets = await Ticket_1.default.find({ status: 'Open', aiProcessed: true }).limit(50);
            const openTicketsTexts = recentOpenTickets.map(t => t.description);
            for (const ticket of unprocessedTickets) {
                try {
                    let englishText = ticket.description;
                    const transRes = await axios_1.default.post(`${DL_SERVER_URL}/translate`, { text: ticket.description });
                    englishText = transRes.data.translated_text || ticket.description;
                    const analyzeRes = await axios_1.default.post(`${DL_SERVER_URL}/analyze`, { text: englishText });
                    ticket.aiSentiment = analyzeRes.data.sentiment.prediction;
                    ticket.aiSentimentConfidence = analyzeRes.data.sentiment.confidence;
                    ticket.aiCategory = analyzeRes.data.ticket_category.prediction;
                    ticket.aiCategoryConfidence = analyzeRes.data.ticket_category.confidence;
                    const ragRes = await axios_1.default.post(`${DL_SERVER_URL}/ask-rag`, { question: englishText });
                    ticket.aiSuggestedResponse = ragRes.data.answer;
                    if (openTicketsTexts.length > 0) {
                        const dupRes = await axios_1.default.post(`${DL_SERVER_URL}/duplicate-check`, {
                            current_text: englishText,
                            open_tickets_texts: openTicketsTexts
                        });
                        ticket.isDuplicate = dupRes.data.is_duplicate;
                        ticket.duplicateMaxSimilarity = dupRes.data.max_similarity;
                    }
                    ticket.aiProcessed = true;
                    await ticket.save();
                    console.log(`[Fallback Poller] Successfully processed ticket ${ticket._id}`);
                }
                catch (err) {
                    console.error(`[Fallback Poller] Still failing to process ticket ${ticket._id}`);
                }
            }
        }
        catch (error) {
            console.error('[Fallback Poller] Error fetching tickets:', error);
        }
    }, 300000); // 5 mins
};
exports.startFallbackPoller = startFallbackPoller;
//# sourceMappingURL=fallbackPoller.js.map