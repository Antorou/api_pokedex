import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload, VerifyErrors } from 'jsonwebtoken';
import { dbConfig } from '../config';
import logger from '../logger';

declare module 'jsonwebtoken' {
  export interface JwtPayload {
    userId: number;
    email: string;
  }
}

export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    logger.warn('Authentication failed: no token provided');
    res.status(401).json({ error: 'Authentication token required' });
    return;
  }

  logger.info('Authenticating token...');

  jwt.verify(
    token,
    dbConfig.jwtSecret,
    (err: VerifyErrors | null, decoded: JwtPayload | string | undefined) => {
      if (err) {
        logger.error('JWT verification error', { error: err.message });
        res.status(403).json({ error: 'Invalid or expired token' });
        return;
      }

      if (!decoded || typeof decoded === 'string') {
        logger.warn('JWT payload is invalid or malformed');
        res.status(403).json({ error: 'Invalid token payload' });
        return;
      }

      const { userId, email } = decoded;

      if (!userId || !email) {
        logger.warn('Token missing required fields', { decoded });
        res.status(403).json({ error: 'Invalid token payload' });
        return;
      }

      (req as any).userId = userId;

      logger.info('Token authenticated successfully', { userId, email });
      next();
    }
  );
};
