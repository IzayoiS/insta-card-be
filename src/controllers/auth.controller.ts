import { Request, Response } from "express";
import { prisma } from "../prisma/client";
import { encrypt } from "../utils/encryption";
import * as Yup from "yup";
import { generateToken } from "../utils/jwt";

type TRegister = {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
};

type TLogin = {
  identifier: string;
  password: string;
};

const registerValidateSchema = Yup.object({
  username: Yup.string().required(),
  email: Yup.string().required(),
  password: Yup.string().required(),
  confirmPassword: Yup.string()
    .required()
    .oneOf([Yup.ref("password"), ""], "Password must be matched"),
});

export default {
  async getUsers(req: Request, res: Response) {
    try {
      const users = await prisma.user.findMany();
      res.status(200).json(users);
    } catch (error) {
      const err = error as unknown as Error;
      res.status(400).json({
        message: err.message,
        data: null,
      });
    }
  },
  async register(req: Request, res: Response) {
    const { username, email, password, confirmPassword } =
      req.body as TRegister;

    try {
      await registerValidateSchema.validate({
        username,
        email,
        password,
        confirmPassword,
      });

      const User = await prisma.user.create({
        data: {
          username,
          email,
          password: encrypt(password),
        },
      });

      res.status(200).json({
        message: "Success registration!",
        data: User,
      });
    } catch (error) {
      const err = error as unknown as Error;
      res.status(400).json({
        message: err.message,
        data: null,
      });
    }
  },
  async login(req: Request, res: Response) {
    const { identifier, password } = req.body as TLogin;
    try {
      const userByIdentifier = await prisma.user.findFirst({
        where: {
          OR: [{ email: identifier }, { username: identifier }],
        },
        select: {
          id: true,
          email: true,
          username: true,
          password: true, // Needed for verification
        },
      });

      if (!userByIdentifier) {
        res.status(403).json({
          message: "user not found",
          data: null,
        });
        return;
      }

      const validatePassword: boolean =
        encrypt(password) === userByIdentifier.password;

      if (!validatePassword) {
        res.status(403).json({
          message: "user not found",
          data: null,
        });
        return;
      }

      const token = generateToken({
        id: userByIdentifier.id,
      });

      res.status(200).json({
        message: "Login success",
        data: {
          username: userByIdentifier.username,
          email: userByIdentifier.email,
          password: userByIdentifier.password,
        },
        token: token,
      });
    } catch (error) {
      const err = error as unknown as Error;
      res.status(400).json({
        message: err.message,
        data: null,
      });
    }
  },
};
