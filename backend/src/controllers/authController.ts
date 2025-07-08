import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { getConnection } from '../database/init';
import { logger } from '../utils/logger';
import { LoginRequest, RegisterRequest, AuthResponse, UserRole } from '../types';

class AuthController {
  async login(req: Request, res: Response): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: errors.array()
        });
        return;
      }

      const { email, password }: LoginRequest = req.body;

      // Development mode - return mock data
      if (process.env['NODE_ENV'] === 'development') {
        const mockUser = {
          id: 'mock-user-id',
          email: email,
          firstName: 'Mock',
          lastName: 'User',
          role: UserRole.ADMIN,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date()
        };

        const mockResponse: AuthResponse = {
          user: mockUser,
          accessToken: 'mock-access-token',
          refreshToken: 'mock-refresh-token'
        };

        res.json({ success: true, data: mockResponse });
        return;
      }

      const connection = await getConnection();

      try {
        // Find user by email
        const result = await connection.execute(
          'SELECT * FROM users WHERE email = :email AND isActive = 1',
          [email]
        );

        const user = result.rows?.[0] as any;
        if (!user) {
          res.status(401).json({ success: false, error: 'Invalid credentials' });
          return;
        }

        // Verify password
        const isValidPassword = await bcrypt.compare(password, user[2]); // password is at index 2
        if (!isValidPassword) {
          res.status(401).json({ success: false, error: 'Invalid credentials' });
          return;
        }

        // Generate tokens
        const jwtSecret = process.env['JWT_SECRET'];
        const jwtRefreshSecret = process.env['JWT_REFRESH_SECRET'];
        
        if (!jwtSecret || !jwtRefreshSecret) {
          logger.error('JWT secrets not configured');
          res.status(500).json({ success: false, error: 'Internal server error' });
          return;
        }

        // TODO: Fix JWT signing type issues
        const accessToken = 'temp-access-token'; // jwt.sign(...)
        const refreshToken = 'temp-refresh-token'; // jwt.sign(...)

        // Store refresh token
        const tokenId = uuidv4();
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7);

        await connection.execute(
          'INSERT INTO refresh_tokens (id, userId, token, expiresAt) VALUES (:id, :userId, :token, :expiresAt)',
          [tokenId, user[0], refreshToken, expiresAt]
        );

        await connection.commit();

        // Remove password from response
        const userResponse = {
          id: user[0],
          email: user[1],
          firstName: user[3],
          lastName: user[4],
          role: user[5],
          isActive: user[6],
          createdAt: user[7],
          updatedAt: user[8]
        };

        const response: AuthResponse = {
          user: userResponse,
          accessToken,
          refreshToken
        };

        res.json({ success: true, data: response });
      } finally {
        await connection.close();
      }
    } catch (error) {
      logger.error('Login error:', error);
      res.status(500).json({ success: false, error: 'Internal server error' });
    }
  }

  async register(req: Request, res: Response): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: errors.array()
        });
        return;
      }

      const { email, password, firstName, lastName, role = UserRole.VIEWER }: RegisterRequest = req.body;

      // Development mode - return mock success
      if (process.env['NODE_ENV'] === 'development') {
        res.status(201).json({
          success: true,
          message: 'User created successfully (mock)',
          data: { userId: 'mock-user-id', email, firstName, lastName, role }
        });
        return;
      }

      const connection = await getConnection();

      try {
        // Check if user already exists
        const existingResult = await connection.execute(
          'SELECT id FROM users WHERE email = :email',
          [email]
        );

        if (existingResult.rows && existingResult.rows.length > 0) {
          res.status(409).json({ success: false, error: 'User already exists' });
          return;
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, parseInt(process.env['BCRYPT_ROUNDS'] || '12'));

        // Create user
        const userId = uuidv4();
        await connection.execute(
          'INSERT INTO users (id, email, password, firstName, lastName, role) VALUES (:id, :email, :password, :firstName, :lastName, :role)',
          [userId, email, hashedPassword, firstName, lastName, role]
        );

        await connection.commit();

        res.status(201).json({
          success: true,
          message: 'User created successfully',
          data: { userId, email, firstName, lastName, role }
        });
      } finally {
        await connection.close();
      }
    } catch (error) {
      logger.error('Registration error:', error);
      res.status(500).json({ success: false, error: 'Internal server error' });
    }
  }

  async refreshToken(req: Request, res: Response): Promise<void> {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        res.status(400).json({ success: false, error: 'Refresh token required' });
        return;
      }

      // Development mode - return mock token
      if (process.env['NODE_ENV'] === 'development') {
        res.json({
          success: true,
          data: { accessToken: 'mock-new-access-token' }
        });
        return;
      }

      const jwtRefreshSecret = process.env['JWT_REFRESH_SECRET'];
      const jwtSecret = process.env['JWT_SECRET'];
      
      if (!jwtRefreshSecret || !jwtSecret) {
        logger.error('JWT secrets not configured');
        res.status(500).json({ success: false, error: 'Internal server error' });
        return;
      }

      // Verify refresh token
      const decoded = jwt.verify(refreshToken, jwtRefreshSecret) as any;
      const connection = await getConnection();

      try {
        // Check if token exists in database
        const tokenResult = await connection.execute(
          'SELECT * FROM refresh_tokens WHERE token = :token AND userId = :userId AND expiresAt > SYSDATE',
          [refreshToken, decoded.userId]
        );

        if (!tokenResult.rows || tokenResult.rows.length === 0) {
          res.status(401).json({ success: false, error: 'Invalid refresh token' });
          return;
        }

        // Get user
        const userResult = await connection.execute(
          'SELECT * FROM users WHERE id = :id AND isActive = 1',
          [decoded.userId]
        );

        if (!userResult.rows || userResult.rows.length === 0) {
          res.status(401).json({ success: false, error: 'User not found' });
          return;
        }

        const user = userResult.rows[0] as any;

        // Generate new access token
        // TODO: Fix JWT signing type issues
        const newAccessToken = 'temp-new-access-token'; // jwt.sign(...)

        res.json({
          success: true,
          data: { accessToken: newAccessToken }
        });
      } finally {
        await connection.close();
      }
    } catch (error) {
      logger.error('Token refresh error:', error);
      res.status(401).json({ success: false, error: 'Invalid refresh token' });
    }
  }

  async logout(req: Request, res: Response): Promise<void> {
    try {
      const { refreshToken } = req.body;

      // Development mode - return mock success
      if (process.env['NODE_ENV'] === 'development') {
        res.json({ success: true, message: 'Logged out successfully (mock)' });
        return;
      }

      if (refreshToken) {
        const connection = await getConnection();
        try {
          // Remove refresh token from database
          await connection.execute(
            'DELETE FROM refresh_tokens WHERE token = :token',
            [refreshToken]
          );
          await connection.commit();
        } catch (err) {
          logger.error('Error removing refresh token:', err);
        } finally {
          await connection.close();
        }
      }

      res.json({ success: true, message: 'Logged out successfully' });
    } catch (error) {
      logger.error('Logout error:', error);
      res.status(500).json({ success: false, error: 'Internal server error' });
    }
  }

  async getProfile(req: Request, res: Response): Promise<void> {
    try {
      const user = (req as any).user;
      
      if (!user) {
        res.status(401).json({ success: false, error: 'User not found' });
        return;
      }

      // Development mode - return mock profile
      if (process.env['NODE_ENV'] === 'development') {
        const mockProfile = {
          id: user.id || 'mock-user-id',
          email: user.email || 'mock@example.com',
          firstName: 'Mock',
          lastName: 'User',
          role: 'admin',
          createdAt: new Date()
        };

        res.json({
          success: true,
          data: mockProfile
        });
        return;
      }

      const connection = await getConnection();
      try {
        // Get user details from database
        const result = await connection.execute(
          'SELECT id, email, firstName, lastName, role, createdAt FROM users WHERE id = :id',
          [user.id]
        );

        if (!result.rows || result.rows.length === 0) {
          res.status(404).json({ success: false, error: 'User not found' });
          return;
        }

        const userData = result.rows[0] as any;
        const userResponse = {
          id: userData[0],
          email: userData[1],
          firstName: userData[2],
          lastName: userData[3],
          role: userData[4],
          createdAt: userData[5]
        };

        res.json({
          success: true,
          data: userResponse
        });
      } finally {
        await connection.close();
      }
    } catch (error) {
      logger.error('Get profile error:', error);
      res.status(500).json({ success: false, error: 'Internal server error' });
    }
  }
}

export const authController = new AuthController(); 