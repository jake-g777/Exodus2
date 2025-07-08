import { Request, Response } from 'express';

export const notFoundHandler = (req: Request, res: Response): void => {
  res.status(404).json({
    error: {
      message: `Route ${req.originalUrl} not found`,
      code: 'NOT_FOUND'
    },
    timestamp: new Date().toISOString(),
    path: req.path
  });
}; 