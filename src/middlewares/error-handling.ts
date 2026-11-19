import { AppError } from '@/utils/AppError';
import { ErrorRequestHandler } from 'express';
import { z, ZodError } from 'zod';
import { Request, Response, NextFunction } from 'express';

export const errorHandling: ErrorRequestHandler = (
    error,
    req,
    res,
    next
) => {
    if (error instanceof AppError) {
        res.status(error.statusCode).json({ message: error.message })
        return
    }

    if (error instanceof ZodError) {
        res.status(400).json({ message: "Validation error", issues: error.format() })
        return
    }

    res.status(500).json({ message: error.message })
    return
}