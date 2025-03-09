import { Request, Response, Router } from "express";
import { body, validationResult } from "express-validator";
import ValidationException from "../Exceptions/ValidationException";
import { randomBytes } from "crypto";
import Jwt from "jsonwebtoken";
import AuthMiddleware from "../Middlewares/AuthMiddleware";
import User from "../models/UserModel";
import "express-async-errors";
import Hash from "../services/hash";
import { makeValidationError } from "../helpers/helpers";
import ExceptionHandlerMiddleware from "../Middlewares/ExceptionHandlerMiddleware";
const router = Router();

router.post(
  "/api/auth/signin",
  [
    body("email")
      .notEmpty()
      .withMessage("Email is empty")
      .isEmail()
      .withMessage("Invalid email"),
    body("password").notEmpty().withMessage("passwod is empty"),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ValidationException(errors.array());
    }

    const { email, password } = req.body;

    const existingUser = await User.findOne({ email: email });

    if (!existingUser || !Hash.comapre(password, existingUser?.password))
      throw new ValidationException([
        makeValidationError("email", "Invalid credentials"),
      ]);

    const token = Jwt.sign(existingUser.toJSON(), process.env.JWT_KEY!);

    req.session = {
      jwt: token,
    };

    res.status(200).json({ user: existingUser });
  }
);
router.post(
  "/api/auth/signup",
  [
    body("email")
      .notEmpty()
      .withMessage("Email is empty")
      .isEmail()
      .withMessage("Invalid email"),
    body("password").notEmpty().withMessage("passwod is empty"),
    body("password")
      .isLength({ max: 16, min: 8 })
      .withMessage("Password must be between 8 and 16"),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ValidationException(errors.array());
    }

    const { email, password } = req.body;

    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      throw new ValidationException([
        {
          type: "field",
          location: "body",
          msg: "User already exist",
          path: "email",
        },
      ]);
    }

    const user = await User.create({
      email: email,
      password: password,
    });

    res.status(200).json({
      user,
    });
  }
);
router.get(
  "/api/auth/current-user",
  AuthMiddleware,
  (req: Request, res: Response) => {
    const currentUser = req.user;
    res.status(200).json({
      currentUser,
    });
  }
);
router.post(
  "/api/auth/signout",
  AuthMiddleware,
  (req: Request, res: Response): any => {
    req.session = null;
    res.json({
      message: "Successfully logged out!",
    });
  }
);
router.use(ExceptionHandlerMiddleware);

export { router as apiRouter };
