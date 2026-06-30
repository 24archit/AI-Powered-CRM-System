import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './src/models/User';
import Ticket from './src/models/Ticket';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/agentic_crm';

async function seedDatabase() {
    try {
        console.log(`Connecting to MongoDB at ${MONGO_URI}...`);
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB.');

        // Delete existing data
        console.log('Clearing existing data...');
        await User.deleteMany({});
        await Ticket.deleteMany({});
        console.log('Database cleared.');

        // Seed Users
        console.log('Seeding users...');
        const adminUser = new User({
            name: 'Demo Admin',
            phone: '0000000000',
            password: 'AdminPassword123',
            role: 'Admin'
        });
        await adminUser.save();

        const regularUser1 = new User({
            name: 'Demo User 1',
            phone: '1111111111',
            password: 'UserPassword123',
            role: 'User'
        });
        await regularUser1.save();

        const regularUser2 = new User({
            name: 'John Doe',
            phone: '2222222222',
            password: 'UserPassword123',
            role: 'User'
        });
        await regularUser2.save();

        console.log('Users seeded.');

        // Seed Tickets
        console.log('Seeding tickets...');
        const tickets = [
            {
                user: regularUser1._id,
                subject: 'Need help with my account',
                description: 'I am unable to login to my dashboard since yesterday.',
                status: 'Open',
                aiProcessed: true,
                fraudRisk: 0.1,
                isDuplicate: false,
                duplicateMaxSimilarity: 0.0,
                aiSentiment: 'Negative',
                aiSentimentConfidence: 0.85,
                aiCategory: 'Technical Support',
                aiCategoryConfidence: 0.92,
                aiSuggestedResponse: 'I am sorry to hear that. Have you tried resetting your password?'
            },
            {
                user: regularUser2._id,
                subject: 'Refund request for recent purchase',
                description: 'I bought the premium plan but I want a refund because I did not use it.',
                status: 'In Progress',
                aiProcessed: true,
                fraudRisk: 0.85, // High fraud risk
                isDuplicate: false,
                duplicateMaxSimilarity: 0.0,
                aiSentiment: 'Neutral',
                aiSentimentConfidence: 0.75,
                aiCategory: 'Billing & Payments',
                aiCategoryConfidence: 0.88,
                aiSuggestedResponse: 'We have received your refund request. Please allow 3-5 business days for processing.'
            },
            {
                user: regularUser1._id,
                subject: 'Login issue (Duplicate)',
                description: 'My dashboard is not working, I cannot log in at all.',
                status: 'Open',
                aiProcessed: true,
                fraudRisk: 0.2,
                isDuplicate: true, // Duplicate
                duplicateMaxSimilarity: 0.95,
                aiSentiment: 'Negative',
                aiSentimentConfidence: 0.89,
                aiCategory: 'Technical Support',
                aiCategoryConfidence: 0.94,
                aiSuggestedResponse: 'Please clear your browser cache and try again.'
            },
            {
                user: regularUser2._id,
                subject: 'How do I upgrade my plan?',
                description: 'I love this service! How can I upgrade to the enterprise plan?',
                status: 'Resolved',
                aiProcessed: true,
                fraudRisk: 0.05,
                isDuplicate: false,
                duplicateMaxSimilarity: 0.0,
                aiSentiment: 'Positive',
                aiSentimentConfidence: 0.98,
                aiCategory: 'Sales Inquiry',
                aiCategoryConfidence: 0.91,
                aiSuggestedResponse: 'You can upgrade your plan from the Billing section of your dashboard.'
            }
        ];

        await Ticket.insertMany(tickets);
        console.log('Tickets seeded.');

        console.log('Seed completed successfully!');
    } catch (error) {
        console.error('Error seeding database:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB.');
    }
}

seedDatabase();
