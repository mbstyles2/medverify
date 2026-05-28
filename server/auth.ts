import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { UserInstance } from './db';

const JWT_SECRET = process.env.JWT_SECRET || 'MEDVERIFY_SECRET_JWT_KEY_2026';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    email: string;
    role: 'Admin' | 'Consumer' | 'Pharmacy' | 'Manufacturer';
    name: string;
  };
}

// Middleware to authenticate requests
export const authenticateToken = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired access token' });
    }
    req.user = user as AuthenticatedRequest['user'];
    next();
  });
};

// Middleware to check user authorization roles
export const requireRole = (roles: Array<'Admin' | 'Consumer' | 'Pharmacy' | 'Manufacturer'>) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: `Access forbidden: Required role of type [${roles.join(', ')}]` });
    }
    next();
  };
};

// Authentication Controller Endpoints
export const authController = {
  register: async (req: Request, res: Response) => {
    try {
      const { name, email, password, role, details } = req.body;

      if (!name || !email || !password || !role) {
        return res.status(400).json({ error: 'Name, email, password, and role are required' });
      }

      // Check for email conflicts
      const existingUser = await UserInstance.findOne({ where: { email } });
      if (existingUser) {
        return res.status(409).json({ error: 'An account with this email already exists' });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create user
      const user = await UserInstance.create({
        name,
        email,
        password: hashedPassword,
        role,
        details: details ? JSON.stringify(details) : '{}',
      });

      // Issue token instantly
      const token = jwt.sign(
        { id: user.get('id'), email, role, name },
        JWT_SECRET,
        { expiresIn: '30d' }
      );

      res.status(201).json({
        message: 'Account created successfully',
        token,
        user: {
          id: user.get('id'),
          name,
          email,
          role,
          details: details || {},
        },
      });
    } catch (error: any) {
      console.error('Registration failed:', error);
      res.status(500).json({ error: 'Registration failed due to server error' });
    }
  },

  login: async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
      }

      const user = await UserInstance.findOne({ where: { email } });
      if (!user) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      const isPasswordValid = await bcrypt.compare(password, user.get('password') as string);
      if (!isPasswordValid) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      const id = user.get('id') as number;
      const name = user.get('name') as string;
      const role = user.get('role') as any;
      let details = {};
      try {
        const detailsStr = user.get('details') as string;
        details = detailsStr ? JSON.parse(detailsStr) : {};
      } catch {
        details = {};
      }

      // Issue JWT
      const token = jwt.sign(
        { id, email, role, name },
        JWT_SECRET,
        { expiresIn: '30d' }
      );

      res.status(200).json({
        message: 'Login successful',
        token,
        user: {
          id,
          name,
          email,
          role,
          details,
        },
      });
    } catch (error: any) {
      console.error('Login failed:', error);
      res.status(500).json({ error: 'Login failed due to server error' });
    }
  },

  me: async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const user = await UserInstance.findByPk(req.user.id);
      if (!user) {
        return res.status(404).json({ error: 'User session not found' });
      }

      let details = {};
      try {
        const detailsStr = user.get('details') as string;
        details = detailsStr ? JSON.parse(detailsStr) : {};
      } catch {
        details = {};
      }

      res.status(200).json({
        user: {
          id: user.get('id'),
          name: user.get('name'),
          email: user.get('email'),
          role: user.get('role'),
          details,
        },
      });
    } catch (error: any) {
      res.status(500).json({ error: 'Server session gathering error' });
    }
  },
};
