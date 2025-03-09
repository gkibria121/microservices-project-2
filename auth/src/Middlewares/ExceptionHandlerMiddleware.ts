import { NextFunction, Request, Response } from "express";
import { CustomError } from "../contracts/CustomErrorContract";
export default function ValidationExceptionMiddleware(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): any {
  // Check for CustomError instance
  if (error instanceof CustomError) {
    return res.status(error.statusCode).json(error.serializeErrors());
  }

  // Fallback for unhandled errors
  res.status(500).json({ message: error.message });
}
