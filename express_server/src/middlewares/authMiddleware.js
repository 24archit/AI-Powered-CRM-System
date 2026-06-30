"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizeAdmin = exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key';
const authenticate = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];
    if (!token) {
        res.status(401).json({ message: 'No token, authorization denied' });
        return;
    }
    try {
        if (!JWT_SECRET) {
            throw new Error('JWT_SECRET is not defined');
        }
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch (error) {
        res.status(401).json({ message: 'Invalid token' });
    }
};
exports.authenticate = authenticate;
const authorizeAdmin = (req, res, next) => {
    if (!req.user || req.user.role !== 'Admin') {
        res.status(403).json({ message: 'Admin access required' });
        return;
    }
    next();
};
exports.authorizeAdmin = authorizeAdmin;
//# sourceMappingURL=authMiddleware.js.map