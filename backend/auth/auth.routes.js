import { Router } from "express";
import * as authController from "./auth.controller.js";

const router = Router();

router.post('/register', authController.registerUser);
router.post('/login', authController.LoginUser);
router.post('/verify-otp', authController.verifyOTP);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);
router.post('/google', authController.googleLogin);

export default router;
