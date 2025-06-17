import express from 'express';
import linkController from '../controllers/link.controller';
import authMiddleware from '../middlewares/auth.middleware';

const router = express.Router();

router.get('/link', linkController.getLinks);
router.post('/link', authMiddleware, linkController.createLink);

export default router;
