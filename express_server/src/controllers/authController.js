"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key';
const ADMIN_SECRET = process.env.ADMIN_SECRET || 'SecretAdmin2026';
const register = async (req, res) => {
    try {
        const { name, phone, password, adminSecret } = req.body;
        const existingUser = await User_1.default.findOne({ phone });
        if (existingUser) {
            res.status(400).json({ message: 'User with this phone number already exists' });
            return;
        }
        let role = 'User';
        if (adminSecret) {
            if (adminSecret === ADMIN_SECRET) {
                role = 'Admin';
            }
            else {
                res.status(403).json({ message: 'Invalid admin secret' });
                return;
            }
        }
        const user = new User_1.default({ name, phone, password, role });
        await user.save();
        res.status(201).json({ message: 'User registered successfully', role });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
exports.register = register;
const login = async (req, res) => {
    try {
        const { phone, password } = req.body;
        const user = await User_1.default.findOne({ phone });
        if (!user) {
            res.status(401).json({ message: 'Invalid credentials' });
            return;
        }
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            res.status(401).json({ message: 'Invalid credentials' });
            return;
        }
        const token = jsonwebtoken_1.default.sign({ userId: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });
        res.status(200).json({
            message: 'Logged in successfully',
            token,
            user: { id: user._id, name: user.name, phone: user.phone, role: user.role }
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
exports.login = login;
//# sourceMappingURL=authController.js.map