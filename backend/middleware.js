import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import User from './models/user.js'; 

dotenv.config();

export default async function (req, res, next) {
  let token = req.header('x-auth-token');

  if (!token && req.headers.authorization?.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.user.id).select('-password');
    
    if (!user) {
      return res.status(401).json({ msg: 'User not found' });
    }

    req.user = user;

    next();
  } catch (err) {
    console.error('JWT error:', err);
    res.status(401).json({ msg: 'Token is not valid' });
  }
}
