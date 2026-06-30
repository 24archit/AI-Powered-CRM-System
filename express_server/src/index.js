"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const helmet_1 = __importDefault(require("helmet"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const db_1 = __importDefault(require("./config/db"));
const ticketRoutes_1 = __importDefault(require("./routes/ticketRoutes"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const fallbackPoller_1 = require("./services/fallbackPoller");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 2424;
// Security Middlewares
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)());
app.use(express_1.default.json({ limit: '10mb' })); // Increase limit for image uploads
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);
// Connect Database
(0, db_1.default)();
// Start Background Services
(0, fallbackPoller_1.startFallbackPoller)();
// Routes
app.use('/api/auth', authRoutes_1.default);
app.use('/api/tickets', ticketRoutes_1.default);
// Health Endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'Express CRM API is running' });
});
app.listen(PORT, () => {
    console.log(`🚀 CRM Express Server is running on http://localhost:${PORT}`);
});
//# sourceMappingURL=index.js.map