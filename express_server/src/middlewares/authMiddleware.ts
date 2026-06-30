import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key';

export interface AuthRequest extends Request {
    user?: {
        userId: string;
        role: string;
    };
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction): void => {
    const token = req.header('Authorization')?.split(' ')[1];

    if (!token) {
        res.status(401).json({ message: 'No token, authorization denied' });
        return;
    }

    try {
        if (!JWT_SECRET) {
            throw new Error('JWT_SECRET is not defined');
        }
        
        const decoded = jwt.verify(token, JWT_SECRET) as unknown as { userId: string; role: string };
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid token' });
    }
};

export const authorizeAdmin = (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user || req.user.role !== 'Admin') {
        res.status(403).json({ message: 'Admin access required' });
        return;
    }
    next();
};
