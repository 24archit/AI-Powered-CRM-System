import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db';
import ticketRoutes from './routes/ticketRoutes';
import customerRoutes from './routes/customerRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 2424;

// Middleware
app.use(cors());
app.use(express.json());

// Connect Database
connectDB();

// Routes
app.use('/api/customers', customerRoutes);
app.use('/api/tickets', ticketRoutes);

// Health Endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'Express CRM API is running' });
});

app.listen(PORT, () => {
    console.log(`🚀 CRM Express Server is running on http://localhost:${PORT}`);
});
