import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import userRoute from './routes/user.route.js';
import blogRoute from './routes/blog.route.js';
import fileUpload from 'express-fileupload';
import { v2 as cloudinary } from 'cloudinary';
import cookieParser from 'cookie-parser';

const app = express();
dotenv.config();

const port = process.env.PORT;
const MONGO_URL = process.env.MONGO_URI;

app.use(express.json());
app.use(cookieParser());
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: '/tmp/',
  })
);

try {
  mongoose.connect(MONGO_URL);
  console.log('Connected to Mongo DB');
} catch (error) {
  console.log(error);
}

// cloudinary  setup
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_SECRET_KEY, // Click 'View API Keys' above to copy your API secret
});

// routes
app.use('/api/users', userRoute);
app.use('/api/blogs', blogRoute);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
