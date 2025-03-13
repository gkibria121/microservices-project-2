import { Request, Response, Router } from "express";
import { body, validationResult } from "express-validator";
import { ValidationException } from "@_gktickets/common";
import Jwt from "jsonwebtoken";
import { AuthMiddleware } from "@_gktickets/common";
import "express-async-errors";
import { makeValidationError } from "@_gktickets/common";
import { ExceptionHandlerMiddleware } from "@_gktickets/common";
const router = Router();
declare global {
  namespace Express {
    interface Request {
      session?: {
        jwt?: string;
      };
    }
  }
}

router.use(ExceptionHandlerMiddleware);

export { router as apiRouter };
