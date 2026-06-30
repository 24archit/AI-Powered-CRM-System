"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ticketController_1 = require("../controllers/ticketController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = (0, express_1.Router)();
router.use(authMiddleware_1.authenticate);
router.post('/', ticketController_1.createTicket);
router.get('/', ticketController_1.getTickets);
exports.default = router;
//# sourceMappingURL=ticketRoutes.js.map