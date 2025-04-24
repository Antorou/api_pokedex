import { Request, Response } from 'express';
import * as userModel from '../models/userModels/userModel';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { dbConfig } from '../config';
import logger from '../logger';
import { RegisterRequest } from '../types/registerRequest';
import { LoginRequest } from '../types/loginRequest';

const saltRounds = 10;
const jwtSecret = dbConfig.jwtSecret;
const tokenExpiration = '1h';

// =======================================================
// REGISTER USER
// =======================================================
export const registerUser = async (
  req: Request<{}, {}, RegisterRequest>,
  res: Response
): Promise<void> => {
  try {
    const { username, email, password } = req.body;
    logger.info('Register attempt', { username, email });

    if (!username || !email || !password) {
      logger.warn('Missing required registration fields');
      res.status(400).json({ error: 'All fields are required' }); // 400 Bad Request
      return;
    }

    const existingUserByEmail = await userModel.findUserByEmail(email);
    if (existingUserByEmail) {
      logger.warn('Email already in use', { email });
      res.status(409).json({ error: 'Email already in use' }); // 409 Conflict
      return;
    }

    const existingUserByUsername = await userModel.findUserByUsername(username);
    if (existingUserByUsername) {
      logger.warn('Username already taken', { username });
      res.status(409).json({ error: 'Username already taken' }); // 409 Conflict
      return;
    }

    const password_hash = await bcrypt.hash(password, saltRounds);
    const newUser = await userModel.createUser({ username, email, password_hash });

    const token = jwt.sign(
      { userId: newUser.id, email: newUser.email },
      jwtSecret,
      { expiresIn: tokenExpiration }
    );

    const { password_hash: _, ...userWithoutPassword } = newUser;

    logger.info('User registered successfully', { userId: newUser.id });
    res.status(201).json({ // 201 Created
      message: 'User registered successfully',
      user: userWithoutPassword,
      token
    });
  } catch (error) {
    logger.error('Error in registerUser', error);
    res.status(500).json({ error: 'Internal server error' }); // 500 Internal Server Error
  }
};

export const loginUser = async (
  req: Request<{}, {}, LoginRequest>,
  res: Response
): Promise<void> => {
  try {
    const { email, password } = req.body;
    logger.info('Login attempt', { email });

    if (!email || !password) {
      logger.warn('Missing email or password on login');
      res.status(400).json({ error: 'Email and password are required' }); // 400 Bad Request
      return;
    }

    const user = await userModel.findUserByEmail(email);
    if (!user) {
      logger.warn('Login failed: user not found', { email });
      res.status(401).json({ error: 'Invalid credentials' }); // 401 Unauthorized
      return;
    }

    const passwordMatch = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatch) {
      logger.warn('Login failed: incorrect password', { userId: user.id });
      res.status(401).json({ error: 'Invalid credentials' }); // 401 Unauthorized
      return;
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      jwtSecret,
      { expiresIn: tokenExpiration }
    );

    const { password_hash: _, ...userWithoutPassword } = user;

    logger.info('Login successful', { userId: user.id });
    res.status(200).json({ // 200 OK
      message: 'Login successful',
      user: userWithoutPassword,
      token
    });
  } catch (error) {
    logger.error('Error in loginUser', error);
    res.status(500).json({ error: 'Internal server error' }); // 500 Internal Server Error
  }
};


export const getCurrentUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = (req as any).userId; // Set by auth middleware
    logger.info('Fetching current user', { userId });

    if (!userId) {
      logger.warn('Missing userId in request');
      res.status(400).json({ error: 'Invalid user session' }); // 400 Bad Request
      return;
    }

    const user = await userModel.findUserById(userId);
    if (!user) {
      logger.warn('User not found', { userId });
      res.status(404).json({ error: 'User not found' }); // 404 Not Found
      return;
    }

    const { password_hash: _, ...userWithoutPassword } = user;

    logger.info('Current user data sent', { userId });
    res.status(200).json(userWithoutPassword); // 200 OK
  } catch (error) {
    logger.error('Error in getCurrentUser', error);
    res.status(500).json({ error: 'Internal server error' }); // 500 Internal Server Error
  }
};
