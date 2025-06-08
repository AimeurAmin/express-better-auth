import { Request, Response, NextFunction } from 'express';
import { createError } from './error';

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): { isValid: boolean; message?: string } => {
  if (password.length < 8) {
    return { isValid: false, message: 'Password must be at least 8 characters long' };
  }
  
  if (!/(?=.*[a-z])/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one lowercase letter' };
  }
  
  if (!/(?=.*[A-Z])/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one uppercase letter' };
  }
  
  if (!/(?=.*\d)/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one number' };
  }

  return { isValid: true };
};

export const validateRegistration = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { email, password, name } = req.body;

  if (!email || !password || !name) {
    throw createError('Email, password, and name are required', 400);
  }

  if (!validateEmail(email)) {
    throw createError('Invalid email format', 400);
  }

  const passwordValidation = validatePassword(password);
  if (!passwordValidation.isValid) {
    throw createError(passwordValidation.message!, 400);
  }

  if (name.trim().length < 2) {
    throw createError('Name must be at least 2 characters long', 400);
  }

  next();
};

export const validateLogin = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw createError('Email and password are required', 400);
  }

  if (!validateEmail(email)) {
    throw createError('Invalid email format', 400);
  }

  next();
};