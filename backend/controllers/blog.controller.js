import { Blog } from './../models/blog.model.js';
import { v2 as cloudinary } from 'cloudinary';

export const createBlog = async (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).json({ message: 'Blog image is required' });
  }

  const { blogImage } = req.files;
  const allowedFormats = ['image/jpeg', 'image/png', 'image/webp'];

  if (!allowedFormats.includes(blogImage.mimetype)) {
    return res.status(400).json({
      message: 'Invalid photo format. Only jpg and png are allowed',
    });
  }

  try {
    const { category, title, about } = req.body;
    if (!title || !category || !about) {
      return res
        .status(400)
        .json({ message: 'Please enter all the required fields' });
    }

    console.log(req.user);
    const adminName = req.user.name;
    const adminImage = req.user.photo;
    const createdBy = req.user._id;

    const clodinaryResponse = await cloudinary.uploader.upload(
      blogImage.tempFilePath
    );
    if (!clodinaryResponse || clodinaryResponse.error) {
      console.log(clodinaryResponse.response.error);
    }

    const blogData = new Blog({
      title,
      about,
      category,
      adminName,
      adminImage,
      createdBy,
      blogImage: {
        public_id: clodinaryResponse.public_id,
        url: clodinaryResponse.url,
      },
    });
    const blog = await Blog.create(blogData);

    res.status(201).json({ message: 'Blog created successfully', blog });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const deleteBlog = async (req, res) => {
  const { id } = req.params;

  const blog = await Blog.findById(id);
  if (!blog) {
    return res.status(404).json({ message: 'Blog does not exists' });
  }

  await blog.deleteOne();
  res.status(201).json({ message: 'Blog deleted successfully' });
};

export const getAllBlogs = async (req, res) => {
  const allBlogs = await Blog.find();
  res.status(200).json(allBlogs);
};
