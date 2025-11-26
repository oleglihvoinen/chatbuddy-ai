import { Router } from 'express';
import auth from '../middleware/auth.js';
import rateLimit from '../middleware/rateLimit.js';
import { createSession, listSessions, getSession, deleteSession, sendMessage } from '../controllers/chatController.js';

const router = Router();

router.use(auth);

router.post('/sessions', createSession);
router.get('/sessions', listSessions);
router.get('/sessions/:id', getSession);
router.delete('/sessions/:id', deleteSession);
router.post('/sessions/:id/message', rateLimit(500), sendMessage);

export default router;
