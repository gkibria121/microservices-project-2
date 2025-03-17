import { Request, Response, Router } from "express";
import { body, validationResult } from "express-validator";
import { ValidationException } from "@_gktickets/common";
import TicketCreatedPublisher from "./../events/publishers/ticket-created-publisher";
import {
  AuthMiddleware,
  NotFoundException,
  NotAuthorized,
} from "@_gktickets/common";
import "express-async-errors";
import { makeValidationError } from "@_gktickets/common";
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

  async (req: Request, res: Response) => {
    const validated = validationResult(req);
    if (!validated.isEmpty()) {
      throw new ValidationException(validated.array());
    }
    const { title, price } = req.body;
    const Ticket = await TicketModel.create({
      title,
      price,
      userId: req.user.id,
    });
    new TicketCreatedPublisher(natsWrapper.client).publish({
      id: Ticket.id,
      price: Ticket.price,
      title: Ticket.title,
    });
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
  async (req: Request, res: Response) => {
    const id = req.params.id;

    const ticket = await TicketModel.findOne({ _id: id });

    if (!ticket) {
      throw new NotFoundException();
    }

    console.log(ticket.userId, req.user.id);
    if (ticket.userId !== req.user.id) {
      throw new NotAuthorized();
    }

    const validated = validationResult(req);

    if (!validated.isEmpty()) {
      throw new ValidationException(validated.array());
    }
    const { title, price } = req.body;

    ticket.set({
      title,
      price,
    });

    await ticket.save();

    new TicketUpdatedPublisher(natsWrapper.client).publish({
      id: ticket.id,
      price: ticket.price,
      title: ticket.title,
    });

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

    await ticket.deleteOne();
    new TicketDeletedPublisher(natsWrapper.client).publish(null);
    res.status(204).send();
  }
);

router.use(ExceptionHandlerMiddleware);

export { router as apiRouter };
