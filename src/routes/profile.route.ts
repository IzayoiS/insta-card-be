import express from 'express';
import profileController from '../controllers/profile.controller';
import authMiddleware from '../middlewares/auth.middleware';

const router = express.Router();

router.delete('/:id', authMiddleware, profileController.deleteProfile);
router.patch('/:id', authMiddleware, profileController.updateProfile);
router.get('/:id', profileController.getProfileById);

export default router;
