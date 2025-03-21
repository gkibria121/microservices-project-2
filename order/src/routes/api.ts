import { Request, Response, Router } from "express";
import { body, validationResult } from "express-validator";
import { ValidationException } from "@_gktickets/common";
import { AuthMiddleware } from "@_gktickets/common";
import "express-async-errors";
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
  "/api/orders/create",
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
  }
);

router.get("/api/orders/:id", async (req: Request, res: Response) => {
  const id = req.params.id;
});
router.get("/api/tickets", async (req: Request, res: Response) => {});

router.delete(
  "/api/orders/:id",
  AuthMiddleware,
  async (req: Request, res: Response) => {
    const id = req.params.id;
  }
);

router.use(ExceptionHandlerMiddleware);

export { router as apiRouter };
