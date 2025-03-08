import express from 'express';
import { login, logout, register } from '../controllers/user.controller.js';
import { isAuthenticated } from '../middlewares/authUser.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/logout', isAuthenticated, logout);

export default router;
