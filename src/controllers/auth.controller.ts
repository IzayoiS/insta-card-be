import { NextFunction, Request, Response } from 'express';
import { prisma } from '../prisma/client';
import { encrypt } from '../utils/encryption';
import * as Yup from 'yup';
import { generateToken } from '../utils/jwt';
import { IReqUser } from '../middlewares/auth.middleware';

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
  username: Yup.string()
    .required()
    .test('is-unique-username', 'Username is already taken', async (value) => {
      if (!value) return false;
      const user = await prisma.user.findUnique({ where: { username: value } });
      return !user;
    }),
  email: Yup.string()
    .required()
    .test('is-unique-email', 'Email is already registered', async (value) => {
      if (!value) return false;
      const user = await prisma.user.findUnique({ where: { email: value } });
      return !user;
    }),
  password: Yup.string()
    .required()
    .min(6, 'Password must be at least 6 characters')
    .test(
      'at-least-one-uppercase-letter',
      'Contains at least one oppercase letter',
      (value) => {
        if (!value) return false;
        const regex = /^(?=.*[A-Z])/;
        return regex.test(value);
      },
    )
    .test(
      'at-least-one-number',
      'Contains at least one oppercase letter',
      (value) => {
        if (!value) return false;
        const regex = /^(?=.*\d)/;
        return regex.test(value);
      },
    ),
  confirmPassword: Yup.string()
    .required()
    .oneOf([Yup.ref('password'), ''], 'Password must be matched'),
});

export default {
  async register(req: Request, res: Response) {
    /**
     #swagger.tags = ['Auth']
		 #swagger.requestBody ={
     required: true, 
     schema : {$ref: "#components/schemas/RegisterRequest"}
     }
		 */
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
        message: 'Success registration!',
        data: { username: User.username, email: User.email },
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
    /**
		 #swagger.tags =['Auth']
		 #swagger.requestBody = {
		 	required: true,
			schema: {$ref: "#/components/schemas/LoginRequest"}
		 }
		 */
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
          message: 'user not found',
          data: null,
        });
        return;
      }

      const validatePassword: boolean =
        encrypt(password) === userByIdentifier.password;

      if (!validatePassword) {
        res.status(403).json({
          message: 'password is wrong',
          data: null,
        });
        return;
      }

      const token = generateToken({
        id: userByIdentifier.id,
      });

      res.status(200).json({
        message: 'Login success',
        data: {
          username: userByIdentifier.username,
          email: userByIdentifier.email,
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
  async me(req: IReqUser, res: Response) {
    /**
		 #swagger.tags =['Auth']
		 #swagger.security = [{
		 	"bearerAuth" : []
		 }]
		 */
    try {
      const user = req.user;

      const result = await prisma.user.findUnique({
        where: { id: user?.id },
        select: {
          email: true,
          username: true,
          profile: true,
        },
      });

      res.status(200).json({
        message: 'Success get user profile',
        data: result,
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
