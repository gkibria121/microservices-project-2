import { NextFunction, Request, Response } from "express";
import Jwt, { JwtPayload } from "jsonwebtoken";
import AuthException from "../Exceptions/AuthException";

declare global {
  namespace Express {
    interface Request {
      user: JwtPayload | null | string;
    }
  }
}

export default function AuthMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): any {
  try {
    const payload = Jwt.verify(req.session?.jwt, process.env.JWT_KEY!);

    req.user = payload;
  } catch (error) {
    throw new AuthException();
  }
  next();
}
