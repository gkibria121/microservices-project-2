import { Request, Response, Router } from "express";
import { body, validationResult } from "express-validator";
import {
  AuthMiddleware,
  NotAuthorized,
  NotFoundException,
  OrderStatus,
  RequestValidatorMiddleware,
  ValidationException,
} from "@_gktickets/common";
import Jwt from "jsonwebtoken";
import "express-async-errors";
import { makeValidationError } from "@_gktickets/common";
import { ExceptionHandlerMiddleware } from "@_gktickets/common";
import Order from "../models/Order";
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
    const { orderId } = req.body;
    const order = await Order.findOne({
      _id: orderId,
    });
    if (!order) {
      throw new NotFoundException();
    }
    if (order.status === OrderStatus.Cancelled) {
      throw new NotAuthorized();
    }

    // get token and pay order with stripe
    // save payment

    // publish payment created event
    // return payment
  }
);
router.use(ExceptionHandlerMiddleware);
export { router as apiRouter };
