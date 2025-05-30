import jwt from "jsonwebtoken";
import { SECRET } from "./env";
import { User } from "@prisma/client";

export interface IUserToken {
  id?: string;
}

export const generateToken = (user: IUserToken) => {
  const token = jwt.sign(user, SECRET, {
    expiresIn: "1h",
  });
  return token;
};
export const getUserData = (token: string) => {
  const user = jwt.verify(token, SECRET) as IUserToken;
  return user;
};
