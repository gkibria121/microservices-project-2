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
import OrderCreatedPublisher from "../events/publishers/order-created-publisher";
import { natsWrapper } from "../lib/natas-client";
import OrderCancelledPublisher from "../events/publishers/order-cancelled-publisher";

const ORDER_EXPIRATION_SECONDS = 60 * 60 * 24;

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
      expiresAt: new Date().getTime() + ORDER_EXPIRATION_SECONDS,
      ticket: ticket,
    });

    new OrderCreatedPublisher(natsWrapper.client).publish(
      {
        id: order.id,
        expiresAt: order.expiresAt.toDateString(),
        status: order.status,
        userId: req.user.id,
        ticket: {
          id: ticket.id,
          price: ticket.price,
          title: ticket.title,
          userId: ticket.userId,
        },
      },
      () => {
        console.log("OrderCreated published!");
      }
    );
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

    new OrderCancelledPublisher(natsWrapper.client).publish(
      {
        id: order.id,
        ticket: {
          id: order.ticket.id,
        },
      },
      () => {
        console.log("OrderCancelled published!");
      }
    );
    res.status(204).send();
  }
);

router.use(ExceptionHandlerMiddleware);

export { router as apiRouter };
