import jwt from "jsonwebtoken";
import { SECRET } from "./env";

export interface IUserToken {
  id?: string;
}

export const generateToken = (user: IUserToken) => {
  const token = jwt.sign(user, SECRET, {
    expiresIn: "1d",
  });
  return token;
};
export const getUserData = (token: string) => {
  const user = jwt.verify(token, SECRET) as IUserToken;
  return user;
};
