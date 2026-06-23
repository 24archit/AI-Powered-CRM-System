import { Router } from 'express';
import { createTicket, getTickets } from '../controllers/ticketController';

const router = Router();

router.post('/', createTicket);
router.get('/', getTickets);

export default router;
