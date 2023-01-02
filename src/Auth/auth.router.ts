import express from 'express';
import 'express-async-errors';
import { loginUser, registerUser, logout, forgotPassword, resetPassword } from './auth.controller';
import { validateLogin, validateRegister } from './auth.validator';
import { authorization } from './auth.controller';

const router = express.Router();

router.post('/login', validateLogin, loginUser);

router.post('/register', validateRegister, registerUser);

router.post('/forgot-password', forgotPassword);

router.post('/reset-password/:token', resetPassword);

router.get('/logout', authorization, logout);

export default router;
