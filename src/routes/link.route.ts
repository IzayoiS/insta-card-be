import express from 'express';
import linkController from '../controllers/link.controller';
import authMiddleware from '../middlewares/auth.middleware';

const router = express.Router();

router.get('/', authMiddleware, linkController.getLinks);
router.post('/', authMiddleware, linkController.createLink);

export default router;
