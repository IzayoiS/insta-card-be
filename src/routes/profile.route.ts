import express from 'express';
import profileController from '../controllers/profile.controller';
import authMiddleware from '../middlewares/auth.middleware';

const router = express.Router();

router.delete('/:userId', authMiddleware, profileController.deleteProfile);
router.patch('/:userId', authMiddleware, profileController.updateProfile);
router.get('/:userId', authMiddleware, profileController.getProfileById);

export default router;
