import express from 'express';
import userController from '../controllers/user.controller';

const router = express.Router();

router.get('/', userController.getUsers);
router.get('/:username', userController.getUserByUsername);
router.patch('/:username', userController.updateUser);
router.delete('/:username', userController.deleteUserByUsername);

export default router;
