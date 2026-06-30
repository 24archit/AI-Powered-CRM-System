"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTickets = exports.createTicket = void 0;
const axios_1 = __importDefault(require("axios"));
const Ticket_1 = __importDefault(require("../models/Ticket"));
const User_1 = __importDefault(require("../models/User"));
const DL_SERVER_URL = process.env.DL_SERVER_URL || 'http://localhost:8000/api';
const createTicket = async (req, res) => {
    try {
        const { subject, description } = req.body;
        const userId = req.user?.userId;
        const user = await User_1.default.findById(userId);
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        // AI Pipeline Variables
        let aiSentiment = 'Neutral';
        let aiSentimentConf = 0;
        let aiCategory = 'General Inquiry';
        let aiCategoryConf = 0;
        let aiSuggestedResponse = '';
        let aiProcessed = false;
        let fraudRisk = 0.0;
        let isDuplicate = false;
        let duplicateMaxSimilarity = 0.0;
        const { uploaded_image_b64, product_image_b64 } = req.body;
        try {
            // Step 1: Multilingual Translation (to English)
            const transRes = await axios_1.default.post(`${DL_SERVER_URL}/translate`, { text: description });
            const englishText = transRes.data.translated_text || description;
            // Step 2: Vision Fraud Detection
            if (uploaded_image_b64 && product_image_b64) {
                const visionRes = await axios_1.default.post(`${DL_SERVER_URL}/vision-fraud`, {
                    uploaded_image_b64,
                    product_image_b64
                });
                fraudRisk = visionRes.data.fraud_risk;
            }
            // Step 3: Core NLP Analysis (Sentiment & Category)
            const analyzeRes = await axios_1.default.post(`${DL_SERVER_URL}/analyze`, { text: englishText });
            aiSentiment = analyzeRes.data.sentiment.prediction;
            aiSentimentConf = analyzeRes.data.sentiment.confidence;
            aiCategory = analyzeRes.data.ticket_category.prediction;
            aiCategoryConf = analyzeRes.data.ticket_category.confidence;
            // Step 4: Knowledge Retrieval (RAG)
            const ragRes = await axios_1.default.post(`${DL_SERVER_URL}/ask-rag`, { question: englishText });
            aiSuggestedResponse = ragRes.data.answer;
            // Step 5: Duplicate Detection
            // Fetch recent open tickets to compare
            const recentOpenTickets = await Ticket_1.default.find({ status: 'Open' }).limit(50);
            const openTicketsTexts = recentOpenTickets.map(t => t.description);
            if (openTicketsTexts.length > 0) {
                const dupRes = await axios_1.default.post(`${DL_SERVER_URL}/duplicate-check`, {
                    current_text: englishText,
                    open_tickets_texts: openTicketsTexts
                });
                isDuplicate = dupRes.data.is_duplicate;
                duplicateMaxSimilarity = dupRes.data.max_similarity;
            }
            // Step 6: Native Language Output
            aiProcessed = true;
        }
        catch (error) {
            console.error('DL Server processing failed. Ticket will be queued for fallback polling.');
        }
        const newTicket = new Ticket_1.default({
            user: userId,
            subject,
            description,
            status: 'Open',
            aiProcessed,
            fraudRisk,
            isDuplicate,
            duplicateMaxSimilarity,
            aiSentiment,
            aiSentimentConfidence: aiSentimentConf,
            aiCategory,
            aiCategoryConfidence: aiCategoryConf,
            aiSuggestedResponse
        });
        await newTicket.save();
        res.status(201).json({
            message: 'Ticket created successfully',
            ticket: newTicket
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
};
exports.createTicket = createTicket;
const getTickets = async (req, res) => {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        const role = req.user?.role;
        let tickets;
        if (role === 'Admin') {
            tickets = await Ticket_1.default.find().populate('user', 'name phone');
        }
        else {
            tickets = await Ticket_1.default.find({ user: userId }).populate('user', 'name phone');
        }
        res.status(200).json(tickets);
    }
    catch (error) {
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
};
exports.getTickets = getTickets;
//# sourceMappingURL=ticketController.js.map