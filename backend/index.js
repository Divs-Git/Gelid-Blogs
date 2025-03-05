import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

const app = express();
dotenv.config();

const port = process.env.PORT;
const MONGO_URL = process.env.MONGO_URI;

try {
  mongoose.connect(MONGO_URL);
  console.log('Connected to Mongo DB');
} catch (error) {
  console.log(error);
}

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
