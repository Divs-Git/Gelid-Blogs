import { User } from '../models/user.model.js';
import jwt from 'jsonwebtoken';

// Authentication
export const isAuthenticated = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      return res.status(401).json({ error: 'User not authenticated' });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    // console.log(decoded);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(404).json({ error: 'User not Found' });
    }
    req.user = user;
    next();
  } catch (error) {
    console.log('Error occured during authentication', error);
    return res.status(401).json({ error: 'User not authenticated' });
  }
};

// Authorization
export const isAdmin = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(401).json({
        error: `User with given role: ${req.user.role} not allowed`,
      });
    }
    next();
  };
};
