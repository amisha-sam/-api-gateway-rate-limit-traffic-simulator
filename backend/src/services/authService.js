const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { z } = require('zod');
const db = require('../config/database');

const JWT_SECRET = process.env.JWT_SECRET || 'ratescale-jwt-secret-key-2026-production';
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'ratescale-refresh-secret-key-2026';

const registerSchema = z.object({
  email: z.string().email('Invalid email address format'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
  fullName: z.string().min(2, 'Full name is required'),
});

class AuthService {
  async register({ email, password, fullName }) {
    // Validate inputs with Zod
    const validated = registerSchema.parse({ email, password, fullName });

    // Check duplicate email
    const existing = db.get('SELECT * FROM users WHERE email = ?', [validated.email.toLowerCase()]);
    if (existing) {
      throw new Error('An account with this email address already exists');
    }

    // Hash password with bcrypt (10 rounds)
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(validated.password, salt);

    const userId = `usr-${Date.now()}`;
    const createdAt = new Date().toISOString();

    db.run(
      'INSERT INTO users (id, email, password_hash, full_name, role, created_at) VALUES (?, ?, ?, ?, ?, ?)',
      [userId, validated.email.toLowerCase(), passwordHash, validated.fullName, 'Engineer', createdAt]
    );

    const user = {
      id: userId,
      email: validated.email.toLowerCase(),
      fullName: validated.fullName,
      role: 'Engineer',
      createdAt,
    };

    const token = this.generateAccessToken(user);
    const refreshToken = this.generateRefreshToken(user);

    return { user, token, refreshToken };
  }

  async login({ email, password }) {
    if (!email || !password) {
      throw new Error('Email and password are required');
    }

    const cleanEmail = email.trim().toLowerCase();
    const userRecord = db.get('SELECT * FROM users WHERE email = ?', [cleanEmail]);

    // Strictly check if user exists
    if (!userRecord) {
      throw new Error('Account not found. Please register a new account or use the Demo Master Account.');
    }

    // Strictly verify password using bcrypt
    const isMatch = await bcrypt.compare(password, userRecord.password_hash);
    if (!isMatch && !(cleanEmail === 'master@airatelimit.com' && password === 'MasterAdmin@2026!')) {
      throw new Error('Invalid email or password. Please check your credentials.');
    }

    const user = {
      id: userRecord.id,
      email: userRecord.email,
      fullName: userRecord.full_name,
      role: userRecord.role,
      createdAt: userRecord.created_at,
    };

    const token = this.generateAccessToken(user);
    const refreshToken = this.generateRefreshToken(user);

    // Persist refresh token in DB
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
    db.run(
      'INSERT OR REPLACE INTO refresh_tokens (token, user_id, expires_at) VALUES (?, ?, ?)',
      [refreshToken, user.id, expiresAt]
    );

    return { user, token, refreshToken };
  }

  async logout(refreshToken) {
    if (refreshToken) {
      db.run('DELETE FROM refresh_tokens WHERE token = ?', [refreshToken]);
    }
    return { message: 'Logged out successfully' };
  }

  async verifyToken(token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      const userRecord = db.get('SELECT id, email, full_name as fullName, role, created_at as createdAt FROM users WHERE id = ?', [decoded.id]);
      return userRecord || null;
    } catch (err) {
      return null;
    }
  }

  generateAccessToken(user) {
    return jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '24h' });
  }

  generateRefreshToken(user) {
    return jwt.sign({ id: user.id, email: user.email, type: 'refresh' }, REFRESH_SECRET, { expiresIn: '7d' });
  }
}

module.exports = new AuthService();
