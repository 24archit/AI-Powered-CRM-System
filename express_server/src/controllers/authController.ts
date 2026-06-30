import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key';
const ADMIN_SECRET = process.env.ADMIN_SECRET || 'SecretAdmin2026';

export const register = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, phone, password, adminSecret } = req.body;

        const existingUser = await User.findOne({ phone });
        if (existingUser) {
            res.status(400).json({ message: 'User with this phone number already exists' });
            return;
        }

        let role: 'User' | 'Admin' = 'User';
        if (adminSecret) {
            if (adminSecret === ADMIN_SECRET) {
                role = 'Admin';
            } else {
                res.status(403).json({ message: 'Invalid admin secret' });
                return;
            }
        }

        const user = new User({ name, phone, password, role });
        await user.save();

        res.status(201).json({ message: 'User registered successfully', role });
    } catch (error: any) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { phone, password } = req.body;

        const user = await User.findOne({ phone });
        if (!user) {
            res.status(401).json({ message: 'Invalid credentials' });
            return;
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            res.status(401).json({ message: 'Invalid credentials' });
            return;
        }

        const token = jwt.sign(
            { userId: user._id, role: user.role },
            JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.status(200).json({
            message: 'Logged in successfully',
            token,
            user: { id: user._id, name: user.name, phone: user.phone, role: user.role }
        });
    } catch (error: any) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
