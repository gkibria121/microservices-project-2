import { Request, Response, Router } from "express";
import { body } from "express-validator";
import { RequestValidatorMiddleware } from "@_gktickets/common";
import TicketCreatedPublisher from "./../events/publishers/ticket-created-publisher";
import {
  AuthMiddleware,
  NotFoundException,
  NotAuthorized,
} from "@_gktickets/common";
import "express-async-errors";
import { ExceptionHandlerMiddleware } from "@_gktickets/common";
import TicketModel from "../models/Ticket";
import { natsWrapper } from "../lib/natas-client";
import TicketUpdatedPublisher from "../events/publishers/ticket-updated-publisher";
import TicketDeletedPublisher from "../events/publishers/ticket-deleted-publisher";
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
  RequestValidatorMiddleware,

  async (req: Request, res: Response) => {
    const { title, price } = req.body;
    const Ticket = await TicketModel.create({
      title,
      price,
      userId: req.user.id,
    });
    new TicketCreatedPublisher(natsWrapper.client).publish(
      {
        id: Ticket.id,
        price: Ticket.price,
        title: Ticket.title,
        userId: req.user.id,
        version: Ticket.version,
      },
      () => {
        console.log("Ticket created published!");
      }
    );
    res.status(201).json({
      message: "Ticket created!",
      data: {
        ...Ticket.toJSON(),
      },
    });
  }
);

router.get("/api/tickets/:id", async (req: Request, res: Response) => {
  const id = req.params.id;

  const ticket = await TicketModel.findOne({ _id: id });

  if (!ticket) {
    throw new NotFoundException();
  }

  res.json({
    ...ticket.toJSON(),
  });
});
router.get("/api/tickets", async (req: Request, res: Response) => {
  const ticket = await TicketModel.find({});

  if (!ticket) {
    throw new NotFoundException();
  }

  res.json({
    tickets: ticket,
  });
});

router.put(
  "/api/tickets/:id",
  AuthMiddleware,
  [
    body("title").notEmpty().withMessage("Title is required"),
    body("price")
      .notEmpty()
      .isFloat({ gt: 0 })
      .withMessage("Price must be greater then 0"),
  ],
  RequestValidatorMiddleware,
  async (req: Request, res: Response) => {
    const id = req.params.id;

    const ticket = await TicketModel.findOne({ _id: id });

    if (!ticket) {
      throw new NotFoundException();
    }

    if (ticket.userId !== req.user.id) {
      throw new NotAuthorized();
    }

    const { title, price } = req.body;

    ticket.set({
      title,
      price,
    });

    await ticket.save();

    new TicketUpdatedPublisher(natsWrapper.client).publish(
      {
        id: ticket.id,
        price: ticket.price,
        title: ticket.title,
        userId: req.user.id,
        version: ticket.version,
      },
      () => {
        console.log("Ticket updated published!");
      }
    );

    res.json({
      ...ticket.toJSON(),
    });
  }
);

router.delete(
  "/api/tickets/:id",
  AuthMiddleware,
  async (req: Request, res: Response) => {
    const id = req.params.id;

    const ticket = await TicketModel.findOne({ _id: id });

    if (!ticket) {
      throw new NotFoundException();
    }

    if (ticket.userId !== req.user.id) {
      throw new NotAuthorized();
    }

    if (ticket.orderId) {
      throw new Error("Ticket id reserved!");
    }
    await ticket.deleteOne();
    new TicketDeletedPublisher(natsWrapper.client).publish(
      { id: ticket.id },
      () => {
        console.log("Ticket deleted published!");
      }
    );
    res.status(204).send();
  }
);

router.use(ExceptionHandlerMiddleware);

export { router as apiRouter };
