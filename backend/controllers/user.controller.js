import { User } from './../models/user.model.js';
import { v2 as cloudinary } from 'cloudinary';
import bcrypt from 'bcryptjs';
import { createTokenAndSaveCookies } from '../jwt/authToken.js';

export const register = async (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res
      .status(400)
      .json({ message: 'User Profile Picture is required' });
  }

  const { photo } = req.files;
  const allowedFormats = ['image/jpeg', 'image/png', 'image/webp'];

  if (!allowedFormats.includes(photo.mimetype)) {
    return res.status(400).json({
      message: 'Invalid photo format. Only jpg and png are allowed',
    });
  }

  try {
    const { name, email, password, role, education, phone } = req.body;
    if (!email || !name || !password || !role || !education || !phone) {
      return res
        .status(400)
        .json({ message: 'Please enter all the required fields' });
    }

    const user = await User.findOne({ email });
    if (user) {
      return res
        .status(400)
        .json({ message: 'User already exists with this email' });
    }

    const clodinaryResponse = await cloudinary.uploader.upload(
      photo.tempFilePath
    );
    if (!clodinaryResponse || clodinaryResponse.error) {
      console.log(clodinaryResponse.response.error);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      email,
      name,
      password: hashedPassword,
      role,
      education,
      phone,
      photo: {
        public_id: clodinaryResponse.public_id,
        url: clodinaryResponse.url,
      },
    });
    await newUser.save();

    if (newUser) {
      const token = await createTokenAndSaveCookies(newUser._id, res);
      res
        .status(201)
        .json({ message: 'User registered successfully', newUser, token });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    if (!email || !password || !role) {
      return res
        .status(400)
        .json({ message: 'Please enter all the required field' });
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user.password) {
      return res.status(400).json({ message: 'Password is missing' });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!user || !isPasswordMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    if (user.role !== role) {
      return res.status(400).json({ message: `Given role ${role} not found` });
    }

    const token = await createTokenAndSaveCookies(user._id, res);
    res.status(200).json({
      message: 'User logged in successfully',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};
