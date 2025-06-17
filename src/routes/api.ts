import express from 'express';
import authRoute from './auth.route';
import linkRoute from './link.route';
import profileRoute from './profile.route';
import userRoute from './user.route';

const router = express.Router();

router.use('/auth', authRoute);
router.use('/link', linkRoute);
router.use('/profile', profileRoute);
router.use('/user', userRoute);

export default router;
