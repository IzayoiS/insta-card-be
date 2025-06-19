import express from 'express';
import linkController from '../controllers/link.controller';
import authMiddleware from '../middlewares/auth.middleware';

const router = express.Router();

router.get('/', linkController.getLinks);
router.post('/', authMiddleware, linkController.createLink);

export default router;
