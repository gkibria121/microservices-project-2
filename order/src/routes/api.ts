import { Request, Response, Router } from "express";
import { body, validationResult } from "express-validator";
import {
  makeValidationError,
  NotAuthorized,
  NotFoundException,
  OrderStatus,
  RequestValidatorMiddleware,
  ValidationException,
} from "@_gktickets/common";
import { AuthMiddleware } from "@_gktickets/common";
import "express-async-errors";
import { ExceptionHandlerMiddleware } from "@_gktickets/common";
import Order from "../models/Order";
import Ticket from "../models/Ticket";

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
  "/api/orders/create",
  AuthMiddleware,
  [body("ticketId").notEmpty().withMessage("Ticket Id is required.")],
  RequestValidatorMiddleware,

  async (req: Request, res: Response) => {
    const { ticketId } = req.body;
    const existingOrder = await Order.findOne({ ticket: ticketId });
    if (existingOrder) {
      throw new ValidationException([
        makeValidationError("ticketId", "Ticket is already reserved"),
      ]);
    }
    const ticket = await Ticket.findOne({
      _id: ticketId,
    });

    if (!ticket) {
      throw new NotFoundException();
    }
    const order = await Order.create({
      userId: req.user.id,
      expiresAt: new Date().toString(),
      ticket: ticket,
    });
    res.status(201).send(order);
  }
);
router.get(
  "/api/orders/:id",
  AuthMiddleware,
  async (req: Request, res: Response) => {
    const id = req.params.id;
    const order = await Order.findOne({ _id: id });

    if (!order) {
      throw new NotFoundException();
    }
    if (order.userId !== req.user.id) {
      throw new NotAuthorized();
    }
    res.send(order);
  }
);

router.get(
  "/api/orders",
  AuthMiddleware,
  async (req: Request, res: Response) => {
    const orders = await Order.find({
      userId: req.user.id,
    });
    res.send({ orders });
  }
);

router.delete(
  "/api/orders/:id",
  AuthMiddleware,
  async (req: Request, res: Response) => {
    const id = req.params.id;
    const order = await Order.findOne({
      _id: id,
    });
    if (!order) throw new NotFoundException();
    if (order.userId !== req.user.id) throw new NotAuthorized();
    await order.updateOne({
      status: OrderStatus.Cancelled,
    });
    res.status(204).send();
  }
);

router.use(ExceptionHandlerMiddleware);

export { router as apiRouter };
