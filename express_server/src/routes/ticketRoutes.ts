import { Router } from 'express';
import { createTicket, getTickets } from '../controllers/ticketController';
import { authenticate } from '../middlewares/authMiddleware';

const router = Router();

router.use(authenticate);
router.post('/', createTicket);
router.get('/', getTickets);

export default router;
