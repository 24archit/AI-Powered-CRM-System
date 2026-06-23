import { Router, Request, Response } from 'express';
import Customer from '../models/Customer';

const router = Router();

router.post('/', async (req: Request, res: Response) => {
    try {
        const customer = new Customer(req.body);
        await customer.save();
        res.status(201).json(customer);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

router.get('/', async (req: Request, res: Response) => {
    try {
        const customers = await Customer.find();
        res.status(200).json(customers);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
