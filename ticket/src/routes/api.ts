import { Request, Response, Router } from "express";
import { body, validationResult } from "express-validator";
import { ValidationException } from "@_gktickets/common";
import Jwt from "jsonwebtoken";
import { AuthMiddleware } from "@_gktickets/common";
import "express-async-errors";
import { makeValidationError } from "@_gktickets/common";
import { ExceptionHandlerMiddleware } from "@_gktickets/common";
import TicketModel from "../models/Ticket";
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
  "/api/tickets/create",
  AuthMiddleware,
  [
    body("title").notEmpty().withMessage("Title is required"),
    body("price")
      .notEmpty()
      .isFloat({ gt: 0 })
      .withMessage("Price must be  greater then 0"),
  ],

  async (req: Request, res: Response) => {
    const validated = validationResult(req);
    if (!validated.isEmpty()) {
      throw new ValidationException(validated.array());
    }
    const { title, price } = req.body;
    const Ticket = await TicketModel.create({
      title,
      price,
    });
    res.status(201).json({
      message: "Ticket created!",
      data: {
        ...Ticket.toJSON(),
      },
    });
  }
);

router.use(ExceptionHandlerMiddleware);

export { router as apiRouter };
