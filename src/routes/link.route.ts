import express from 'express';
import linkController from '../controllers/link.controller';
import authMiddleware from '../middlewares/auth.middleware';

const router = express.Router();

router.get('/', authMiddleware, linkController.getLinks);
router.post('/', authMiddleware, linkController.createLink);
router.delete('/:id', authMiddleware, linkController.deleteLink);
router.patch('/:id', authMiddleware, linkController.updateLink);

export default router;
