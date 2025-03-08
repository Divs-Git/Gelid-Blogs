import express from 'express';
import { createBlog, deleteBlog } from '../controllers/blog.controller.js';
import { isAdmin, isAuthenticated } from '../middlewares/authUser.js';

const router = express.Router();

router.post('/create', isAuthenticated, isAdmin('admin'), createBlog);
router.delete('/delete/:id', isAuthenticated, isAdmin('admin'), deleteBlog);

export default router;
