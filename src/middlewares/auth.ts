import { Request, Response, NextFunction } from 'express';
import { auth } from '../auth';
import getHeaders from '@/utils/getHeaders';

export interface AuthenticatedRequest extends Request {
  user?: any;
  session?: any;
}

export const authenticateUser = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const session = await auth.api.getSession({
      headers: getHeaders(req.headers),
    });

    if (!session) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    req.user = session.user;
    req.session = session.session;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid session' });
  }
};

export const optionalAuth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const session = await auth.api.getSession({
      headers: getHeaders(req.headers),
    });

    if (session) {
      req.user = session.user;
      req.session = session.session;
    }

    next();
  } catch (error) {
    // Continue without authentication if session is invalid
    next();
  }
};