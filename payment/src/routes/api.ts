import { Request, Response, Router } from "express";
import { body, validationResult } from "express-validator";
import {
  AuthMiddleware,
  NotFoundException,
  RequestValidatorMiddleware,
  ValidationException,
} from "@_gktickets/common";
import Jwt from "jsonwebtoken";
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

router.post(
  "/api/payments/pay",
  AuthMiddleware,
  [
    body("orderId").notEmpty().withMessage("Order Id is required"),
    body("token").notEmpty().withMessage("Token is required"),
  ],
  RequestValidatorMiddleware,
  async (req: Request, res: Response) => {
    // find order
    //check if order is valid or not
    // get token and pay order with stripe
    // save payment
    // publish payment created event
    // return payment
  }
);
router.use(ExceptionHandlerMiddleware);
export { router as apiRouter };
