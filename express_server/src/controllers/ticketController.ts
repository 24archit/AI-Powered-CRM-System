import { Request, Response } from 'express';
import axios from 'axios';
import Ticket from '../models/Ticket';
import Customer from '../models/Customer';

const DL_SERVER_URL = process.env.DL_SERVER_URL || 'http://localhost:8000';

export const createTicket = async (req: Request, res: Response): Promise<void> => {
    try {
        const { customerId, subject, description } = req.body;

        // Verify customer exists
        const customer = await Customer.findById(customerId);
        if (!customer) {
            res.status(404).json({ message: 'Customer not found' });
            return;
        }

        // 1. Call AI DL-Server for Classification (Sentiment & Ticket)
        let aiSentiment = 'Neutral';
        let aiSentimentConf = 0;
        let aiCategory = 'General Inquiry';
        let aiCategoryConf = 0;

        try {
            const analyzeRes = await axios.post(`${DL_SERVER_URL}/analyze`, {
                text: description
            });
            aiSentiment = analyzeRes.data.sentiment.prediction;
            aiSentimentConf = analyzeRes.data.sentiment.confidence;
            aiCategory = analyzeRes.data.ticket_category.prediction;
            aiCategoryConf = analyzeRes.data.ticket_category.confidence;
        } catch (error) {
            console.error('DL Server Classification failed, falling back to defaults');
        }

        // 2. Call AI DL-Server for RAG Auto-Response Draft
        let aiSuggestedResponse = '';
        try {
            const ragRes = await axios.post(`${DL_SERVER_URL}/ask-rag`, {
                question: description
            });
            aiSuggestedResponse = ragRes.data.answer;
        } catch (error) {
            console.error('DL Server RAG failed');
        }

        // 3. Save to MongoDB
        const newTicket = new Ticket({
            customer: customer._id,
            subject,
            description,
            status: 'Open',
            aiSentiment,
            aiSentimentConfidence: aiSentimentConf,
            aiCategory,
            aiCategoryConfidence: aiCategoryConf,
            aiSuggestedResponse
        });

        await newTicket.save();

        res.status(201).json({
            message: 'Ticket created and AI-triaged successfully',
            ticket: newTicket
        });

    } catch (error: any) {
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
};

export const getTickets = async (req: Request, res: Response): Promise<void> => {
    try {
        const tickets = await Ticket.find().populate('customer', 'name email');
        res.status(200).json(tickets);
    } catch (error: any) {
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
};
