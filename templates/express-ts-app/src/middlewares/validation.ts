import { Request, Response, NextFunction } from 'express';

export const validateUser = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { name, email } = req.body;

  if (!name || !email) {
    res.status(400).json({
      success: false,
      message: 'Name and email are required',
    });
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    res.status(400).json({
      success: false,
      message: 'Invalid email format',
    });
    return;
  }

  next();
};