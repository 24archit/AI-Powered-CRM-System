import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

import connectDB from './config/db';
import ticketRoutes from './routes/ticketRoutes';
import authRoutes from './routes/authRoutes';
import { startFallbackPoller } from './services/fallbackPoller';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 2424;

// Security Middlewares
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' })); // Increase limit for image uploads

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Connect Database
connectDB();

// Start Background Services
startFallbackPoller();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tickets', ticketRoutes);

// Health Endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'Express CRM API is running' });
});

app.listen(PORT, () => {
    console.log(`🚀 CRM Express Server is running on http://localhost:${PORT}`);
});
