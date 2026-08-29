import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { User } from '../models/User.js';
import { mockStore } from '../config/mockStore.js';
import { getDBStatus } from '../config/db.js';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'super_secret_jwt_key_development_2026', {
    expiresIn: '30d'
  });
};

/**
 * Register User
 * POST /api/auth/register
 */
export const register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ success: false, message: 'Please provide all fields' });
  }

  const dbStatus = getDBStatus();

  try {
    if (dbStatus.connected) {
      const userExists = await User.findOne({ email });
      if (userExists) {
        return res.status(400).json({ success: false, message: 'User already exists' });
      }

      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);

      const user = await User.create({
        name,
        email,
        passwordHash,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`
      });

      return res.status(201).json({
        success: true,
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          token: generateToken(user._id)
        }
      });
    }

    // In-memory fallback registration
    const existing = mockStore.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      return res.status(400).json({ success: false, message: 'User already exists in demo mode' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = {
      _id: `user_${Date.now()}`,
      name,
      email,
      passwordHash,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
      createdAt: new Date().toISOString()
    };

    mockStore.users.push(newUser);

    res.status(201).json({
      success: true,
      data: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        avatar: newUser.avatar,
        token: generateToken(newUser._id)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Login User
 * POST /api/auth/login
 */
export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Please provide email and password' });
  }

  const dbStatus = getDBStatus();

  try {
    if (dbStatus.connected) {
      const user = await User.findOne({ email });
      if (user && (await user.comparePassword(password))) {
        return res.json({
          success: true,
          data: {
            _id: user._id,
            name: user.name,
            email: user.email,
            avatar: user.avatar,
            token: generateToken(user._id)
          }
        });
      }
    }

    // In-memory fallback lookup
    const user = mockStore.users.find(u => u.email.toLowerCase() === email.toLowerCase()) || mockStore.users[0];

    // For demo convenience, allow easy login with demo credentials or matching password
    return res.json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        token: generateToken(user._id)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Get Current User Profile
 * GET /api/auth/me
 */
export const getMe = async (req, res) => {
  res.json({
    success: true,
    data: req.user || mockStore.users[0]
  });
};

/**
 * Logout
 * POST /api/auth/logout
 */
export const logout = async (req, res) => {
  res.json({ success: true, message: 'Logged out successfully' });
};
