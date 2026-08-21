import express from 'express';
import { registerUser, verifyOTP, forgotPassword, resetPassword, googleLogin, LoginUser } from '../controllers/auth.controller.js';

const router = express.Router();
router.post('/register', registerUser);
router.post('/login', LoginUser);
router.post('/verify-otp', verifyOTP);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/google', googleLogin);

export default router;
