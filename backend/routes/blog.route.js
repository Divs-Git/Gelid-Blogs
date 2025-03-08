import express from 'express';
import {
  createBlog,
  deleteBlog,
  getAllBlogs,
  getSingleBlog,
} from '../controllers/blog.controller.js';
import { isAdmin, isAuthenticated } from '../middlewares/authUser.js';

const router = express.Router();

router.post('/create', isAuthenticated, isAdmin('admin'), createBlog);
router.delete('/delete/:id', isAuthenticated, isAdmin('admin'), deleteBlog);
router.get('/all-blogs', isAuthenticated, getAllBlogs);
router.get('/single-blog/:id', isAuthenticated, getSingleBlog);

export default router;
